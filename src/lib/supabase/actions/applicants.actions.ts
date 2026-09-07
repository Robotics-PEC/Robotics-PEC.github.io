import { client } from "../supabase";
import { ApplicantType, ReviewScore } from "@/types";

export type CreateApplicantResult =
    | {
          success: true;
          applicant: ApplicantType;
      }
    | {
          success: false;
          reason: "duplicate" | "error";
      };

/*
 * ---------------------------------------------------------
 * Refresh interview schedule
 * ---------------------------------------------------------
 *
 * The scheduler always rebuilds the schedule from the
 * current PENDING applicant pool in Supabase.
 *
 * IMPORTANT:
 * A failure here must never make an otherwise successful
 * application/update/decision operation fail.
 */

const requestInterviewSchedule =
    async (): Promise<void> => {
        // Skip in dev — edge functions only exist on the production Supabase project
        if (process.env.NODE_ENV !== "production") return;

        try {
            const {
                error,
            } =
                await client.functions.invoke(
                    "schedule-interviews",
                    {
                        body: {},
                    }
                );

            if (error) {
                console.error(
                    "Interview schedule refresh failed:",
                    error
                );
            }
        } catch (error) {
            console.error(
                "Interview schedule refresh failed:",
                error
            );
        }
    };

/*
 * ---------------------------------------------------------
 * Map database applicant to ApplicantType
 * ---------------------------------------------------------
 */

const mapApplicant = (
    item: any
): ApplicantType => {
    const response =
        item.applicant_response;

    const responseData =
        Array.isArray(response)
            ? response[0]
            : response;

    return {
        ...item,

        userId:
            item.userId,

        status:
            item.status?.toLowerCase(),

        createdAt:
            item.createdAt ||
            item.created_at,

        gender:
            item.gender ?? null,

        isHostellers:
            item.isHostellers ?? null,

        branch:
            responseData?.branch,

        responses:
            responseData?.responses,
    } as ApplicantType;
};

/*
 * ---------------------------------------------------------
 * Get applicant by user ID
 * ---------------------------------------------------------
 */
export const getApplicantByUserId = async (userId: string): Promise<ApplicantType | null> => {
    const { data, error } = await client
        .from("applicants")
        .select(`
            *,
            applicant_response (
                branch,
                responses
            )
        `)
        .eq("userId", userId)
        .maybeSingle();

    if (error || !data) {
        if (error) console.error("Failed to fetch applicant by userId:", error);
        return null;
    }

    return mapApplicant(data);
};

/*
 * ---------------------------------------------------------
 * Link unassigned applicant to user ID (for walk-ins)
 * ---------------------------------------------------------
 */
export const linkApplicantToUser = async (sid: string, userId: string): Promise<ApplicantType | null> => {
    // Normalize SID
    const normalizedSid = sid.trim().toUpperCase();

    // Try to find applicant by SID
    const { data: fetch, error: fetchError } = await client
        .from("applicants")
        .select("id, userId")
        .eq("sid", normalizedSid)
        .maybeSingle();

    if (fetchError || !fetch) {
        return null;
    }

    if (fetch.userId && fetch.userId !== userId) {
        // Already linked to someone else
        return null;
    }

    if (!fetch.userId) {
        // Link them
        const { error: updateError } = await client
            .from("applicants")
            .update({ userId })
            .eq("id", fetch.id);
            
        if (updateError) {
            console.error("Failed to link applicant:", updateError);
            return null;
        }
    }

    return getApplicantByUserId(userId);
};

/*
 * ---------------------------------------------------------
 * Fetch all applicants
 * ---------------------------------------------------------
 */

export const fetchApplicants =
    async (): Promise<
        ApplicantType[]
    > => {
        const {
            data,
            error,
        } = await client
            .from("applicants")
            .select(
                "*, applicant_response(branch, responses)"
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            );

        if (error) {
            console.error(
                "Error fetching applicants:",
                error
            );

            return [];
        }

        return (
            (data as any[]) || []
        ).map(mapApplicant);
    };

/*
 * ---------------------------------------------------------
 * Fetch applicant with responses
 * ---------------------------------------------------------
 */

export const fetchApplicantWithResponses =
    async (
        id: string
    ): Promise<
        ApplicantType | null
    > => {
        const {
            data,
            error,
        } = await client
            .from("applicants")
            .select(
                "*, applicant_response(branch, responses)"
            )
            .eq(
                "id",
                id
            )
            .single();

        if (
            error ||
            !data
        ) {
            return null;
        }

        return mapApplicant(data);
    };

/*
 * ---------------------------------------------------------
 * Fetch current user's application
 * ---------------------------------------------------------
 */

export const fetchMyApplication =
    async (): Promise<
        ApplicantType | null
    > => {
        const {
            data: {
                user,
            },
            error: userError,
        } =
            await client.auth.getUser();

        if (
            userError ||
            !user
        ) {
            return null;
        }

        const {
            data,
            error,
        } = await client
            .from("applicants")
            .select(
                "*, applicant_response(branch, responses)"
            )
            .eq(
                "userId",
                user.id
            )
            .maybeSingle();

        if (
            error ||
            !data
        ) {
            return null;
        }

        return mapApplicant(data);
    };

/*
 * ---------------------------------------------------------
 * Create walk-in applicant
 * ---------------------------------------------------------
 */

export const createWalkIn =
    async (
        name: string,
        sid: string,
        phone: string
    ): Promise<
        ApplicantType | null
    > => {
        const {
            data,
            error,
        } = await client
            .from("applicants")
            .insert([
                {
                    name,
                    sid,
                    phone:
                        phone || null,
                    isWalkin:
                        true,
                    status:
                        "PENDING",
                },
            ])
            .select()
            .single();

        if (
            error ||
            !data
        ) {
            return null;
        }

        return mapApplicant(
            data
        );
    };

/*
 * ---------------------------------------------------------
 * Create normal applicant
 * ---------------------------------------------------------
 */

export const createApplicant =
    async (
        name: string,
        sid: string,
        phone: string,
        branch: string,
        gender:
            | "male"
            | "female",
        isHostellers: boolean,
        responses: Record<
            string,
            string
        >
    ): Promise<
        CreateApplicantResult
    > => {
        /*
         * Get logged-in user.
         */

        const {
            data: {
                user,
            },
            error: userError,
        } =
            await client.auth.getUser();

        if (
            userError ||
            !user
        ) {
            console.error(
                "Cannot create application without an authenticated user:",
                userError
            );

            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Check whether this account has already
         * submitted an application.
         */

        const {
            data:
                existingApplicant,
            error:
                existingApplicantError,
        } = await client
            .from("applicants")
            .select("id")
            .eq(
                "userId",
                user.id
            )
            .maybeSingle();

        if (
            existingApplicantError
        ) {
            console.error(
                "Error checking existing application:",
                existingApplicantError
            );

            return {
                success: false,
                reason: "error",
            };
        }

        if (
            existingApplicant
        ) {
            return {
                success: false,
                reason: "duplicate",
            };
        }

        /*
         * Create applicant.
         */

        const {
            data:
                applicantData,
            error:
                applicantError,
        } = await client
            .from("applicants")
            .insert([
                {
                    userId:
                        user.id,

                    name,

                    sid,

                    phone:
                        phone || null,

                    gender,

                    isHostellers,

                    isWalkin:
                        false,

                    status:
                        "PENDING",
                },
            ])
            .select()
            .single();

        if (
            applicantError ||
            !applicantData
        ) {
            /*
             * Unique userId constraint means this is
             * already a submitted account.
             */
            if (
                applicantError?.code ===
                "23505"
            ) {
                return {
                    success: false,
                    reason: "duplicate",
                };
            }

            console.error(
                "Error creating applicant:",
                applicantError
            );

            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Store branch + answers.
         */

        const {
            error:
                responseError,
        } = await client
            .from(
                "applicant_response"
            )
            .insert([
                {
                    applicantId:
                        applicantData.id,

                    branch,

                    responses,
                },
            ]);

        if (
            responseError
        ) {
            console.error(
                "Error creating applicant response:",
                responseError
            );

            /*
             * Roll back applicant if the response
             * record could not be created.
             */
            await client
                .from(
                    "applicants"
                )
                .delete()
                .eq(
                    "id",
                    applicantData.id
                );

            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Sync application to Google Sheets.
         *
         * Supabase remains the source of truth, so a
         * Google Sheets failure does not invalidate the
         * successful application.
         */

        try {
            if (process.env.NODE_ENV === "production") {
            const {
                error:
                    sheetsError,
            } =
                await client.functions.invoke(
                    "sync-application-to-sheets",
                    {
                        body: {
                            operation:
                                "application",

                            applicationId:
                                applicantData.id,

                            name,

                            phone,

                            sid,

                            branch,

                            gender,

                            isHostellers,

                            q1:
                                responses.Q1 ||
                                "",

                            q2:
                                responses.Q2 ||
                                "",

                            q3:
                                responses.Q3 ||
                                "",

                            q4:
                                responses.Q4 ||
                                "",
                        },
                    }
                );

            if (
                sheetsError
            ) {
                console.error(
                    "Application saved to Supabase, but Google Sheets synchronization failed:",
                    sheetsError
                );
            }
            } // end production-only block
        } catch (error) {
            console.error(
                "Application saved to Supabase, but Google Sheets synchronization failed:",
                error
            );
        }

        return {
            success: true,

            applicant: {
                ...applicantData,

                userId:
                    applicantData.userId,

                status:
                    applicantData.status?.toLowerCase(),

                createdAt:
                    applicantData.createdAt ||
                    applicantData.created_at,

                branch,

                gender,

                isHostellers,

                responses,
            } as ApplicantType,
        };
    };

/*
 * ---------------------------------------------------------
 * Update applicant personal information
 * ---------------------------------------------------------
 *
 * Editable while PENDING:
 *
 * - Name
 * - Phone
 * - SID
 * - Branch
 * - Gender
 * - Hosteller / Day Scholar
 *
 * Application answers remain untouched.
 */

export const updateApplicantPersonalInfo =
    async (
        applicantId: string,
        name: string,
        phone: string,
        sid: string,
        branch: string,
        gender:
            | "male"
            | "female",
        isHostellers: boolean
    ): Promise<
        | {
              success: true;
              applicant: ApplicantType;
          }
        | {
              success: false;
              reason:
                  | "error"
                  | "not_found";
          }
    > => {
        const {
            data: {
                user,
            },
            error: userError,
        } =
            await client.auth.getUser();

        if (
            userError ||
            !user
        ) {
            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Update only the authenticated user's own
         * still-pending application.
         */

        const {
            data,
            error,
        } = await client
            .from("applicants")
            .update({
                name,

                phone:
                    phone || null,

                sid,

                gender,

                isHostellers,
            })
            .eq(
                "id",
                applicantId
            )
            .eq(
                "userId",
                user.id
            )
            .eq(
                "status",
                "PENDING"
            )
            .select()
            .single();

        if (
            error ||
            !data
        ) {
            console.error(
                "Error updating applicant:",
                error
            );

            return {
                success: false,
                reason:
                    error?.code ===
                    "PGRST116"
                        ? "not_found"
                        : "error",
            };
        }

        /*
         * Update branch separately because branch
         * lives in applicant_response.
         */

        const {
            error:
                branchError,
        } = await client
            .from(
                "applicant_response"
            )
            .update({
                branch,
            })
            .eq(
                "applicantId",
                applicantId
            );

        if (
            branchError
        ) {
            console.error(
                "Error updating branch:",
                branchError
            );

            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Update the existing application row
         * in Google Sheets.
         */

        if (process.env.NODE_ENV === "production") try {
            const {
                error:
                    sheetsError,
            } =
                await client.functions.invoke(
                    "sync-application-to-sheets",
                    {
                        body: {
                            operation:
                                "update_application",

                            applicationId:
                                applicantId,

                            name,

                            phone,

                            sid,

                            branch,

                            gender,

                            isHostellers,
                        },
                    }
                );

            if (
                sheetsError
            ) {
                console.error(
                    "Personal information saved to Supabase, but Google Sheets synchronization failed:",
                    sheetsError
                );
            }
        } catch (error) {
            console.error(
                "Personal information saved to Supabase, but Google Sheets synchronization failed:",
                error
            );
        }

        /*
         * Rebuild schedule because:
         *
         * - name can change in the shared sheet
         * - SID can change in the shared sheet
         * - gender can change priority
         * - hosteller/day-scholar can change priority
         */
        await requestInterviewSchedule();

        /*
         * Fetch complete updated applicant.
         */

        const {
            data:
                completeApplicant,
            error:
                fetchError,
        } = await client
            .from("applicants")
            .select(
                "*, applicant_response(branch, responses)"
            )
            .eq(
                "id",
                applicantId
            )
            .eq(
                "userId",
                user.id
            )
            .single();

        if (
            fetchError ||
            !completeApplicant
        ) {
            return {
                success: false,
                reason: "error",
            };
        }

        return {
            success: true,

            applicant:
                mapApplicant(
                    completeApplicant
                ),
        };
    };

/*
 * ---------------------------------------------------------
 * Generic applicant update
 * ---------------------------------------------------------
 *
 * Existing admin/panelist functionality is preserved.
 */

export const updateApplicant =
    async (
        applicantId: string,
        data: {
            name: string;
            sid: string;
            phone: string;
            remarks?: string;
            branch?: string;
            gender?:
                | "male"
                | "female";
            isHostellers?: boolean;
            responses?: Record<
                string,
                string
            >;
            reviewScore?: ReviewScore;
        }
    ): Promise<
        ApplicantType | null
    > => {
        const {
            error:
                applicantError,
        } = await client
            .from("applicants")
            .update({
                name:
                    data.name.trim(),

                sid:
                    data.sid.trim(),

                phone:
                    data.phone.trim() ||
                    null,

                remarks:
                    data.remarks?.trim() ||
                    null,

                ...(data.gender !==
                undefined
                    ? {
                          gender:
                              data.gender,
                      }
                    : {}),

                ...(data.isHostellers !==
                undefined
                    ? {
                          isHostellers:
                              data.isHostellers,
                      }
                    : {}),

                ...(data.reviewScore !==
                undefined
                    ? {
                          reviewScore:
                              data.reviewScore,
                      }
                    : {}),
            })
            .eq(
                "id",
                applicantId
            );

        if (
            applicantError
        ) {
            console.error(
                "Error updating applicant:",
                applicantError
            );

            return null;
        }

        /*
         * Update applicant response if required.
         */

        if (
            data.branch !==
                undefined ||
            data.responses !==
                undefined
        ) {
            const {
                data:
                    existingResponse,
                error:
                    responseFetchError,
            } = await client
                .from(
                    "applicant_response"
                )
                .select("id")
                .eq(
                    "applicantId",
                    applicantId
                )
                .limit(1)
                .maybeSingle();

            if (
                responseFetchError
            ) {
                console.error(
                    "Error finding applicant response:",
                    responseFetchError
                );

                return null;
            }

            if (
                existingResponse
            ) {
                const responseUpdate: {
                    branch?: string;
                    responses?: Record<
                        string,
                        string
                    >;
                } = {};

                if (
                    data.branch !==
                    undefined
                ) {
                    responseUpdate.branch =
                        data.branch.trim();
                }

                if (
                    data.responses !==
                    undefined
                ) {
                    responseUpdate.responses =
                        data.responses;
                }

                const {
                    error:
                        responseUpdateError,
                } = await client
                    .from(
                        "applicant_response"
                    )
                    .update(
                        responseUpdate
                    )
                    .eq(
                        "id",
                        existingResponse.id
                    );

                if (
                    responseUpdateError
                ) {
                    console.error(
                        "Error updating applicant response:",
                        responseUpdateError
                    );

                    return null;
                }
            } else {
                const {
                    error:
                        responseInsertError,
                } = await client
                    .from(
                        "applicant_response"
                    )
                    .insert([
                        {
                            applicantId,

                            branch:
                                data.branch?.trim() ||
                                "",

                            responses:
                                data.responses ||
                                {},
                        },
                    ]);

                if (
                    responseInsertError
                ) {
                    console.error(
                        "Error creating applicant response:",
                        responseInsertError
                    );

                    return null;
                }
            }
        }

        /*
         * Keep the shared interview schedule synchronized
         * with admin/panelist edits as well.
         *
         * If this applicant is not PENDING, the scheduler will
         * simply exclude them.
         */
        await requestInterviewSchedule();

        return await fetchApplicantWithResponses(
            applicantId
        );
    };

/*
 * ---------------------------------------------------------
 * Accept / reject applicant
 * ---------------------------------------------------------
 *
 * PENDING -> ACCEPTED/REJECTED removes the applicant
 * from the interview schedule.
 */


export const updateApplicantReview =
    async (
        applicantId: string,
        status: string,
        reviewScore: ReviewScore,
        remarks: string,
        reviewedBy: string
    ): Promise<boolean> => {
        const reviewedAt =
            new Date().toISOString();

        const {
            error,
        } = await client
            .from("applicants")
            .update({
                reviewScore,

                remarks,

                reviewedBy,

                reviewedAt,
            })
            .eq(
                "id",
                applicantId
            );

        if (
            error
        ) {
            console.error(
                "Error updating applicant decision:",
                error
            );

            return false;
        }

        /*
         * Keep Results sheet synchronized.
         */

        if (process.env.NODE_ENV === "production") try {
            const {
                error:
                    sheetsError,
            } =
                await client.functions.invoke(
                    "sync-application-to-sheets",
                    {
                        body: {
                            operation:
                                "result",

                            applicationId:
                                applicantId,

                            status,
                            
                            reviewScore,

                            remarks,

                            reviewedBy,

                            reviewedAt,
                        },
                    }
                );

            if (
                sheetsError
            ) {
                console.error(
                    "Decision saved to Supabase, but Results Sheet synchronization failed:",
                    sheetsError
                );
            }
        } catch (error) {
            console.error(
                "Decision saved to Supabase, but Results Sheet synchronization failed:",
                error
            );
        }

        return true;
    };

/*
 * ---------------------------------------------------------
 * Reset applicant decision
 * ---------------------------------------------------------
 *
 * PENDING again means the applicant needs an interview
 * and therefore must re-enter the shared schedule.
 */

export const resetApplicantDecision =
    async (
        applicantId: string
    ): Promise<boolean> => {
        const {
            error,
        } = await client
            .from("applicants")
            .update({
                status:
                    "PENDING",

                remarks: null,

                reviewedBy: null,

                reviewedAt: null,
            })
            .eq(
                "id",
                applicantId
            );

        if (
            error
        ) {
            console.error(
                "Error resetting applicant decision:",
                error
            );

            return false;
        }

        /*
         * Re-add the applicant to the schedule.
         */
        await requestInterviewSchedule();

        return true;
    };

/*
 * ---------------------------------------------------------
 * Realtime applicant updates
 * ---------------------------------------------------------
 */

export const subscribeToApplicantUpdates =
    (
        onUpdate: (
            applicant: ApplicantType
        ) => void,

        onInsert: (
            applicant: ApplicantType
        ) => void
    ) => {
        const channel =
            client
                .channel(
                    `applicants-status-${Date.now()}`
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "UPDATE",

                        schema:
                            "public",

                        table:
                            "applicants",
                    },
                    (
                        payload: any
                    ) => {
                        onUpdate(
                            mapApplicant(
                                payload.new
                            )
                        );
                    }
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "INSERT",

                        schema:
                            "public",

                        table:
                            "applicants",
                    },
                    (
                        payload: any
                    ) => {
                        onInsert(
                            mapApplicant(
                                payload.new
                            )
                        );
                    }
                )
                .subscribe();

        return () => {
            client.removeChannel(
                channel
            );
        };
    };

export const batchUpdateApplicantStatuses = async (
    updates: { id: string; status: "accepted" | "rejected" }[]
): Promise<{ success: boolean; updatedCount: number }> => {
    try {
        // 1. Separate the IDs into two arrays
        const acceptedIds = updates.filter(u => u.status === "accepted").map(u => u.id);
        const rejectedIds = updates.filter(u => u.status === "rejected").map(u => u.id);

        const promises = [];

        // 2. Fire exactly ONE request for all accepted applicants
        if (acceptedIds.length > 0) {
            promises.push(
                client.from("applicants")
                    .update({ status: "ACCEPTED" })
                    .in("id", acceptedIds)
                    .select("id")
            );
        }

        // 3. Fire exactly ONE request for all rejected applicants
        if (rejectedIds.length > 0) {
            promises.push(
                client.from("applicants")
                    .update({ status: "REJECTED" })
                    .in("id", rejectedIds)
                    .select("id")
            );
        }

        // 4. Await the 1 or 2 bulk requests concurrently
        const results = await Promise.all(promises);

        let updatedCount = 0;
        for (const result of results) {
            if (result.error) {
                console.error("Batch update error:", result.error);
                return { success: false, updatedCount };
            }
            updatedCount += result.data?.length ?? 0;
        }

        return { success: true, updatedCount };
    } catch (e) {
        console.error("Batch update failed:", e);
        return { success: false, updatedCount: 0 };
    }
};
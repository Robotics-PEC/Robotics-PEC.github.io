import { client } from "../supabase";
import { ApplicantType } from "@/types";

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
 * Shared applicant mapper
 * ---------------------------------------------------------
 */

const mapApplicant = (item: any): ApplicantType => {
    const response = item.applicant_response;

    const responseData = Array.isArray(response)
        ? response[0]
        : response;

    return {
        ...item,

        // Convert database user_id to application userId
        userId: item.user_id,

        status: item.status?.toLowerCase(),

        createdAt:
            item.createdAt ||
            item.created_at,

        // Personal information
        gender: item.gender ?? null,
        hosteller: item.hosteller ?? null,

        // Regular application fields
        branch: responseData?.branch,
        responses: responseData?.responses,
    } as ApplicantType;
};

/*
 * ---------------------------------------------------------
 * Fetch all applicants
 * ---------------------------------------------------------
 */

export const fetchApplicants = async (): Promise<
    ApplicantType[]
> => {
    const { data, error } = await client
        .from("applicants")
        .select(
            "*, applicant_response(branch, responses)"
        )
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error(
            "Error fetching applicants:",
            error
        );

        return [];
    }

    return (data as any[]).map(mapApplicant);
};

/*
 * ---------------------------------------------------------
 * Fetch one applicant with complete responses
 * ---------------------------------------------------------
 */

export const fetchApplicantWithResponses =
    async (
        id: string
    ): Promise<ApplicantType | null> => {
        const { data, error } = await client
            .from("applicants")
            .select(
                "*, applicant_response(branch, responses)"
            )
            .eq("id", id)
            .single();

        if (error) {
            console.error(
                "Error fetching applicant with responses:",
                error
            );

            return null;
        }

        return mapApplicant(data);
    };

/*
 * ---------------------------------------------------------
 * Fetch currently logged-in user's application
 * ---------------------------------------------------------
 */

export const fetchMyApplication =
    async (): Promise<ApplicantType | null> => {
        const {
            data: { user },
            error: userError,
        } = await client.auth.getUser();

        if (userError || !user) {
            return null;
        }

        const { data, error } = await client
            .from("applicants")
            .select(
                "*, applicant_response(branch, responses)"
            )
            .eq("user_id", user.id)
            .maybeSingle();

        if (error) {
            console.error(
                "Error fetching current user's application:",
                error
            );

            return null;
        }

        if (!data) {
            return null;
        }

        return mapApplicant(data);
    };

/*
 * ---------------------------------------------------------
 * Create a walk-in applicant
 * ---------------------------------------------------------
 *
 * Walk-ins are not associated with a logged-in user.
 */

export const createWalkIn = async (
    name: string,
    sid: string,
    phone: string
): Promise<ApplicantType | null> => {
    const { data, error } = await client
        .from("applicants")
        .insert([
            {
                name,
                sid,
                phone: phone || null,
                isWalkin: true,
                status: "PENDING",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error(
            "Error creating walk-in:",
            error
        );

        return null;
    }

    return {
        ...data,

        userId: data.user_id,

        status:
            data.status?.toLowerCase(),

        createdAt:
            data.createdAt ||
            data.created_at,
    } as ApplicantType;
};

/*
 * ---------------------------------------------------------
 * Create a normal application
 * ---------------------------------------------------------
 *
 * One authenticated account can have only one application.
 *
 * This is enforced by the unique user_id constraint in
 * Supabase. The pre-check below is only for a better UX.
 */

export const createApplicant = async (
    name: string,
    sid: string,
    phone: string,
    branch: string,
    gender: "male" | "female",
    hosteller: "yes" | "no",
    responses: Record<string, string>
): Promise<CreateApplicantResult> => {
    /*
     * -----------------------------------------------------
     * 1. Get authenticated user
     * -----------------------------------------------------
     */

    const {
        data: { user },
        error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
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
     * -----------------------------------------------------
     * 2. Friendly existing-application check
     * -----------------------------------------------------
     */

    const {
        data: existingApplicant,
        error: existingApplicantError,
    } = await client
        .from("applicants")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existingApplicantError) {
        console.error(
            "Error checking existing application:",
            existingApplicantError
        );

        return {
            success: false,
            reason: "error",
        };
    }

    if (existingApplicant) {
        return {
            success: false,
            reason: "duplicate",
        };
    }

    /*
     * -----------------------------------------------------
     * 3. Create applicant
     * -----------------------------------------------------
     *
     * gender and hosteller are stored in the
     * main applicants table.
     */

    const {
        data: applicantData,
        error: applicantError,
    } = await client
        .from("applicants")
        .insert([
            {
                user_id: user.id,
                name,
                sid,
                phone: phone || null,

                gender,
                hosteller,

                isWalkin: false,
                status: "PENDING",
            },
        ])
        .select()
        .single();

    if (applicantError) {
        /*
         * PostgreSQL unique constraint violation.
         */

        if (
            applicantError.code ===
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
     * -----------------------------------------------------
     * 4. Store application responses
     * -----------------------------------------------------
     *
     * branch and responses are stored in
     * applicant_response.
     */

    const {
        error: responseError,
    } = await client
        .from("applicant_response")
        .insert([
            {
                applicantId:
                    applicantData.id,
                branch,
                responses,
            },
        ]);

    if (responseError) {
        console.error(
            "Error creating applicant response:",
            responseError
        );

        /*
         * Roll back applicant if response
         * creation fails.
         */

        await client
            .from("applicants")
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
     * -----------------------------------------------------
     * 5. Sync application to Google Sheets
     * -----------------------------------------------------
     */

    const {
        data: sheetsData,
        error: sheetsError,
    } = await client.functions.invoke(
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
                hosteller,

                q1:
                    responses.Q1 || "",

                q2:
                    responses.Q2 || "",

                q3:
                    responses.Q3 || "",

                q4:
                    responses.Q4 || "",
            },
        }
    );

    /*
     * Supabase is the source of truth.
     * Sheets failure does not invalidate the application.
     */

    if (sheetsError) {
        console.error(
            "Application saved to Supabase, but Google Sheets synchronization failed:",
            sheetsError
        );
    } else if (
        sheetsData?.success === false
    ) {
        console.error(
            "Google Sheets synchronization failed:",
            sheetsData
        );
    }

    /*
     * -----------------------------------------------------
     * 6. Return created applicant
     * -----------------------------------------------------
     */

    return {
        success: true,

        applicant: {
            ...applicantData,

            userId:
                applicantData.user_id,

            status:
                applicantData.status?.toLowerCase(),

            createdAt:
                applicantData.createdAt ||
                applicantData.created_at,

            branch,
            gender,
            hosteller,
            responses,
        } as ApplicantType,
    };
};

/*
 * ---------------------------------------------------------
 * Update personal information for logged-in applicant
 * ---------------------------------------------------------
 *
 * Editable:
 * - name
 * - phone
 * - sid
 * - branch
 * - gender
 * - hosteller
 *
 * Only PENDING applications can be edited.
 */

export const updateApplicantPersonalInfo =
    async (
        applicantId: string,
        name: string,
        phone: string,
        sid: string,
        branch: string,
        gender: "male" | "female",
        hosteller: "yes" | "no"
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
        /*
         * Get authenticated user
         */

        const {
            data: { user },
            error: userError,
        } = await client.auth.getUser();

        if (userError || !user) {
            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Update main applicant fields.
         */

        const {
            data,
            error,
        } = await client
            .from("applicants")
            .update({
                name,
                phone: phone || null,
                sid,
                gender,
                hosteller,
            })
            .eq(
                "id",
                applicantId
            )
            .eq(
                "user_id",
                user.id
            )
            .eq(
                "status",
                "PENDING"
            )
            .select()
            .single();

        if (error || !data) {
            console.error(
                "Error updating personal information:",
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
         * Branch lives in applicant_response.
         */

        const {
            error: branchError,
        } = await client
            .from("applicant_response")
            .update({
                branch,
            })
            .eq(
                "applicantId",
                applicantId
            );

        if (branchError) {
            console.error(
                "Error updating applicant branch:",
                branchError
            );

            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Sync updated personal information
         * to Google Sheets.
         */

        const {
            data: sheetsData,
            error: sheetsError,
        } = await client.functions.invoke(
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
                    hosteller,
                },
            }
        );

        if (sheetsError) {
            console.error(
                "Personal information updated in Supabase, but Google Sheets synchronization failed:",
                sheetsError
            );
        } else if (
            sheetsData?.success === false
        ) {
            console.error(
                "Google Sheets personal information synchronization failed:",
                sheetsData
            );
        }

        /*
         * Return complete updated applicant.
         */

        const {
            data: completeApplicant,
            error: fetchError,
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
                "user_id",
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
 * Existing generic applicant update
 * ---------------------------------------------------------
 *
 * This function is used by panelist/admin functionality.
 */

export const updateApplicant = async (
    applicantId: string,
    data: {
        name: string;
        sid: string;
        phone: string;
        remarks?: string;
        branch?: string;
        gender?: "male" | "female";
        hosteller?: "yes" | "no";
        responses?: Record<
            string,
            string
        >;
    }
): Promise<ApplicantType | null> => {
    /*
     * Update main applicant record.
     */

    const {
        error: applicantError,
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

            ...(data.hosteller !==
            undefined
                ? {
                      hosteller:
                          data.hosteller,
                  }
                : {}),
        })
        .eq(
            "id",
            applicantId
        );

    if (applicantError) {
        console.error(
            "Error updating applicant:",
            applicantError
        );

        return null;
    }

    /*
     * Walk-ins do not normally have
     * applicant_response.
     *
     * Only update/create applicant_response
     * when branch or responses were supplied.
     */

    if (
        data.branch !==
            undefined ||
        data.responses !==
            undefined
    ) {
        const {
            data: existingResponse,
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

        if (responseFetchError) {
            console.error(
                "Error checking applicant response:",
                responseFetchError
            );

            return null;
        }

        /*
         * Existing response.
         */

        if (existingResponse) {
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
            /*
             * No response exists.
             */

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
     * Return final updated applicant.
     */

    return await fetchApplicantWithResponses(
        applicantId
    );
};

/*
 * ---------------------------------------------------------
 * Accept or reject an applicant
 * ---------------------------------------------------------
 */

export const updateApplicantDecision =
    async (
        applicantId: string,
        status:
            | "accepted"
            | "rejected",
        remarks: string,
        reviewedBy: string
    ): Promise<boolean> => {
        /*
         * Use one timestamp for both Supabase
         * and Google Sheets.
         */

        const reviewedAt =
            new Date().toISOString();

        const {
            error,
        } = await client
            .from("applicants")
            .update({
                status:
                    status.toUpperCase(),

                remarks,

                reviewedBy,

                reviewedAt,
            })
            .eq(
                "id",
                applicantId
            );

        if (error) {
            console.error(
                "Error updating applicant decision:",
                error
            );

            return false;
        }

        /*
         * Sync decision to Results Sheet.
         */

        const {
            data: sheetsData,
            error: sheetsError,
        } = await client.functions.invoke(
            "sync-application-to-sheets",
            {
                body: {
                    operation:
                        "result",

                    applicationId:
                        applicantId,

                    status,
                    remarks,
                    reviewedBy,
                    reviewedAt,
                },
            }
        );

        /*
         * Supabase remains the source of truth.
         */

        if (sheetsError) {
            console.error(
                "Decision saved to Supabase, but Results Sheet synchronization failed:",
                sheetsError
            );
        } else if (
            sheetsData?.success === false
        ) {
            console.error(
                "Results Sheet synchronization failed:",
                sheetsData
            );
        }

        return true;
    };

/*
 * ---------------------------------------------------------
 * Reset applicant decision
 * ---------------------------------------------------------
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
                status: "PENDING",

                remarks: null,

                reviewedBy: null,

                reviewedAt: null,
            })
            .eq(
                "id",
                applicantId
            );

        if (error) {
            console.error(
                "Error resetting applicant decision:",
                error
            );

            return false;
        }

        return true;
    };

/*
 * ---------------------------------------------------------
 * Subscribe to applicant changes in realtime
 * ---------------------------------------------------------
 */

export const subscribeToApplicantUpdates = (
    onUpdate: (
        applicant: ApplicantType
    ) => void,

    onInsert: (
        applicant: ApplicantType
    ) => void
) => {
    const channel = client
        .channel(
            `applicants-status-${Date.now()}`
        )
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "applicants",
            },
            (payload: any) => {
                const item =
                    payload.new as any;

                onUpdate({
                    ...item,

                    userId:
                        item.user_id,

                    status:
                        item.status?.toLowerCase(),

                    createdAt:
                        item.createdAt ||
                        item.created_at,

                    gender:
                        item.gender ??
                        null,

                    hosteller:
                        item.hosteller ??
                        null,
                } as ApplicantType);
            }
        )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "applicants",
            },
            (payload: any) => {
                const item =
                    payload.new as any;

                onInsert({
                    ...item,

                    userId:
                        item.user_id,

                    status:
                        item.status?.toLowerCase(),

                    createdAt:
                        item.createdAt ||
                        item.created_at,

                    gender:
                        item.gender ??
                        null,

                    hosteller:
                        item.hosteller ??
                        null,
                } as ApplicantType);
            }
        )
        .subscribe();

    return () => {
        client.removeChannel(
            channel
        );
    };
};
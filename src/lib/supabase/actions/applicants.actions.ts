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

        /*
         * Keep your existing DB column:
         * userId
         */
        userId: item.userId,

        status:
            item.status?.toLowerCase(),

        createdAt:
            item.createdAt ||
            item.created_at,

        /*
         * Personal information
         */
        gender:
            item.gender ?? null,

        /*
         * IMPORTANT:
         * DB column = "isHostellers"
         * DB type = boolean
         */
        isHostellers:
            item.isHostellers ?? null,

        /*
         * applicant_response fields
         */
        branch:
            responseData?.branch,

        responses:
            responseData?.responses,
    } as ApplicantType;
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
            .eq("id", id)
            .single();

        if (error || !data) {
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

        if (error || !data) {
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

                    isWalkin: true,

                    status: "PENDING",
                },
            ])
            .select()
            .single();

        if (error || !data) {
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
         * Get logged-in user
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
            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Check duplicate application
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
         * Create applicant
         *
         * IMPORTANT:
         *
         * userId       → existing DB column
         * gender       → existing/new column
         * isHostellers → boolean column
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

                    isWalkin: false,

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
            if (
                applicantError?.code ===
                "23505"
            ) {
                return {
                    success: false,
                    reason: "duplicate",
                };
            }

            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Store branch + answers
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
            /*
             * Roll back applicant
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
         * Google Sheets sync
         *
         * Keep isHostellers here as well.
         */

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

        /*
         * Return applicant
         */

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
 * Update personal information
 * ---------------------------------------------------------
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
        /*
         * Get current user
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
            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Update applicant
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
         * Update branch
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
            return {
                success: false,
                reason: "error",
            };
        }

        /*
         * Google Sheets update
         */

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

        /*
         * Fetch complete updated applicant
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
        }
    ): Promise<
        ApplicantType | null
    > => {
        /*
         * Update main applicant
         */

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
            })
            .eq(
                "id",
                applicantId
            );

        if (
            applicantError
        ) {
            return null;
        }

        /*
         * Update response if necessary
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
                    return null;
                }
            }
        }

        return await fetchApplicantWithResponses(
            applicantId
        );
    };

/*
 * ---------------------------------------------------------
 * Accept / Reject applicant
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
            return false;
        }

        await client.functions.invoke(
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

        if (error) {
            return false;
        }

        return true;
    };

/*
 * ---------------------------------------------------------
 * Realtime updates
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
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

const mapApplicant = (item: any): ApplicantType => {
    const response = item.applicant_response;

    const responseData = Array.isArray(response)
        ? response[0]
        : response;

    return {
        ...item,
        userId: item.userId,
        status: item.status?.toLowerCase(),
        createdAt:
            item.createdAt ||
            item.created_at,
        branch: responseData?.branch,
        responses: responseData?.responses,
    } as ApplicantType;
};

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

export const fetchApplicantWithResponses = async (
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
 * Fetch the currently logged-in user's application.
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
            .eq("userId", user.id)
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

export const createWalkIn = async (
    name: string,
    sid: string,
    phone: string
): Promise<ApplicantType | null> => {
    /*
     * Walk-ins are still created exactly as before.
     * They are not tied to a user account.
     */

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
        status:
            data.status?.toLowerCase(),
        createdAt:
            data.createdAt ||
            data.created_at,
    } as ApplicantType;
};

export const createApplicant = async (
    name: string,
    sid: string,
    phone: string,
    branch: string,
    responses: Record<string, string>
): Promise<CreateApplicantResult> => {
    /*
     * ---------------------------------------------------------
     * 1. Get authenticated user
     * ---------------------------------------------------------
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
     * ---------------------------------------------------------
     * 2. Friendly existing-application check
     * ---------------------------------------------------------
     *
     * The UNIQUE constraint on userId in Supabase is the
     * actual protection against duplicate applications.
     *
     * This query is only for giving a clean UI response.
     */

    const {
        data: existingApplicant,
        error: existingApplicantError,
    } = await client
        .from("applicants")
        .select("id")
        .eq("userId", user.id)
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
     * ---------------------------------------------------------
     * 3. Create applicant
     * ---------------------------------------------------------
     */

    const {
        data: applicantData,
        error: applicantError,
    } = await client
        .from("applicants")
        .insert([
            {
                userId: user.id,
                name,
                sid,
                phone: phone || null,
                isWalkin: false,
                status: "PENDING",
            },
        ])
        .select()
        .single();

    if (applicantError) {
        /*
         * PostgreSQL unique constraint violation.
         * This is the definitive one-account-one-application
         * protection.
         */
        if (applicantError.code === "23505") {
            console.error(
                "Duplicate application:",
                applicantError
            );

            return {
                success: false,
                reason: "duplicate",
            };
        }

        console.error(
            "Error creating applicant:",
            applicantError
        );

        console.error("Error details:", {
            message:
                applicantError.message,
            details:
                applicantError.details,
            hint:
                applicantError.hint,
            code:
                applicantError.code,
        });

        return {
            success: false,
            reason: "error",
        };
    }

    /*
     * ---------------------------------------------------------
     * 4. Store application responses
     * ---------------------------------------------------------
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
     * ---------------------------------------------------------
     * 5. Sync application to Google Sheets
     * ---------------------------------------------------------
     */

    const {
        data: sheetsData,
        error: sheetsError,
    } = await client.functions.invoke(
        "sync-application-to-sheets",
        {
            body: {
                operation: "application",

                applicationId:
                    applicantData.id,

                name,
                phone,
                sid,
                branch,

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

    return {
        success: true,

        applicant: {
            ...applicantData,
            userId: user.id,
            status:
                applicantData.status?.toLowerCase(),
            createdAt:
                applicantData.createdAt ||
                applicantData.created_at,
            branch,
            responses,
        } as ApplicantType,
    };
};

/*
 * ---------------------------------------------------------
 * Update applicant personal information
 *
 * Editable:
 *   name
 *   phone
 *   sid
 *   branch
 *
 * Never editable:
 *   application responses
 *
 * Only PENDING applications can be edited.
 * ---------------------------------------------------------
 */

export const updateApplicantPersonalInfo =
    async (
        applicantId: string,
        name: string,
        phone: string,
        sid: string,
        branch: string
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
         * Update only the personal fields.
         *
         * userId + id + PENDING ensures the user can only
         * modify their own still-pending application.
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
            })
            .eq("id", applicantId)
            .eq("userId", user.id)
            .eq("status", "PENDING")
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
         * Sync the updated personal information
         * to the existing application row in Sheets.
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
         * Return the complete updated application.
         */
        const {
            data: completeApplicant,
            error: fetchError,
        } = await client
            .from("applicants")
            .select(
                "*, applicant_response(branch, responses)"
            )
            .eq("id", applicantId)
            .eq("userId", user.id)
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
 * Panelist / Admin decision
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

        const { error } = await client
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
                    operation: "result",

                    applicationId:
                        applicantId,

                    status,
                    remarks,
                    reviewedBy,
                    reviewedAt,
                },
            }
        );

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

export const subscribeToApplicantUpdates = (
    onUpdate: (
        applicant: ApplicantType
    ) => void,
    onInsert: (
        applicant: ApplicantType
    ) => void
) => {
    const channel = client
        .channel("applicants-status")
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "applicants",
            },
            (payload) => {
                const item =
                    payload.new as any;

                onUpdate({
                    ...item,
                    status:
                        item.status?.toLowerCase(),
                    createdAt:
                        item.createdAt ||
                        item.created_at,
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
            (payload) => {
                const item =
                    payload.new as any;

                onInsert({
                    ...item,
                    status:
                        item.status?.toLowerCase(),
                    createdAt:
                        item.createdAt ||
                        item.created_at,
                } as ApplicantType);
            }
        )
        .subscribe();

    return () => {
        client.removeChannel(channel);
    };
};
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

/**
 * Fetch all applicants with their application responses.
 */
export const fetchApplicants = async (): Promise<ApplicantType[]> => {
    const { data, error } = await client
        .from("applicants")
        .select("*, applicant_response(branch, responses)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching applicants:", error);
        return [];
    }

    return (data as any[]).map((item) => {
        const response = item.applicant_response;

        const responseData = Array.isArray(response)
            ? response[0]
            : response;

        return {
            ...item,
            status: item.status?.toLowerCase(),
            createdAt: item.createdAt || item.created_at,
            branch: responseData?.branch,
            responses: responseData?.responses,
        };
    }) as ApplicantType[];
};

/**
 * Fetch one applicant with complete application responses.
 */
export const fetchApplicantWithResponses = async (
    id: string
): Promise<ApplicantType | null> => {
    const { data, error } = await client
        .from("applicants")
        .select("*, applicant_response(branch, responses)")
        .eq("id", id)
        .single();

    if (error) {
        console.error(
            "Error fetching applicant with responses:",
            error
        );

        return null;
    }

    const response = (data as any).applicant_response;

    const responseData = Array.isArray(response)
        ? response[0]
        : response;

    return {
        ...data,
        status: data.status?.toLowerCase(),
        createdAt: data.createdAt || data.created_at,
        branch: responseData?.branch,
        responses: responseData?.responses,
    } as ApplicantType;
};

/**
 * Create a walk-in applicant.
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
        console.error("Error creating walk-in:", error);
        return null;
    }

    return {
        ...data,
        status: data.status?.toLowerCase(),
        createdAt: data.createdAt || data.created_at,
    } as ApplicantType;
};

/**
 * Create a normal application.
 */
export const createApplicant = async (
    name: string,
    sid: string,
    branch: string,
    responses: Record<string, string>
): Promise<CreateApplicantResult> => {
    const { data: applicantData, error: applicantError } =
        await client
            .from("applicants")
            .insert([
                {
                    name,
                    sid,
                    isWalkin: false,
                    status: "PENDING",
                },
            ])
            .select()
            .single();

    if (applicantError) {
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

        return {
            success: false,
            reason: "error",
        };
    }

    const { error: responseError } = await client
        .from("applicant_response")
        .insert([
            {
                applicantId: applicantData.id,
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
            .eq("id", applicantData.id);

        return {
            success: false,
            reason: "error",
        };
    }

    return {
        success: true,

        applicant: {
            ...applicantData,
            status: applicantData.status?.toLowerCase(),
            createdAt:
                applicantData.createdAt ||
                applicantData.created_at,
            branch,
            responses,
        } as ApplicantType,
    };
};

/**
 * Update applicant details, application responses,
 * and remarks.
 *
 * IMPORTANT:
 * This function does NOT update:
 * - status
 * - reviewedBy
 * - reviewedAt
 *
 * Therefore an accepted/rejected applicant can be edited
 * without changing their decision.
 */
export const updateApplicant = async (
    applicantId: string,
    data: {
        name: string;
        sid: string;
        phone: string;
        remarks?: string;
        branch?: string;
        responses?: Record<string, string>;
    }
): Promise<ApplicantType | null> => {
    /*
     * ---------------------------------------------------------
     * Update main applicant record
     * ---------------------------------------------------------
     */

    const { error: applicantError } = await client
        .from("applicants")
        .update({
            name: data.name.trim(),
            sid: data.sid.trim(),
            phone: data.phone.trim() || null,
            remarks: data.remarks?.trim() || null,
        })
        .eq("id", applicantId);

    if (applicantError) {
        console.error(
            "Error updating applicant:",
            applicantError
        );

        return null;
    }

    /*
     * ---------------------------------------------------------
     * Walk-ins don't normally have applicant_response.
     *
     * Only update/create applicant_response when
     * branch or responses were supplied.
     * ---------------------------------------------------------
     */

    if (
        data.branch !== undefined ||
        data.responses !== undefined
    ) {
        const {
            data: existingResponse,
            error: responseFetchError,
        } = await client
            .from("applicant_response")
            .select("id")
            .eq("applicantId", applicantId)
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
         * Existing application response
         */
        if (existingResponse) {
            const responseUpdate: {
                branch?: string;
                responses?: Record<string, string>;
            } = {};

            if (data.branch !== undefined) {
                responseUpdate.branch =
                    data.branch.trim();
            }

            if (data.responses !== undefined) {
                responseUpdate.responses =
                    data.responses;
            }

            const {
                error: responseUpdateError,
            } = await client
                .from("applicant_response")
                .update(responseUpdate)
                .eq(
                    "id",
                    existingResponse.id
                );

            if (responseUpdateError) {
                console.error(
                    "Error updating applicant response:",
                    responseUpdateError
                );

                return null;
            }
        }

        /*
         * No response exists.
         *
         * This can happen if an applicant was created
         * without an applicant_response row.
         */
        else {
            const {
                error: responseInsertError,
            } = await client
                .from("applicant_response")
                .insert([
                    {
                        applicantId,
                        branch:
                            data.branch?.trim() || "",
                        responses:
                            data.responses || {},
                    },
                ]);

            if (responseInsertError) {
                console.error(
                    "Error creating applicant response:",
                    responseInsertError
                );

                return null;
            }
        }
    }

    /*
     * ---------------------------------------------------------
     * Fetch the final updated applicant
     * ---------------------------------------------------------
     */

    return await fetchApplicantWithResponses(
        applicantId
    );
};

/**
 * Accept or reject an applicant.
 */
export const updateApplicantDecision = async (
    applicantId: string,
    status: "accepted" | "rejected",
    remarks: string,
    reviewedBy: string
): Promise<boolean> => {
    const { error } = await client
        .from("applicants")
        .update({
            status: status.toUpperCase(),
            remarks,
            reviewedBy,
            reviewedAt:
                new Date().toISOString(),
        })
        .eq("id", applicantId);

    if (error) {
        console.error(
            "Error updating applicant decision:",
            error
        );

        return false;
    }

    return true;
};

/**
 * Reset an applicant back to PENDING.
 */
export const resetApplicantDecision = async (
    applicantId: string
): Promise<boolean> => {
    const { error } = await client
        .from("applicants")
        .update({
            status: "PENDING",
            remarks: null,
            reviewedBy: null,
            reviewedAt: null,
        })
        .eq("id", applicantId);

    if (error) {
        console.error(
            "Error resetting applicant decision:",
            error
        );

        return false;
    }

    return true;
};

/**
 * Subscribe to applicant changes in realtime.
 */
export const subscribeToApplicantUpdates = (
    onUpdate: (applicant: ApplicantType) => void,
    onInsert: (applicant: ApplicantType) => void
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
                const item = payload.new as any;

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
                const item = payload.new as any;

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
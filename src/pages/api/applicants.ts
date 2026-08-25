import {
    getAuthenticatedSupabaseClient,
} from "@/lib/supabase/supabase";
import { ApplicantType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

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

const requestInterviewSchedule = async (
    req: NextApiRequest
): Promise<void> => {
    try {
        const {
            error,
        } =
            await getAuthenticatedSupabaseClient(req)
                .functions.invoke(
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

const fetchApplicants = async (req: NextApiRequest) => {
    const {
        data,
        error,
    } = await getAuthenticatedSupabaseClient(req)
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

const fetchApplicantWithResponses =
    async (
        id: string,
        req: NextApiRequest
    ): Promise<
        ApplicantType | null
    > => {
        const {
            data,
            error,
        } = await getAuthenticatedSupabaseClient(req)
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

const fetchMyApplication = async (
    req: NextApiRequest
): Promise<
    ApplicantType | null
> => {
    const {
        data: {
            user,
        },
        error: userError,
    } =
        await getAuthenticatedSupabaseClient(
            req
        ).auth.getUser();

    if (
        userError ||
        !user
    ) {
        return null;
    }

    const {
        data,
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
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

const createWalkIn = async (
    name: string,
    sid: string,
    phone: string,
    req: NextApiRequest
): Promise<
    ApplicantType | null
> => {
    const {
        data,
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
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

    return mapApplicant(data);
};

const createApplicant = async (
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
    >,
    req: NextApiRequest
) => {
    const {
        data: {
            user,
        },
        error: userError,
    } =
        await getAuthenticatedSupabaseClient(
            req
        ).auth.getUser();

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

    const {
        data:
            existingApplicant,
        error:
            existingApplicantError,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
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

    const {
        data:
            applicantData,
        error:
            applicantError,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
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

    const {
        error:
            responseError,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
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

        await getAuthenticatedSupabaseClient(
            req
        )
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

    try {
        const {
            error:
                sheetsError,
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
                .functions.invoke(
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
    } catch (error) {
        console.error(
            "Application saved to Supabase, but Google Sheets synchronization failed:",
            error
        );
    }

    await requestInterviewSchedule(
        req
    );

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

const updateApplicantPersonalInfo =
    async (
        applicantId: string,
        name: string,
        phone: string,
        sid: string,
        branch: string,
        gender:
            | "male"
            | "female",
        isHostellers: boolean,
        req: NextApiRequest
    ) => {
        const {
            data: {
                user,
            },
            error: userError,
        } =
            await getAuthenticatedSupabaseClient(
                req
            ).auth.getUser();

        if (
            userError ||
            !user
        ) {
            return {
                success: false,
                reason: "error",
            };
        }

        const {
            data,
            error,
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
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

        const {
            error:
                branchError,
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
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

        try {
            const {
                error:
                    sheetsError,
            } =
                await getAuthenticatedSupabaseClient(
                    req
                )
                    .functions.invoke(
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

        await requestInterviewSchedule(
            req
        );

        const {
            data:
                completeApplicant,
            error:
                fetchError,
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
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

const updateApplicant = async (
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
    },
    req: NextApiRequest
): Promise<
    ApplicantType | null
> => {
    const {
        error:
            applicantError,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
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
        console.error(
            "Error updating applicant:",
            applicantError
        );

        return null;
    }

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
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
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
            } =
                await getAuthenticatedSupabaseClient(
                    req
                )
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
            } =
                await getAuthenticatedSupabaseClient(
                    req
                )
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

    await requestInterviewSchedule(
        req
    );

    /*
     * IMPORTANT:
     * Keep the original behavior here.
     * The original calls fetchApplicantWithResponses()
     * after the update.
     */
    return await fetchApplicantWithResponses(
        applicantId,
        req
    );
};

const updateApplicantDecision =
    async (
        applicantId: string,
        status:
            | "accepted"
            | "rejected",
        remarks: string,
        reviewedBy: string,
        req: NextApiRequest
    ): Promise<boolean> => {
        const reviewedAt =
            new Date().toISOString();

        const {
            error,
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
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

        try {
            const {
                error:
                    sheetsError,
            } =
                await getAuthenticatedSupabaseClient(
                    req
                )
                    .functions.invoke(
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

        await requestInterviewSchedule(
            req
        );

        return true;
    };

const resetApplicantDecision =
    async (
        applicantId: string,
        req: NextApiRequest
    ): Promise<boolean> => {
        const {
            error,
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
                .from("applicants")
                .update({
                    status:
                        "PENDING",

                    remarks:
                        null,

                    reviewedBy:
                        null,

                    reviewedAt:
                        null,
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

        await requestInterviewSchedule(
            req
        );

        return true;
    };

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        switch (req.method) {
            case "GET": {
                const {
                    id,
                    myApplication,
                } = req.query;

                if (
                    myApplication ===
                    "true"
                ) {
                    const data =
                        await fetchMyApplication(
                            req
                        );

                    return res
                        .status(200)
                        .json(data);
                }

                if (id) {
                    if (
                        Array.isArray(id)
                    ) {
                        return res
                            .status(400)
                            .json({
                                error:
                                    "Invalid applicant ID",
                            });
                    }

                    const data =
                        await fetchApplicantWithResponses(
                            id,
                            req
                        );

                    return res
                        .status(200)
                        .json(data);
                }

                const data =
                    await fetchApplicants(req);

                return res
                    .status(200)
                    .json(data);
            }

            case "POST": {
                const {
                    action,
                } = req.body;

                if (
                    action ===
                    "walk-in"
                ) {
                    const {
                        name,
                        sid,
                        phone,
                    } = req.body;

                    const data =
                        await createWalkIn(
                            name,
                            sid,
                            phone,
                            req
                        );

                    return res
                        .status(200)
                        .json(data);
                }

                if (
                    action ===
                    "application"
                ) {
                    const {
                        name,
                        sid,
                        phone,
                        branch,
                        gender,
                        isHostellers,
                        responses,
                    } = req.body;

                    const result =
                        await createApplicant(
                            name,
                            sid,
                            phone,
                            branch,
                            gender,
                            isHostellers,
                            responses,
                            req
                        );

                    return res
                        .status(200)
                        .json(result);
                }

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid POST action",
                    });
            }

            case "PUT": {
                const {
                    action,
                    applicantId,
                } = req.body;

                if (
                    action ===
                    "personal-info"
                ) {
                    const {
                        name,
                        phone,
                        sid,
                        branch,
                        gender,
                        isHostellers,
                    } = req.body;

                    const result =
                        await updateApplicantPersonalInfo(
                            applicantId,
                            name,
                            phone,
                            sid,
                            branch,
                            gender,
                            isHostellers,
                            req
                        );

                    return res
                        .status(200)
                        .json(result);
                }

                if (
                    action ===
                    "update"
                ) {
                    const result =
                        await updateApplicant(
                            applicantId,
                            req.body.data,
                            req
                        );

                    return res
                        .status(200)
                        .json(result);
                }

                if (
                    action ===
                    "decision"
                ) {
                    const {
                        status,
                        remarks,
                        reviewedBy,
                    } = req.body;

                    const result =
                        await updateApplicantDecision(
                            applicantId,
                            status,
                            remarks,
                            reviewedBy,
                            req
                        );

                    return res
                        .status(200)
                        .json(result);
                }

                if (
                    action ===
                    "reset-decision"
                ) {
                    const result =
                        await resetApplicantDecision(
                            applicantId,
                            req
                        );

                    return res
                        .status(200)
                        .json(result);
                }

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid PUT action",
                    });
            }

            default: {
                res.setHeader(
                    "Allow",
                    [
                        "GET",
                        "POST",
                        "PUT",
                    ]
                );

                return res
                    .status(405)
                    .json({
                        error:
                            `Method ${req.method} not allowed`,
                    });
            }
        }
    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .json({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
    }
};

export default handler;
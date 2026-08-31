import { createClient } from "npm:@supabase/supabase-js@2";

// Supabase Edge Runtime global used for background tasks.
declare const EdgeRuntime: {
    waitUntil(promise: Promise<unknown>): void;
};

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":
        "POST, OPTIONS",
};

type ApplicationOperation = {
    operation: "application";
    applicationId: string;
    name: string;
    phone: string;
    sid: string;
    branch: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
};

type UpdateApplicationOperation = {
    operation: "update_application";
    applicationId: string;
    name: string;
    phone: string;
    sid: string;
    branch: string;
};

type ReviewScore = {
    personality: number;
    thinking: number;
    priorExperience: number;
    motivation: number;
    curiosity: number;
};

type ResultOperation = {
    /*
     * "result" is retained as the operation name for compatibility
     * with the existing frontend action.
     *
     * The review itself no longer changes an accept/reject result.
     */
    operation: "result";

    applicationId: string;

    /*
     * Kept optional for compatibility with the current frontend.
     * This value is intentionally ignored by this function.
     */
    status?: "pending" | "accepted" | "rejected";

    reviewScore: ReviewScore;
    remarks: string;
    reviewedBy?: string;
    reviewedAt: string;
};

type RequestData =
    | ApplicationOperation
    | UpdateApplicationOperation
    | ResultOperation;


/*
 * =========================================================
 * GET REVIEWER NAME
 * =========================================================
 *
 * The frontend may send "Panelist" / "Admin", but we do not
 * trust that value.
 *
 * The authenticated Supabase user's profile is the source
 * of truth for the reviewer's display name.
 */

async function getReviewerName(
    supabase: ReturnType<typeof createClient>,
    user: any
): Promise<string> {
    const {
        data: profile,
        error: profileError,
    } = await supabase
        .from("profiles")
        .select("fullName")
        .eq("userId", user.id)
        .maybeSingle();

    if (
        !profileError &&
        profile?.fullName &&
        String(
            profile.fullName
        ).trim() !== ""
    ) {
        return String(
            profile.fullName
        ).trim();
    }

    if (profileError) {
        console.error(
            "Could not fetch reviewer profile:",
            profileError
        );
    }

    /*
     * Fallback to authenticated user's metadata.
     */

    const metadataName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.fullName;

    if (
        metadataName &&
        String(
            metadataName
        ).trim() !== ""
    ) {
        return String(
            metadataName
        ).trim();
    }

    return "Unknown Reviewer";
}


/*
 * =========================================================
 * VALIDATE REVIEW SCORES
 * =========================================================
 *
 * Each score must be an integer from 1 through 10.
 */

function validateReviewScore(
    reviewScore: ReviewScore
): string | null {
    const fields: (keyof ReviewScore)[] = [
        "personality",
        "thinking",
        "priorExperience",
        "motivation",
        "curiosity",
    ];

    for (
        const field of fields
    ) {
        const value =
            reviewScore?.[field];

        if (
            typeof value !== "number" ||
            !Number.isInteger(value) ||
            value < 1 ||
            value > 10
        ) {
            return (
                `Invalid review score for ${field}: ` +
                "expected an integer from 1 to 10"
            );
        }
    }

    return null;
}


/*
 * =========================================================
 * JSON RESPONSE HELPER
 * =========================================================
 */

function jsonResponse(
    body: Record<string, unknown>,
    status = 200
): Response {
    return new Response(
        JSON.stringify(body),
        {
            status,
            headers: {
                ...corsHeaders,
                "Content-Type":
                    "application/json",
            },
        }
    );
}


/*
 * =========================================================
 * MAIN HANDLER
 * =========================================================
 */

Deno.serve(async (req: Request) => {
    /*
     * ---------------------------------------------------------
     * CORS
     * ---------------------------------------------------------
     */

    if (
        req.method ===
        "OPTIONS"
    ) {
        return new Response(
            "ok",
            {
                headers:
                    corsHeaders,
            }
        );
    }

    if (
        req.method !==
        "POST"
    ) {
        return jsonResponse(
            {
                success: false,
                error:
                    "Method not allowed",
            },
            405
        );
    }

    try {
        /*
         * ---------------------------------------------------------
         * 1. AUTHENTICATE SUPABASE USER
         * ---------------------------------------------------------
         */

        const authorization =
            req.headers.get(
                "Authorization"
            );

        if (
            !authorization
        ) {
            return jsonResponse(
                {
                    success: false,
                    error:
                        "Authentication required",
                },
                401
            );
        }

        const supabaseUrl =
            Deno.env.get(
                "SUPABASE_URL"
            );

        const supabaseAnonKey =
            Deno.env.get(
                "SUPABASE_ANON_KEY"
            );

        if (
            !supabaseUrl ||
            !supabaseAnonKey
        ) {
            throw new Error(
                "Supabase environment variables are missing"
            );
        }

        const supabase =
            createClient(
                supabaseUrl,
                supabaseAnonKey,
                {
                    global: {
                        headers: {
                            Authorization:
                                authorization,
                        },
                    },
                }
            );

        const {
            data: {
                user,
            },
            error: userError,
        } =
            await supabase.auth.getUser();

        if (
            userError ||
            !user
        ) {
            return jsonResponse(
                {
                    success: false,
                    error:
                        "Invalid or expired Supabase session",
                },
                401
            );
        }

        /*
         * ---------------------------------------------------------
         * 2. PARSE REQUEST
         * ---------------------------------------------------------
         */

        const data =
            (await req.json()) as RequestData;

        if (
            !data.operation
        ) {
            return jsonResponse(
                {
                    success: false,
                    error:
                        "Missing operation",
                },
                400
            );
        }

        /*
         * ---------------------------------------------------------
         * 3. GOOGLE APPS SCRIPT CONFIGURATION
         * ---------------------------------------------------------
         */

        const googleScriptUrl =
            Deno.env.get(
                "GOOGLE_SHEETS_SCRIPT_URL"
            );

        const googleSheetsSecret =
            Deno.env.get(
                "GOOGLE_SHEETS_SECRET"
            );

        if (
            !googleScriptUrl ||
            !googleSheetsSecret
        ) {
            throw new Error(
                "Google Sheets configuration is missing"
            );
        }

        /*
         * =========================================================
         * APPLICATION
         * =========================================================
         */

        if (
            data.operation ===
            "application"
        ) {
            const application =
                data as ApplicationOperation;

            const requiredFields = [
                "applicationId",
                "name",
                "phone",
                "sid",
                "branch",
                "q1",
                "q2",
                "q3",
                "q4",
            ] as const;

            for (
                const field of
                requiredFields
            ) {
                if (
                    application[field] ===
                        undefined ||
                    application[field] ===
                        null ||
                    String(
                        application[field]
                    ).trim() === ""
                ) {
                    return jsonResponse(
                        {
                            success: false,
                            error:
                                `Missing required field: ${field}`,
                        },
                        400
                    );
                }
            }

            /*
             * Application synchronization happens in the
             * background so the student's submission request
             * does not wait for Google Sheets.
             */

            const syncApplicationToGoogleSheets =
                async (): Promise<void> => {
                    const maxAttempts =
                        3;

                    for (
                        let attempt = 1;
                        attempt <=
                            maxAttempts;
                        attempt++
                    ) {
                        try {
                            const googleResponse =
                                await fetch(
                                    googleScriptUrl,
                                    {
                                        method:
                                            "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json",
                                        },

                                        body:
                                            JSON.stringify(
                                                {
                                                    operation:
                                                        "application",

                                                    applicationId:
                                                        application.applicationId,

                                                    name:
                                                        application.name,

                                                    phone:
                                                        application.phone,

                                                    sid:
                                                        application.sid,

                                                    branch:
                                                        application.branch,

                                                    q1:
                                                        application.q1,

                                                    q2:
                                                        application.q2,

                                                    q3:
                                                        application.q3,

                                                    q4:
                                                        application.q4,

                                                    secret:
                                                        googleSheetsSecret,

                                                    userId:
                                                        user.id,
                                                }
                                            ),
                                    }
                                );

                            let googleResult: {
                                success?: boolean;
                                duplicate?: boolean;
                                error?: string;
                            };

                            try {
                                googleResult =
                                    await googleResponse.json();
                            } catch {
                                throw new Error(
                                    `Google Apps Script returned an invalid response (HTTP ${googleResponse.status})`
                                );
                            }

                            if (
                                !googleResponse.ok ||
                                !googleResult.success
                            ) {
                                throw new Error(
                                    googleResult.error ||
                                        `Google Sheets synchronization failed (HTTP ${googleResponse.status})`
                                );
                            }

                            console.log(
                                `Application ${application.applicationId} queued for Google Sheets synchronization`
                            );

                            return;
                        } catch (
                            error
                        ) {
                            console.error(
                                `Google Sheets synchronization attempt ${attempt}/${maxAttempts} failed:`,
                                error
                            );

                            if (
                                attempt <
                                maxAttempts
                            ) {
                                const delayMs =
                                    250 *
                                    Math.pow(
                                        2,
                                        attempt -
                                            1
                                    );

                                await new Promise<void>(
                                    resolve =>
                                        setTimeout(
                                            resolve,
                                            delayMs
                                        )
                                );
                            }
                        }
                    }

                    console.error(
                        `Google Sheets synchronization ultimately failed for application ${application.applicationId}`
                    );
                };

            EdgeRuntime.waitUntil(
                syncApplicationToGoogleSheets()
            );

            return jsonResponse({
                success: true,
                operation:
                    "application",
                queued: true,
            });
        }


        /*
         * =========================================================
         * UPDATE APPLICATION
         * =========================================================
         *
         * Only Name / Phone / SID / Branch are editable.
         *
         * Submitted answers are not changed here.
         */

        if (
            data.operation ===
            "update_application"
        ) {
            const update =
                data as UpdateApplicationOperation;

            const {
                data: applicant,
                error: applicantError,
            } = await supabase
                .from("applicants")
                .select(
                    "id, userId, status"
                )
                .eq(
                    "id",
                    update.applicationId
                )
                .eq(
                    "userId",
                    user.id
                )
                .eq(
                    "status",
                    "PENDING"
                )
                .single();

            if (
                applicantError ||
                !applicant
            ) {
                return jsonResponse(
                    {
                        success: false,
                        error:
                            "Application not found or no longer editable",
                    },
                    404
                );
            }

            const requiredFields = [
                "applicationId",
                "name",
                "phone",
                "sid",
                "branch",
            ] as const;

            for (
                const field of
                requiredFields
            ) {
                if (
                    update[field] ===
                        undefined ||
                    update[field] ===
                        null ||
                    String(
                        update[field]
                    ).trim() === ""
                ) {
                    return jsonResponse(
                        {
                            success: false,
                            error:
                                `Missing required field: ${field}`,
                        },
                        400
                    );
                }
            }

            const googleResponse =
                await fetch(
                    googleScriptUrl,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                {
                                    operation:
                                        "update_application",

                                    applicationId:
                                        update.applicationId,

                                    name:
                                        update.name,

                                    phone:
                                        update.phone,

                                    sid:
                                        update.sid,

                                    branch:
                                        update.branch,

                                    secret:
                                        googleSheetsSecret,

                                    userId:
                                        user.id,
                                }
                            ),
                    }
                );

            let googleResult: {
                success?: boolean;
                error?: string;
            };

            try {
                googleResult =
                    await googleResponse.json();
            } catch {
                throw new Error(
                    `Google Apps Script returned an invalid response (HTTP ${googleResponse.status})`
                );
            }

            if (
                !googleResponse.ok ||
                !googleResult.success
            ) {
                throw new Error(
                    googleResult.error ||
                        `Google Sheets synchronization failed (HTTP ${googleResponse.status})`
                );
            }

            return jsonResponse({
                success: true,
                operation:
                    "update_application",
            });
        }


        /*
         * =========================================================
         * PANEL REVIEW
         * =========================================================
         *
         * The operation is still called "result" because the
         * existing frontend already uses this operation name.
         *
         * This is NOT an accept/reject operation.
         *
         * Only the five review scores, remarks, reviewer identity,
         * and review timestamp are synchronized.
         */

        if (
            data.operation ===
            "result"
        ) {
            const review =
                data as ResultOperation;

            /*
             * Validate the five score fields.
             */

            const reviewScoreError =
                validateReviewScore(
                    review.reviewScore
                );

            if (
                reviewScoreError
            ) {
                return jsonResponse(
                    {
                        success: false,
                        error:
                            reviewScoreError,
                    },
                    400
                );
            }

            /*
             * Remarks are required by ApplicantDecision.
             */

            if (
                typeof review.remarks !==
                    "string" ||
                review.remarks.trim() ===
                    ""
            ) {
                return jsonResponse(
                    {
                        success: false,
                        error:
                            "Review remarks are required",
                    },
                    400
                );
            }

            /*
             * Fetch applicant information from the active
             * applicants table.
             *
             * Branch continues to come from applicant_response,
             * matching the existing database architecture.
             */

            const {
                data: applicant,
                error,
            } = await supabase
                .from("applicants")
                .select(
                    "id, name, phone, sid, isWalkin, applicant_response(branch)"
                )
                .eq(
                    "id",
                    review.applicationId
                )
                .single();

            if (
                error ||
                !applicant
            ) {
                throw new Error(
                    "Could not fetch applicant for Results Sheet"
                );
            }

            /*
             * Resolve the actual panelist/admin name server-side.
             */

            const reviewerName =
                await getReviewerName(
                    supabase,
                    user
                );

            /*
             * Extract branch from applicant_response.
             */

            const response =
                (applicant as any)
                    .applicant_response;

            const responseData =
                Array.isArray(
                    response
                )
                    ? response[0]
                    : response;

            const branch =
                responseData?.branch ||
                "";

            /*
             * Send review data to Google Apps Script.
             *
             * IMPORTANT:
             * There is deliberately NO result/status field.
             */

            const googleResponse =
                await fetch(
                    googleScriptUrl,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                {
                                    operation:
                                        "result",

                                    applicationId:
                                        review.applicationId,

                                    name:
                                        applicant.name,

                                    phone:
                                        applicant.phone ||
                                        "",

                                    sid:
                                        applicant.sid,

                                    branch,

                                    reviewScore:
                                        review.reviewScore,

                                    remarks:
                                        review.remarks.trim(),

                                    reviewedBy:
                                        reviewerName,

                                    reviewedAt:
                                        review.reviewedAt,

                                    secret:
                                        googleSheetsSecret,

                                    userId:
                                        user.id,
                                }
                            ),
                    }
                );

            let googleResult: {
                success?: boolean;
                error?: string;
            };

            try {
                googleResult =
                    await googleResponse.json();
            } catch {
                throw new Error(
                    `Google Apps Script returned an invalid response (HTTP ${googleResponse.status})`
                );
            }

            if (
                !googleResponse.ok ||
                !googleResult.success
            ) {
                throw new Error(
                    googleResult.error ||
                        `Results Sheet synchronization failed (HTTP ${googleResponse.status})`
                );
            }

            return jsonResponse({
                success: true,
                operation:
                    "result",
                reviewedBy:
                    reviewerName,
            });
        }


        /*
         * =========================================================
         * UNSUPPORTED OPERATION
         * =========================================================
         */

        return jsonResponse(
            {
                success: false,
                error:
                    "Unsupported operation",
            },
            400
        );

    } catch (
        error
    ) {
        console.error(
            "sync-application-to-sheets error:",
            error
        );

        return jsonResponse(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            500
        );
    }
});
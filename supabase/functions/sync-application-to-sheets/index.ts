import { createClient } from "npm:@supabase/supabase-js@2";

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

type ResultOperation = {
    operation: "result";
    applicationId: string;
    status: "accepted" | "rejected";
    remarks: string;
    reviewedBy: string;
    reviewedAt: string;
};

type RequestData =
    | ApplicationOperation
    | UpdateApplicationOperation
    | ResultOperation;


/*
 * ---------------------------------------------------------
 * Get the authenticated user's display name
 * ---------------------------------------------------------
 *
 * The frontend currently sends "Admin" / "Panelist" as
 * reviewedBy. We do NOT trust that value here.
 *
 * Instead, we use the authenticated Supabase user's ID
 * to find their profile and obtain the actual full name.
 *
 * Fallback:
 * If profiles.fullName is unavailable, use the name stored
 * in the authenticated user's metadata.
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
        String(profile.fullName).trim() !== ""
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
     * Fallback to the authenticated user's
     * Google/Supabase metadata.
     */
    const metadataName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.fullName;

    if (
        metadataName &&
        String(metadataName).trim() !== ""
    ) {
        return String(
            metadataName
        ).trim();
    }

    /*
     * Last-resort fallback.
     *
     * This should normally never be reached if the
     * user's profile or Google metadata contains a name.
     */
    return "Unknown Reviewer";
}


Deno.serve(async (req: Request) => {
    /*
     * ---------------------------------------------------------
     * CORS
     * ---------------------------------------------------------
     */

    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Method not allowed",
            }),
            {
                status: 405,
                headers: {
                    ...corsHeaders,
                    "Content-Type":
                        "application/json",
                },
            }
        );
    }

    try {
        /*
         * ---------------------------------------------------------
         * 1. Authenticate Supabase user
         * ---------------------------------------------------------
         */

        const authorization =
            req.headers.get(
                "Authorization"
            );

        if (!authorization) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error:
                        "Authentication required",
                }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
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
            data: { user },
            error: userError,
        } =
            await supabase.auth.getUser();

        if (
            userError ||
            !user
        ) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error:
                        "Invalid or expired Supabase session",
                }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * 2. Parse request
         * ---------------------------------------------------------
         */

        const data =
            (await req.json()) as RequestData;

        if (!data.operation) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error:
                        "Missing operation",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * 3. Google Apps Script configuration
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
         * ---------------------------------------------------------
         * APPLICATION
         * ---------------------------------------------------------
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
                    application[
                        field
                    ] === undefined ||
                    application[
                        field
                    ] === null ||
                    String(
                        application[field]
                    ).trim() === ""
                ) {
                    return new Response(
                        JSON.stringify({
                            success: false,
                            error:
                                `Missing required field: ${field}`,
                        }),
                        {
                            status: 400,
                            headers: {
                                ...corsHeaders,
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );
                }
            }

            const googleResponse =
                await fetch(
                    googleScriptUrl,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
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
                        }),
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

            return new Response(
                JSON.stringify({
                    success: true,
                    operation:
                        "application",
                    duplicate:
                        googleResult.duplicate ??
                        false,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * UPDATE APPLICATION
         * ---------------------------------------------------------
         *
         * Updates only:
         * Name / Phone / SID / Branch
         *
         * Submitted answers are never changed.
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
                return new Response(
                    JSON.stringify({
                        success: false,
                        error:
                            "Application not found or no longer editable",
                    }),
                    {
                        status: 404,
                        headers: {
                            ...corsHeaders,
                            "Content-Type":
                                "application/json",
                        },
                    }
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
                    return new Response(
                        JSON.stringify({
                            success: false,
                            error:
                                `Missing required field: ${field}`,
                        }),
                        {
                            status: 400,
                            headers: {
                                ...corsHeaders,
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );
                }
            }

            const googleResponse =
                await fetch(
                    googleScriptUrl,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
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
                        }),
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

            return new Response(
                JSON.stringify({
                    success: true,
                    operation:
                        "update_application",
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * RESULT
         * ---------------------------------------------------------
         *
         * The reviewer name is determined server-side from the
         * authenticated Supabase user.
         *
         * We intentionally do NOT use result.reviewedBy here.
         * The frontend may send "Panelist", but the Edge Function
         * replaces it with the authenticated user's real name.
         */

        if (
            data.operation ===
            "result"
        ) {
            const result =
                data as ResultOperation;

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
                    result.applicationId
                )
                .single();

            if (
                error ||
                !applicant
            ) {
                throw new Error(
                    "Could not fetch applicant for result sheet"
                );
            }

            /*
             * -----------------------------------------------------
             * Get actual reviewer name
             * -----------------------------------------------------
             */

            const reviewerName =
                await getReviewerName(
                    supabase,
                    user
                );

            const response =
                (applicant as any)
                    .applicant_response;

            const responseData =
                Array.isArray(response)
                    ? response[0]
                    : response;

            const branch =
                responseData?.branch ||
                "";

            /*
             * -----------------------------------------------------
             * Send result to Google Apps Script
             * -----------------------------------------------------
             */

            const googleResponse =
                await fetch(
                    googleScriptUrl,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            operation:
                                "result",

                            applicationId:
                                result.applicationId,

                            name:
                                applicant.name,

                            phone:
                                applicant.phone ||
                                "",

                            sid:
                                applicant.sid,

                            branch,

                            result:
                                result.status,

                            remarks:
                                result.remarks ||
                                "",

                            /*
                             * IMPORTANT:
                             * Use the verified server-side
                             * reviewer name instead of the
                             * frontend's "Panelist" value.
                             */
                            reviewedBy:
                                reviewerName,

                            reviewedAt:
                                result.reviewedAt,

                            secret:
                                googleSheetsSecret,

                            userId:
                                user.id,
                        }),
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

            return new Response(
                JSON.stringify({
                    success: true,
                    operation:
                        "result",
                    reviewedBy:
                        reviewerName,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * Unsupported operation
         * ---------------------------------------------------------
         */

        return new Response(
            JSON.stringify({
                success: false,
                error:
                    "Unsupported operation",
            }),
            {
                status: 400,
                headers: {
                    ...corsHeaders,
                    "Content-Type":
                        "application/json",
                },
            }
        );
    } catch (error) {
        console.error(
            "sync-application-to-sheets error:",
            error
        );

        return new Response(
            JSON.stringify({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type":
                        "application/json",
                },
            }
        );
    }
});
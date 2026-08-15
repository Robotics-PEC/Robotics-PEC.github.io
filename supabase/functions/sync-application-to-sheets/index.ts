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
    sid: string;
    branch: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
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
    | ResultOperation;

Deno.serve(async (req: Request) => {
    /*
     * ---------------------------------------------------------
     * CORS preflight
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
                    "Content-Type": "application/json",
                },
            }
        );
    }

    try {
        /*
         * ---------------------------------------------------------
         * 1. Verify authenticated Supabase user
         * ---------------------------------------------------------
         */

        const authorization =
            req.headers.get("Authorization");

        if (!authorization) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Authentication required",
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
            Deno.env.get("SUPABASE_URL");

        const supabaseAnonKey =
            Deno.env.get("SUPABASE_ANON_KEY");

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error(
                "Supabase environment variables are missing"
            );
        }

        const supabase = createClient(
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
        } = await supabase.auth.getUser();

        if (userError || !user) {
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
         * 3. Read Google configuration
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
         * 4. APPLICATION OPERATION
         * ---------------------------------------------------------
         *
         * Existing behavior:
         * write the application to the current academic-year
         * application sheet.
         */

        if (data.operation === "application") {
            const application =
                data as ApplicationOperation;

            const requiredFields: (
                keyof ApplicationOperation
            )[] = [
                "applicationId",
                "name",
                "sid",
                "branch",
                "q1",
                "q2",
                "q3",
                "q4",
            ];

            for (const field of requiredFields) {
                if (
                    application[field] === undefined ||
                    application[field] === null ||
                    String(application[field])
                        .trim() === ""
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

                            userId: user.id,
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
                    operation: "application",
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
         * 5. RESULT OPERATION
         * ---------------------------------------------------------
         *
         * We do NOT ask the frontend to send name/SID/branch.
         *
         * We fetch those from the existing Supabase data using
         * the existing application ID.
         *
         * This avoids duplicating data sources.
         */

        if (data.operation === "result") {
            const result =
                data as ResultOperation;

            const { data: applicant, error } =
                await supabase
                    .from("applicants")
                    .select(
                        "id, name, sid, isWalkin, applicant_response(branch)"
                    )
                    .eq(
                        "id",
                        result.applicationId
                    )
                    .single();

            if (error || !applicant) {
                throw new Error(
                    "Could not fetch applicant for result sheet"
                );
            }

            const response =
                (applicant as any)
                    .applicant_response;

            const responseData =
                Array.isArray(response)
                    ? response[0]
                    : response;

            const branch =
                responseData?.branch || "";

            /*
             * Send the existing decision data + existing
             * applicant information to Apps Script.
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
                            operation: "result",

                            applicationId:
                                result.applicationId,

                            name:
                                applicant.name,

                            sid:
                                applicant.sid,

                            branch,

                            result:
                                result.status,

                            remarks:
                                result.remarks || "",

                            reviewedBy:
                                result.reviewedBy,

                            reviewedAt:
                                result.reviewedAt,

                            secret:
                                googleSheetsSecret,

                            userId: user.id,
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
                    operation: "result",
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
         * Unknown operation
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
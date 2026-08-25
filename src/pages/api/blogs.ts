import {
    getAuthenticatedSupabaseClient,
    getSupabaseClient,
} from "@/lib/supabase/supabase";
import { BlogUserType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

const fetchUserByEmail = async (email: string) => {
    const { data, error } = await getSupabaseClient()
        .from("blogs")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) {
        console.log(error);
        return { data: null, error };
    }

    return { data, error };
};

const fetchUserBySID = async (sid: string) => {
    const { data, error } = await getSupabaseClient()
        .from("blogs")
        .select("*")
        .eq("sid", sid)
        .maybeSingle();

    if (error) {
        console.log(error);
        return { data: null, error };
    }

    return { data, error };
};

const insertBlogPost = async (
    data: BlogUserType,
    req: NextApiRequest
) => {
    const { error } = await getAuthenticatedSupabaseClient(req)
        .from("blogs")
        .insert(data);

    if (error) {
        console.log(error);
        return error;
    }

    return null;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        switch (req.method) {
            case "GET": {
                const { email, sid } = req.query;

                if (email && sid) {
                    return res.status(400).json({
                        error: "Provide either email or sid, not both",
                    });
                }

                if (email) {
                    if (Array.isArray(email)) {
                        return res.status(400).json({
                            error: "Invalid email",
                        });
                    }

                    const result = await fetchUserByEmail(email);

                    if (result.error) {
                        return res.status(500).json({
                            error: result.error.message,
                        });
                    }

                    return res.status(200).json(result);
                }

                if (sid) {
                    if (Array.isArray(sid)) {
                        return res.status(400).json({
                            error: "Invalid SID",
                        });
                    }

                    const result = await fetchUserBySID(sid);

                    if (result.error) {
                        return res.status(500).json({
                            error: result.error.message,
                        });
                    }

                    return res.status(200).json(result);
                }

                return res.status(400).json({
                    error: "email or sid is required",
                });
            }

            case "POST": {
                const data = req.body as BlogUserType;

                if (!data) {
                    return res.status(400).json({
                        error: "Blog data is required",
                    });
                }

                const error = await insertBlogPost(data, req);

                if (error) {
                    return res.status(500).json({
                        error: error.message,
                    });
                }

                return res.status(200).json({
                    data: null,
                    error: null,
                });
            }

            default: {
                res.setHeader("Allow", ["GET", "POST"]);

                return res.status(405).json({
                    error: `Method ${req.method} not allowed`,
                });
            }
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};

export default handler;
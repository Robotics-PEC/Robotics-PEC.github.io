import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const getSupabaseClient = (req: NextApiRequest) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Missing authorization token");
    }
    const token = authHeader.substring(7);
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { courseCode, year, type, filePath, uploaderId } = req.body;
        const supabase = getSupabaseClient(req);

        const { data, error } = await supabase
            .from("questionPapers")
            .insert([
                {
                    courseCode,
                    year,
                    type,
                    filePath,
                    uploaderId,
                    isVerified: false,
                },
            ])
            .select();

        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(data);
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};

export default handler;

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

const getAdminSupabaseClient = () => {
    return createClient(supabaseUrl, supabaseServiceRoleKey);
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    const { id, filePath, isVerified } = req.body;

    try {
        const supabase = getSupabaseClient(req);
        const supabaseAdmin = getAdminSupabaseClient();

        if (isVerified) {
            // Verify: move from unverified to verified
            const fromBucket = "unverifiedPapers";
            const toBucket = "verifiedPapers";

            // 1. Download
            const { data: file, error: downloadError } = await supabase.storage
                .from(fromBucket)
                .download(filePath);
            if (downloadError)
                throw new Error(`Download failed: ${downloadError.message}`);

            // 2. Upload
            const { error: uploadError } = await supabaseAdmin.storage
                .from(toBucket)
                .upload(filePath, file, { upsert: true });
            if (uploadError)
                throw new Error(`Upload failed: ${uploadError.message}`);

            // 3. Remove old
            await supabaseAdmin.storage.from(fromBucket).remove([filePath]);
        } else {
            // Deverify: move from verified back to unverified
            const fromBucket = "verifiedPapers";
            const toBucket = "unverifiedPapers";

            // 1. Download
            const { data: file, error: downloadError } = await supabase.storage
                .from(fromBucket)
                .download(filePath);
            if (downloadError)
                throw new Error(`Download failed: ${downloadError.message}`);

            // 2. Upload
            const { error: uploadError } = await supabaseAdmin.storage
                .from(toBucket)
                .upload(filePath, file, { upsert: true });
            if (uploadError)
                throw new Error(`Upload failed: ${uploadError.message}`);

            // 3. Remove old
            await supabaseAdmin.storage.from(fromBucket).remove([filePath]);
        }

        // 4. Update DB
        const { error: dbError } = await supabase
            .from("questionPapers")
            .update({ isVerified })
            .eq("id", id);

        if (dbError) throw dbError;

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Admin verify error:", error);
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
}

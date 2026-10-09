import { NextApiRequest, NextApiResponse } from "next";
import { fetchVerifiedPapers } from "@/lib/supabase/actions/pyq.actions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed",
        });
    }

    try {
        const data = await fetchVerifiedPapers();
        return res.status(200).json(data);
    } catch (error) {
        console.error("PYQ list API error:", error);
        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};

export default handler;

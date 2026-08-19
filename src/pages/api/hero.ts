import { getAuthenticatedSupabaseClient, getSupabaseClient } from "@/lib/supabase/supabase";
import { HeroType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export const getHeroData = async () => {
    const { data, error } = await getSupabaseClient().from("hero").select("*").eq("id", "e32e2ff0-8a37-4b44-aded-db033dc95333");

    if (error) {
        console.log(error);
    }

    if (!data) throw new Error("Could not fetch data for hero section");

    return {
        heading: data[0].heading,
        description: data[0].description
    };
};

export const updateHeroData = async (data: HeroType, req: NextApiRequest) => {
    const { error } = await getAuthenticatedSupabaseClient(req).from("hero").update(data).eq("id", "e32e2ff0-8a37-4b44-aded-db033dc95333");

    if (error) {
        console.log(error);
        return error;
    }

    return null;
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        switch (req.method) {
            case "GET": {
                const data = await getHeroData();

                return res.status(200).json(data);
            }

            case "PUT": {
                const result = await updateHeroData(
                    req.body as HeroType,
                    req
                );

                if (result) {
                    return res.status(500).json({
                        error: result.message,
                    });
                }

                return res.status(200).json({
                    error: null,
                });
            }

            default: {
                res.setHeader("Allow", ["GET", "PUT"]);

                return res.status(405).json({
                    error: `Method ${req.method} not allowed`,
                });
            }
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Internal server error",
        });
    }
};

export default handler;
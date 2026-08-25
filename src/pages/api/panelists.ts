import {
    getAuthenticatedSupabaseClient,
    getSupabaseClient,
} from "@/lib/supabase/supabase";
import { PanelistType } from "@/types";
import {
    NextApiRequest,
    NextApiResponse,
} from "next";

const fetchPanelists = async (req: NextApiRequest): Promise<
    PanelistType[]
> => {
    const {
        data,
        error,
    } = await await getAuthenticatedSupabaseClient(req)
        .from("panelists")
        .select("*")
        .order(
            "panelNumber",
            {
                ascending: true,
            }
        );

    if (error) {
        console.error(
            "Error fetching panelists:",
            error
        );

        return [];
    }

    return data as PanelistType[];
};

const updateMyStatus = async (
    panelNumber: number,
    isOccupied: boolean,
    req: NextApiRequest
): Promise<boolean> => {
    const {
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
            .from("panelists")
            .update({
                isOccupied:
                    isOccupied,
            })
            .eq(
                "panelNumber",
                panelNumber
            );

    if (error) {
        console.error(
            "Error updating panelist status:",
            error
        );

        return false;
    }

    return true;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        switch (req.method) {
            case "GET": {
                const data =
                    await fetchPanelists(req);

                return res
                    .status(200)
                    .json(data);
            }

            case "PUT": {
                const {
                    panelNumber,
                    isOccupied,
                } = req.body;

                if (
                    typeof panelNumber !==
                    "number" ||
                    typeof isOccupied !==
                    "boolean"
                ) {
                    return res
                        .status(400)
                        .json({
                            error:
                                "panelNumber must be a number and isOccupied must be a boolean",
                        });
                }

                const result =
                    await updateMyStatus(
                        panelNumber,
                        isOccupied,
                        req
                    );

                return res
                    .status(200)
                    .json(result);
            }

            default: {
                res.setHeader(
                    "Allow",
                    [
                        "GET",
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
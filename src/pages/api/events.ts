import {
    getAuthenticatedSupabaseClient,
    getSupabaseClient,
} from "@/lib/supabase/supabase";
import { FormEventType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

const getEvents = async () => {
    const { data, error } = await getSupabaseClient()
        .from("events")
        .select("*");

    if (error) {
        console.log(error);
    }

    return data;
};

const uploadEvent = async (
    event: FormEventType,
    req: NextApiRequest
) => {
    const client = getAuthenticatedSupabaseClient(req);

    const { id, ...rest } = event;

    const { error } = await client
        .from("events")
        .insert(rest);

    if (error) {
        console.log(error);
        return error;
    }

    return null;
};

const deleteEvent = async (
    id: string,
    req: NextApiRequest
) => {
    const client = getAuthenticatedSupabaseClient(req);

    const response = await client
        .from("events")
        .delete()
        .eq("id", id);

    return response;
};

const updateEvent = async (
    event: FormEventType,
    req: NextApiRequest
) => {
    const client = getAuthenticatedSupabaseClient(req);

    const { id, ...rest } = event;

    const { error } = await client
        .from("events")
        .update(rest)
        .eq("id", id);

    if (error) {
        console.log(error);
    }

    return error;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        switch (req.method) {
            case "GET": {
                const data = await getEvents();

                return res.status(200).json(data);
            }

            case "POST": {
                const result = await uploadEvent(
                    req.body as FormEventType,
                    req
                );

                return res.status(200).json(result);
            }

            case "DELETE": {
                const { id } = req.query;

                if (!id || Array.isArray(id)) {
                    return res.status(400).json({
                        error: "Event ID is required",
                    });
                }

                const result = await deleteEvent(id, req);

                return res.status(200).json(result);
            }

            case "PUT": {
                const result = await updateEvent(
                    req.body as FormEventType,
                    req
                );

                return res.status(200).json(result);
            }

            default: {
                res.setHeader("Allow", [
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                ]);

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
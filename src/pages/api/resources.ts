import {
    getAuthenticatedSupabaseClient,
    getSupabaseClient,
} from "@/lib/supabase/supabase";
import { FormResourceType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

const getResourceData = async () => {
    const { data, error } = await getSupabaseClient()
        .from("resources")
        .select("*");

    if (error) {
        console.log(error);
    }

    return { data, error };
};

const uploadResource = async (
    data: FormResourceType,
    req: NextApiRequest
) => {
    const { id, ...rest } = data;

    const { error } = await getAuthenticatedSupabaseClient(req)
        .from("resources")
        .insert(rest);

    if (error) {
        console.log(error);
    }

    return error;
};

const deleteResource = async (
    resource: FormResourceType,
    req: NextApiRequest
) => {
    const response = await getAuthenticatedSupabaseClient(req)
        .from("resources")
        .delete()
        .eq("id", resource.id);

    return response;
};

const updateResource = async (
    resource: FormResourceType,
    req: NextApiRequest
) => {
    const { id, ...rest } = resource;

    const { error } = await getAuthenticatedSupabaseClient(req)
        .from("resources")
        .update(rest)
        .eq("id", resource.id);

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
                const result = await getResourceData();

                if (result.error) {
                    return res.status(500).json({
                        error: result.error.message,
                    });
                }

                return res.status(200).json(result);
            }

            case "POST": {
                const data = req.body as FormResourceType;

                if (!data) {
                    return res.status(400).json({
                        error: "Resource data is required",
                    });
                }

                const error = await uploadResource(data, req);

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

            case "PUT": {
                const resource = req.body as FormResourceType;

                if (!resource?.id) {
                    return res.status(400).json({
                        error: "Resource with id is required",
                    });
                }

                const error = await updateResource(
                    resource,
                    req
                );

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

            case "DELETE": {
                const resource =
                    req.body as FormResourceType;

                if (!resource?.id) {
                    return res.status(400).json({
                        error: "Resource with id is required",
                    });
                }

                const result = await deleteResource(
                    resource,
                    req
                );

                if (result.error) {
                    return res.status(500).json({
                        error: result.error.message,
                    });
                }

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
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};

export default handler;
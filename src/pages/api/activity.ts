import { FormActivityType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteMarkdownFile, uploadMarkdownFile, deleteMarkdownFolder } from "./storage";
import { getAuthenticatedSupabaseClient, getSupabaseClient } from "@/lib/supabase/supabase";

const getActivites = async () => {
    const { data, error } = await getSupabaseClient().from("activities").select("*");
    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Activies");
    return JSON.parse(JSON.stringify(data));
};

const getActivityById = async (id: string) => {
    const { data, error } = await getSupabaseClient().from("activities").select().eq("id", id);
    if (error) console.log(error);
    if (!data) throw new Error("Project with this id doesn't exist");
    return JSON.parse(JSON.stringify(data[0]));
};

const updateActivity = async (activity: FormActivityType, req: NextApiRequest) => {
    const { id, longDescription, ...rest } = activity;
    await deleteMarkdownFile(`${id}.md`, "activities",req);
    await uploadMarkdownFile(`${id}.md`, "activities", longDescription,req);
    const { error } = await getAuthenticatedSupabaseClient(req).from("activities").update(rest).eq("id", activity.id);
    if (error) {
        console.log(error);
    }
    return error;
};

const uploadActivity = async (activity: FormActivityType, req: NextApiRequest) => {
    // upload the activity -> upload the markdown file with the name === id
    const { id, longDescription, ...rest } = activity;
    const { data, error } = await getAuthenticatedSupabaseClient(req).from("activities").insert(rest).select().single();

    await uploadMarkdownFile(`${data.id}.md`, "activities", longDescription,req);

    if (error) {
        console.log(error);
        return { error: error };
    }
    return { error: null };

};



const deleteActivity = async (id: string, req: NextApiRequest) => {
    const data = await deleteMarkdownFolder(id, "activities",req);

    if (!data) {
        throw new Error(`Markdown file of ${id} in activities folder could not be deleted`);
    }

    const response = await getAuthenticatedSupabaseClient(req).from("activities").delete().eq("id", id);

    return response;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case "GET": {
                const { id } = req.query;

                if (id) {
                    const activity = await getActivityById(id as string);
                    return res.status(200).json(activity);
                }

                const activities = await getActivites();
                return res.status(200).json(activities);
            }

            case "POST": {
                const activity = req.body as FormActivityType;

                const result = await uploadActivity(activity, req);

                if (result.error) {
                    return res.status(500).json({
                        error: result.error.message,
                    });
                }

                return res.status(201).json({
                    message: "Activity created successfully",
                });
            }

            case "PUT": {
                const activity = req.body as FormActivityType;

                const error = await updateActivity(activity, req);

                if (error) {
                    return res.status(500).json({
                        error: error.message,
                    });
                }

                return res.status(200).json({
                    message: "Activity updated successfully",
                });
            }

            case "DELETE": {
                const { id } = req.query;

                if (!id) {
                    return res.status(400).json({
                        error: "Activity ID is required",
                    });
                }

                const result = await deleteActivity(id as string, req);

                if (result.error) {
                    return res.status(500).json({
                        error: result.error.message,
                    });
                }

                return res.status(200).json({
                    message: "Activity deleted successfully",
                });
            }

            default:
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
                return res.status(405).json({
                    error: `Method ${req.method} not allowed`,
                });
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
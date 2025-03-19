import { FormActivityType } from "@/types";
import { client } from "../supabase"
import { deleteMarkdownFile, deleteMarkdownFolder, uploadMarkdownFile } from "./storage.actions";

export const getActivites = async () => {
    const { data, error } = await client.from("activities").select("*");
    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Activies");
    return JSON.parse(JSON.stringify(data));
};

export const getActivityById = async (id: string) => {
    const { data, error } = await client.from("activities").select().eq("id", id);
    if (error) console.log(error);
    if (!data) throw new Error("Project with this id doesn't exist");
    return JSON.parse(JSON.stringify(data[0]));
};

export const updateActivity = async (activity: FormActivityType) => {
    const { id, longDescription, ...rest } = activity;
    await deleteMarkdownFile(`${id}.md`, "activities");
    await uploadMarkdownFile(`${id}.md`, "activities", longDescription);
    const { error } = await client.from("activities").update(rest).eq("id", activity.id);
    if (error) {
        console.log(error);
    }
    return error;
};

export const uploadActivity = async (activity: FormActivityType) => {
    // upload the activity -> upload the markdown file with the name === id
    const { id, longDescription, ...rest } = activity;
    const { data, error } = await client.from("activities").insert(rest).select().single();
    await uploadMarkdownFile(`${data.id}.md`, "activities", longDescription);

    if (error) {
        console.log(error);
        return { error: error };
    }
    return { error: null };

};



export const deleteActivity = async (id: string) => {
    const data = await deleteMarkdownFolder(id, "activities");

    if (!data) {
        throw new Error(`Markdown file of ${id} in activities folder could not be deleted`);
    }

    const response = await client.from("activities").delete().eq("id", id);

    return response;
};
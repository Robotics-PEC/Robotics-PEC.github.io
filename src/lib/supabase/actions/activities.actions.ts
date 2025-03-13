import { FormActivityType } from "@/types";
import { client } from "../supabase"

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

export const uploadActivity = async (activity: FormActivityType) => {
    const { id, ...rest } = activity;
    const { error } = await client.from("activities").insert(rest);
    if (error) {
        console.log(error);
        return { error: error };
    }
    return { error: null };

};

export const updateActivity = async (activity: FormActivityType) => {
    const { id, ...rest } = activity;
    const { error } = await client.from("activities").update(rest).eq("id", activity.id);
    if (error) {
        console.log(error);
    }
    return error;
};

export const deleteActivity = async (id: string) => {
    const response = await client.from("activities").delete().eq("id", id);
    return response;
};
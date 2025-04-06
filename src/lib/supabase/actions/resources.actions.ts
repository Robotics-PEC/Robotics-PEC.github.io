import { FormResourceType } from "@/types";
import { client } from "../supabase";
import { PostgrestError } from "@supabase/supabase-js";

export const getResourceData = async () => {

    const { data, error } = await client.from("resources").select("*");

    if (error) {
        console.log(error);
    }

    return { data, error };
};

export const uploadResource = async (data: FormResourceType) => {
    const { id, ...rest } = data;
    const { error } = await client.from("resources").insert(rest);

    if (error) {
        console.log(error);
    }

    return error;
};

export const deleteResource = async (resource: FormResourceType) => {
    const response = await client.from("projects").delete().eq("id", resource.id);

    return response;
};

export const updateResource = async (resource: FormResourceType) => {
    const { id, ...rest } = resource;
    const { error } = await client.from("resources").update(rest).eq("id", resource.id);


    if (error) {
        console.log(error);
    }

    return error;
};
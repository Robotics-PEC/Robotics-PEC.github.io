import { BlogUserType } from "@/types";
import { client } from "../supabase"

export const fetchUserByEmail = async (email: string) => {
    const { data, error } = await client.from("blogs").select("*").eq("email", email).maybeSingle();

    if (error) {
        console.log(error);
        return { data: null, error };
    }

    return { data, error };
};

export const fetchUserBySID = async (sid: string) => {
    const { data, error } = await client.from("blogs").select("*").eq("sid", sid).maybeSingle();

    if (error) {
        console.log(error);
        return { data: null, error };
    }

    return { data, error };
};

export const insertBlogPost = async (data: BlogUserType) => {
    const { error } = await client.from("blogs").insert(data);
    if (error) {
        console.log(error);
        return error;
    }

    return null;
}

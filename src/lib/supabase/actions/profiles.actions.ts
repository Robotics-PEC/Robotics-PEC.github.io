import { client } from "../supabase";

export const getProfileFromUserId = async (userId: string) => {
    const { data, error } = await client
        .from("profiles")
        .select("id")
        .eq("userId", userId)
        .single();

    return { data, error };
};

import { client } from "../supabase";

export const getEvents = async () => {
    const { data, error } = await client.from("events").select("*");

    if (error) {
        console.log(error);
    }

    return data;
};
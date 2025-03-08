import { client } from "../supabase"

export const getActivites = async () => {
    const { data, error } = await client.from("activities").select("*");
    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Activies");

    return JSON.parse(JSON.stringify(data));
}
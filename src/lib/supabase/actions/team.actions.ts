import {client} from "../supabase";

export const getTeamMembers = async () => {
    const { data, error } = await client.from("team").select("*");
    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Team Members");
    return JSON.parse(JSON.stringify(data));
};

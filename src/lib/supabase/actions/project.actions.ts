import { client } from "../supabase";

export const getProjects = async () => {
    const { data, error } = await client.from("projects").select("*");

    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Projects");

    return JSON.parse(JSON.stringify(data));

};

export const getProjectById = async (id: number) => {
    console.log(id);
    const { data, error } = await client.from("projects").select().eq("id", id);

    if (error) console.log(error);
    if (!data) throw new Error("Project with this id doesn't exist");

    return JSON.parse(JSON.stringify(data[0]));
}
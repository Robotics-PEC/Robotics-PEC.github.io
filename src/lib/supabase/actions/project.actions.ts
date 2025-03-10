import { Project } from "@/types";
import { client } from "../supabase";
import { uploadImage } from "./storage.actions";

export const getProjects = async () => {
    const { data, error } = await client.from("projects").select("*");

    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Projects");

    return JSON.parse(JSON.stringify(data));

};

export const getProjectById = async (id: number) => {
    const { data, error } = await client.from("projects").select().eq("id", id);

    if (error) console.log(error);
    if (!data) throw new Error("Project with this id doesn't exist");

    return JSON.parse(JSON.stringify(data[0]));
};

export const uploadProject = async (project: Project, fileName: string) => {
    await uploadImage("projects", fileName, project.image);
    const { data } = client.storage.from("media").getPublicUrl(`projects/${fileName}`);

    const { id, ...rest } = project;

    const { error } = await client.from("projects").insert({ ...rest, image: data.publicUrl });

    if (error) {
        console.log(error);
        return { error: error };
    }

    return { error: null };

}
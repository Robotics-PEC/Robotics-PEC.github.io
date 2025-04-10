import { FormProjectType } from "@/types";
import { client } from "../supabase";
import { deleteImage, uploadImage } from "./storage.actions";
import { urlToBase64 } from "@/lib/utils";
import { PostgrestError } from "@supabase/supabase-js";

export const getProjects = async () => {
    const { data, error } = await client.from("projects").select("*");

    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Projects");

    return JSON.parse(JSON.stringify(data));

};

export const getProjectById = async (id: string) => {
    const { data, error } = await client.from("projects").select().eq("id", id);

    if (error) console.log(error);
    if (!data) throw new Error("Project with this id doesn't exist");

    return JSON.parse(JSON.stringify(data[0]));
};

export const uploadProject = async (project: FormProjectType, fileName: string) => {
    await uploadImage("projects", fileName, project.image);
    const { data } = client.storage.from("media").getPublicUrl(`projects/${fileName}`);

    const { id, ...rest } = project;

    const { error } = await client.from("projects").insert({ ...rest, image: data.publicUrl });

    if (error) {
        console.log(error);
        return { error: error };
    }

    return { error: null };

};

export const deleteProject = async (project: FormProjectType) => {
    await deleteImage([`projects/${project.image.split("/").pop()!}`]);
    const response = await client.from("projects").delete().eq("id", project.id);

    return response;
};

export const updateProject = async (project: FormProjectType, fileName: string) => {
    const oldProjectData = await getProjectById(project.id);
    await deleteImage([`projects/${oldProjectData.image.split("/").pop()!}`]);
    const { id, ...rest } = project;
    const imageData = await uploadImage("projects", fileName, project.image);

    if (!imageData) {
        // image upload fail
        return new PostgrestError({ message: "Image upload fail", details: "", hint: "", code: "" });
    }

    const { data } = client.storage.from("media").getPublicUrl(`projects/${fileName}`);
    const { error } = await client.from("projects").update({ ...rest, image: data.publicUrl }).eq("id", project.id);


    if (error) {
        const fileData = await urlToBase64(oldProjectData.image);
        await uploadImage("projects", oldProjectData.image.split("/").pop()!, fileData)
        console.log(error);
    }

    return error;
};
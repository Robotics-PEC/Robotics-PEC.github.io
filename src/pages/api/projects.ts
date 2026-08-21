import {
    getAuthenticatedSupabaseClient,
    getSupabaseClient,
} from "@/lib/supabase/supabase";
import { FormProjectType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { urlToBase64 } from "@/lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { deleteImage, uploadImage } from "./storage";

const getProjects = async () => {
    const { data, error } = await getSupabaseClient()
        .from("projects")
        .select("*");

    if (error) console.log(error);

    if (!data) {
        throw new Error("Could not fetch Projects");
    }

    return JSON.parse(JSON.stringify(data));
};

const getProjectById = async (id: string) => {
    const { data, error } = await getSupabaseClient()
        .from("projects")
        .select()
        .eq("id", id);

    if (error) console.log(error);

    if (!data) {
        throw new Error("Project with this id doesn't exist");
    }

    return JSON.parse(JSON.stringify(data[0]));
};

const uploadProject = async (
    project: FormProjectType,
    fileName: string,
    req: NextApiRequest
) => {
    await uploadImage(
        "projects",
        fileName,
        project.image,
        req
    );

    const { data } = getAuthenticatedSupabaseClient(req)
        .storage
        .from("media")
        .getPublicUrl(`projects/${fileName}`);

    const { id, ...rest } = project;

    const { error } = await getAuthenticatedSupabaseClient(req)
        .from("projects")
        .insert({
            ...rest,
            image: data.publicUrl,
        });

    if (error) {
        console.log(error);
        return { error };
    }

    return { error: null };
};

const deleteProject = async (
    project: FormProjectType,
    req: NextApiRequest
) => {
    await deleteImage(
        [`projects/${project.image.split("/").pop()!}`],
        req
    );

    const response = await getAuthenticatedSupabaseClient(req)
        .from("projects")
        .delete()
        .eq("id", project.id);

    return response;
};

const updateProject = async (
    project: FormProjectType,
    fileName: string,
    req: NextApiRequest
) => {
    const oldProjectData = await getProjectById(project.id);

    await deleteImage(
        [`projects/${oldProjectData.image.split("/").pop()!}`],
        req
    );

    const { id, ...rest } = project;

    const imageData = await uploadImage(
        "projects",
        fileName,
        project.image,
        req
    );

    if (!imageData) {
        return new PostgrestError({
            message: "Image upload fail",
            details: "",
            hint: "",
            code: "",
        });
    }

    const { data } = getAuthenticatedSupabaseClient(req)
        .storage
        .from("media")
        .getPublicUrl(`projects/${fileName}`);

    const { error } = await getAuthenticatedSupabaseClient(req)
        .from("projects")
        .update({
            ...rest,
            image: data.publicUrl,
        })
        .eq("id", project.id);

    if (error) {
        const fileData = await urlToBase64(
            oldProjectData.image
        );

        await uploadImage(
            "projects",
            oldProjectData.image.split("/").pop()!,
            fileData,
            req
        );

        console.log(error);
    }

    return error;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        switch (req.method) {
            case "GET": {
                const { id } = req.query;

                if (id) {
                    if (Array.isArray(id)) {
                        return res.status(400).json({
                            error: "Invalid project ID",
                        });
                    }

                    const data = await getProjectById(id);

                    return res.status(200).json(data);
                }

                const data = await getProjects();

                return res.status(200).json(data);
            }

            case "POST": {
                const {
                    project,
                    fileName,
                }: {
                    project: FormProjectType;
                    fileName: string;
                } = req.body;

                const result = await uploadProject(
                    project,
                    fileName,
                    req
                );

                return res.status(200).json(result);
            }

            case "PUT": {
                const {
                    project,
                    fileName,
                }: {
                    project: FormProjectType;
                    fileName: string;
                } = req.body;

                const result = await updateProject(
                    project,
                    fileName,
                    req
                );

                return res.status(200).json(result);
            }

            case "DELETE": {
                const project =
                    req.body as FormProjectType;

                const result = await deleteProject(
                    project,
                    req
                );

                return res.status(200).json(result);
            }

            default: {
                res.setHeader("Allow", [
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                ]);

                return res.status(405).json({
                    error: `Method ${req.method} not allowed`,
                });
            }
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};

export default handler;
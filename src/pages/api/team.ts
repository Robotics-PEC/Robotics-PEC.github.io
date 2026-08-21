import {
    getAuthenticatedSupabaseClient,
    getSupabaseClient,
} from "@/lib/supabase/supabase";
import { FormTeamType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { urlToBase64 } from "@/lib/utils";
import { deleteImage, uploadImage } from "./storage";

const getTeamImages = async () => {
    const { data, error } = await getSupabaseClient()
        .from("team")
        .select("name, image");

    if (error) {
        console.error("Failed to fetch team images:", error);
        return [];
    }

    return data as { name: string; image: string }[];
};

const getTeamMembers = async () => {
    const { data, error } = await getSupabaseClient()
        .from("team")
        .select("*");

    if (error) {
        console.log(error);
    }

    if (!data) {
        throw new Error("Could not fetch Team Members");
    }

    return JSON.parse(JSON.stringify(data));
};

const getTeamMemberById = async (id: string) => {
    const { data, error } = await getSupabaseClient()
        .from("team")
        .select()
        .eq("id", id);

    if (error) {
        console.log(error);
    }

    if (!data || data.length === 0) {
        throw new Error("Team member with this id doesn't exist");
    }

    return JSON.parse(JSON.stringify(data[0]));
};

const getTeamMembersByCategory = async (category: string) => {
    const { data, error } = await getSupabaseClient()
        .from("team")
        .select("*")
        .eq("category", category);

    if (error) {
        console.log(error);
    }

    if (!data) {
        throw new Error(
            "Team with this category doesn't exist"
        );
    }

    return data;
};

const addTeamMember = async (
    memberData: FormTeamType,
    fileName: string,
    req: NextApiRequest
) => {
    await uploadImage(
        "team",
        fileName,
        memberData.image,
        req
    );

    const { data } = getAuthenticatedSupabaseClient(req)
        .storage
        .from("media")
        .getPublicUrl(`team/${fileName}`);

    const { id, ...rest } = memberData;

    const { error } = await getAuthenticatedSupabaseClient(req)
        .from("team")
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

const deleteTeamMember = async (
    member: FormTeamType,
    req: NextApiRequest
) => {
    const imageName = member.image.split("/").pop();

    if (imageName) {
        await deleteImage(
            [`team/${imageName}`],
            req
        );
    }

    const response = await getAuthenticatedSupabaseClient(req)
        .from("team")
        .delete()
        .eq("id", member.id);

    return response;
};

const updateTeamMember = async (
    member: FormTeamType,
    fileName: string,
    req: NextApiRequest
) => {
    const oldMemberData = await getTeamMemberById(member.id);

    const oldImageName = oldMemberData.image
        .split("/")
        .pop();

    if (oldImageName) {
        await deleteImage(
            [`team/${oldImageName}`],
            req
        );
    }

    const { id, ...rest } = member;

    const imageData = await uploadImage(
        "team",
        fileName,
        member.image,
        req
    );

    if (!imageData) {
        throw new Error("Image Upload Failed");
    }

    const { data } = getAuthenticatedSupabaseClient(req)
        .storage
        .from("media")
        .getPublicUrl(`team/${fileName}`);

    const { error } = await getAuthenticatedSupabaseClient(req)
        .from("team")
        .update({
            ...rest,
            image: data.publicUrl,
        })
        .eq("id", member.id);

    if (error) {
        // Restore old image if database update fails
        const fileData = await urlToBase64(
            oldMemberData.image
        );

        if (fileData && oldImageName) {
            await uploadImage(
                "team",
                oldImageName,
                fileData,
                req
            );
        }

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
                const {
                    id,
                    category,
                    images,
                } = req.query;

                // GET /api/team?images=true
                if (images === "true") {
                    const data = await getTeamImages();

                    return res.status(200).json(data);
                }

                // GET /api/team?id=...
                if (id) {
                    if (Array.isArray(id)) {
                        return res.status(400).json({
                            error: "Invalid team member ID",
                        });
                    }

                    const data = await getTeamMemberById(id);

                    return res.status(200).json(data);
                }

                // GET /api/team?category=...
                if (category) {
                    if (Array.isArray(category)) {
                        return res.status(400).json({
                            error: "Invalid category",
                        });
                    }

                    const data =
                        await getTeamMembersByCategory(
                            category
                        );

                    return res.status(200).json(data);
                }

                // GET /api/team
                const data = await getTeamMembers();

                return res.status(200).json(data);
            }

            case "POST": {
                const {
                    memberData,
                    fileName,
                }: {
                    memberData: FormTeamType;
                    fileName: string;
                } = req.body;

                if (!memberData || !fileName) {
                    return res.status(400).json({
                        error:
                            "memberData and fileName are required",
                    });
                }

                const result = await addTeamMember(
                    memberData,
                    fileName,
                    req
                );

                return res.status(200).json(result);
            }

            case "PUT": {
                const {
                    memberData,
                    fileName,
                }: {
                    memberData: FormTeamType;
                    fileName: string;
                } = req.body;

                if (!memberData || !fileName) {
                    return res.status(400).json({
                        error:
                            "memberData and fileName are required",
                    });
                }

                const result = await updateTeamMember(
                    memberData,
                    fileName,
                    req
                );

                return res.status(200).json(result);
            }

            case "DELETE": {
                const member =
                    req.body as FormTeamType;

                if (!member?.id) {
                    return res.status(400).json({
                        error: "Team member is required",
                    });
                }

                const result = await deleteTeamMember(
                    member,
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
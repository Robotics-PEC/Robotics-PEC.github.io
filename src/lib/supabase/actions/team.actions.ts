import { FormTeamType } from "@/types";
import { client } from "../supabase";
import { deleteImage, uploadImage } from "./storage.actions";
import { urlToBase64 } from "@/lib/utils";

export const getTeamMembers = async () => {
    const { data, error } = await client.from("team").select("*");
    if (error) console.log(error);
    if (!data) throw new Error("Could not fetch Team Members");
    return JSON.parse(JSON.stringify(data));
};

export const getTeamMemberById = async (id: string) => {
    const { data, error } = await client.from("team").select().eq("id", id);

    if (error) console.log(error);
    if (!data) throw new Error("Team member with this id doesn't exist");
    return JSON.parse(JSON.stringify(data[0]));
};

export const addTeamMember = async (memberData: FormTeamType, fileName: string) => {
    await uploadImage("team", fileName, memberData.image);
    const { data } = client.storage.from("media").getPublicUrl(`team/${fileName}`);
    const { id, ...rest } = memberData;

    const { error } = await client.from("team").insert({ ...rest, image: data.publicUrl });

    if (error) {
        console.log(error);
        return { error: error };
    }
    return { error: null }
};

export const deleteTeamMember = async (member: FormTeamType) => {
    await deleteImage([`projects/${member.image.split("/").pop()!}`]);
    const response = await client.from("team").delete().eq("id", member.id);

    return response;
};

export const updateTeamMember = async (member: FormTeamType, fileName: string) => {
    const oldMemberData = await getTeamMemberById(member.id);
    await deleteImage([`team/${oldMemberData.image.split("/").pop()!}`]);

    const { id, ...rest } = member;
    const imageData = await uploadImage("team", fileName, member.image);

    if (!imageData) {
        // image upload fail
        return new Error("Image Upload Failed");
    }

    const { data } = client.storage.from("media").getPublicUrl(`team/${fileName}`);

    const { error } = await client.from("team").update({ ...rest, image: data.publicUrl }).eq("id", member.id);


    if (error) {
        const fileData = await urlToBase64(oldMemberData.image);
        await uploadImage("projects", oldMemberData.image.split("/").pop()!, fileData)
        console.log(error);
    }

    return error;
};

export const getTeamMembersByCategory = async (category: string) => {
    const { data, error } = await client.from("team").select("*").eq("category", category);

    if (error) console.log(error);
    if (!data) throw new Error("Team with this category doesn't exist");
    return data;
};
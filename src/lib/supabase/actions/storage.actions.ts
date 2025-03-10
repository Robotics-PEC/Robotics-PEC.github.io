import { base64ToBlob } from "@/lib/utils";
import { client } from "../supabase";

export const getFileNames = async (folder: string) => {
    const { data, error } = await client.storage.from("media").list(folder);

    if (error) {
        console.log(error);
        return [];
    }

    return data?.map(file => file.name);
};

export const getImagesFromFolder = async (folder: string) => {
    const files = await getFileNames(folder);
    const publicUrls = [];

    for (let i = 0; i < files.length; i++) {

        const { data } = client.storage.from("media").getPublicUrl(`${folder}/${files[i]}`);

        publicUrls.push(data.publicUrl);
    }

    return publicUrls;
};

export const uploadImage = async (folder: string, name: string, fileData: string) => {
    const extension = name.split(".")[name.split(".").length - 1]
    const contentType = `image/${extension}`;
    const base64String = fileData.replace(/^data:image\/\w+;base64,/, '');
    const blob = base64ToBlob(base64String, contentType)
    const filePath = `${folder}/${name}`;

    const { data, error } = await client.storage.from("media").upload(filePath, blob, { contentType, upsert: true });

    if (error) console.log(error);

    return data;
};

export const deleteImage = async (paths: string[]) => {
    const { data, error } = await client.storage.from("media").remove(paths);

    if (error) {
        console.log(error);
        return;
    }

    return data;

};
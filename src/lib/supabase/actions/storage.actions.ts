import { client } from "../supabase"

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
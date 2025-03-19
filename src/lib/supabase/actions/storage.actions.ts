import { base64ToBlob, HTMLToMarkdown } from "@/lib/utils";
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

export const getMarkdownFile = async (fileName: string, type: string) => {
    const { data, error } = await client.storage.from("media").download(`markdown/${type}/${fileName.split(".")[0]}/${fileName}`);


    if (error) {
        console.log(error);
        return null;
    }

    const text = await data.text();
    return text;
};

export const uploadMarkdownFile = async (fileNameWithExtension: string, type: string, htmlData: string) => {
    const contentType = "text/markdown";
    const mdData = HTMLToMarkdown(htmlData);
    const file = new File([mdData], fileNameWithExtension, {
        type: contentType
    });

    await client.storage.from("media").upload(`markdown/${type}/${fileNameWithExtension.split(".")[0]}/${fileNameWithExtension}`, file, {
        contentType, upsert: true
    });
};

export const getMarkdownPublicURL = (fileName: string, folder: string) => {
    const { data } = client.storage.from("media").getPublicUrl(`markdown/${folder}/${fileName.split(".")[0]}/${fileName}`);

    return data.publicUrl;
};

export const getAllFiles = async (path: string) => {
    let allFiles: string[] = [];

    const { data: list, error } = await client
        .storage
        .from("media")
        .list(path, { limit: 1000 });

    if (error) {
        console.error('Error listing files:', error);
        return [];
    }

    for (const item of list) {
        if (item.name && item.metadata?.mimetype !== 'inode/directory') {
            allFiles.push(`${path ? path + '/' : ''}${item.name}`);
        }

        // Recursively handle subfolders
        if (item.name && item.metadata === null) {
            const subPath = `${path ? path + '/' : ''}${item.name}`;
            const nestedFiles = await getAllFiles(subPath);
            allFiles.push(...nestedFiles);
        }
    }

    return allFiles;
}

export const deleteMarkdownFolder = async (folder: string, type: string) => {
    const filesToDelete = await getAllFiles(`markdown/${type}/${folder}`);

    if (filesToDelete.length > 0) {
        const { data, error } = await client.storage.from("media").remove(filesToDelete);

        if (error) {
            console.log(error);
            return;
        }

        return data;
    }
    else {
        throw new Error(`No files in the folder "markdown/${type}/${folder}"`);
    }

};

export const deleteMarkdownFile = async (fileNameWithExtension: string, type: string) => {
    const { data, error } = await client.storage.from("media").remove([`markdown/${type}/${fileNameWithExtension.split(".")[0]}/${fileNameWithExtension}`]);

    if (error) {
        console.log(error);
        return;
    }

    return data;
}
import { getAuthenticatedSupabaseClient, getSupabaseClient } from "@/lib/supabase/supabase";
import { base64ToBlob, HTMLToMarkdown } from "@/lib/utils";

import { NextApiRequest, NextApiResponse } from "next";



export const getFileNames = async (folder: string) => {
    const { data, error } = await getSupabaseClient().storage.from("media").list(folder);

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

        const { data } = getSupabaseClient().storage.from("media").getPublicUrl(`${folder}/${files[i]}`);

        publicUrls.push(data.publicUrl);
    }

    return publicUrls;
};

export const uploadImage = async (folder: string, name: string, fileData: string, req: NextApiRequest) => {
    const extension = name.split(".")[name.split(".").length - 1]
    const contentType = `image/${extension}`;
    const base64String = fileData.replace(/^data:image\/\w+;base64,/, '');
    const blob = base64ToBlob(base64String, contentType)
    const filePath = `${folder}/${name}`;

    const { data, error } = await getAuthenticatedSupabaseClient(req).storage.from("media").upload(filePath, blob, { contentType, upsert: true });

    if (error) console.log(error);

    return data;
};

export const deleteImage = async (paths: string[], req: NextApiRequest) => {
    const { data, error } = await getAuthenticatedSupabaseClient(req).storage.from("media").remove(paths);

    if (error) {
        console.log(error);
        return;
    }

    return data;

};

export const getMarkdownFile = async (fileName: string, type: string) => {
    const { data, error } = await getSupabaseClient().storage.from("media").download(`markdown/${type}/${fileName.split(".")[0]}/${fileName}`);


    if (error) {
        console.log(error);
        return null;
    }

    const text = await data.text();
    return text;
};

export const uploadMarkdownFile = async (fileNameWithExtension: string, type: string, htmlData: string, req: NextApiRequest) => {
    const contentType = "text/markdown";
    const mdData = HTMLToMarkdown(htmlData);
    const file = new File([mdData], fileNameWithExtension, {
        type: contentType
    });

    await getAuthenticatedSupabaseClient(req).storage.from("media").upload(`markdown/${type}/${fileNameWithExtension.split(".")[0]}/${fileNameWithExtension}`, file, {
        contentType, upsert: true
    });
};

export const getMarkdownPublicURL = (fileName: string, folder: string) => {
    const { data } = getSupabaseClient().storage.from("media").getPublicUrl(`markdown/${folder}/${fileName.split(".")[0]}/${fileName}`);

    return data.publicUrl;
};

export const getAllFiles = async (path: string) => {
    let allFiles: string[] = [];

    const { data: list, error } = await getSupabaseClient()
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

export const deleteMarkdownFolder = async (folder: string, type: string, req: NextApiRequest) => {
    const filesToDelete = await getAllFiles(`markdown/${type}/${folder}`);

    if (filesToDelete.length > 0) {
        const { data, error } = await getAuthenticatedSupabaseClient(req).storage.from("media").remove(filesToDelete);

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

export const deleteMarkdownFile = async (fileNameWithExtension: string, type: string, req: NextApiRequest) => {
    const { data, error } = await getAuthenticatedSupabaseClient(req).storage.from("media").remove([`markdown/${type}/${fileNameWithExtension.split(".")[0]}/${fileNameWithExtension}`]);

    if (error) {
        console.log(error);
        return;
    }

    return data;
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { action } = req.query;

        switch (req.method) {
            case "GET": {
                switch (action) {
                    case "files": {
                        const { folder } = req.query;

                        if (!folder) {
                            return res.status(400).json({
                                error: "folder is required",
                            });
                        }

                        const data = await getFileNames(folder as string);

                        return res.status(200).json(data);
                    }

                    case "images": {
                        const { folder } = req.query;

                        if (!folder) {
                            return res.status(400).json({
                                error: "folder is required",
                            });
                        }

                        const data = await getImagesFromFolder(folder as string);

                        return res.status(200).json(data);
                    }

                    case "all-files": {
                        const { path } = req.query;

                        if (!path) {
                            return res.status(400).json({
                                error: "path is required",
                            });
                        }

                        const data = await getAllFiles(path as string);

                        return res.status(200).json(data);
                    }

                    case "markdown": {
                        const { fileName, type } = req.query;

                        if (!fileName || !type) {
                            return res.status(400).json({
                                error: "fileName and type are required",
                            });
                        }

                        const data = await getMarkdownFile(
                            fileName as string,
                            type as string
                        );

                        return res.status(200).json(data);
                    }

                    case "markdown-url": {
                        const { fileName, folder } = req.query;

                        if (!fileName || !folder) {
                            return res.status(400).json({
                                error: "fileName and folder are required",
                            });
                        }

                        const data = getMarkdownPublicURL(
                            fileName as string,
                            folder as string
                        );

                        return res.status(200).json(data);
                    }

                    case "image-url": {
                        const { path } = req.query;
                    
                        if (!path) {
                            return res.status(400).json({
                                error: "path is required",
                            });
                        }
                    
                        const cleanPath = (path as string).trim().replace(/^\/+/, "");
                    
                        if (!cleanPath) {
                            return res.status(200).json(null);
                        }
                    
                        // Already a complete URL
                        if (/^https?:\/\//i.test(path as string)) {
                            return res.status(200).json(path);
                        }
                    
                        const { data: signedData, error: signedError } = await getSupabaseClient()
                            .storage
                            .from("media")
                            .createSignedUrl(cleanPath, 60 * 60);
                    
                        if (!signedError && signedData?.signedUrl) {
                            return res.status(200).json(signedData.signedUrl);
                        }
                    
                        const { data: publicData } = getSupabaseClient()
                            .storage
                            .from("media")
                            .getPublicUrl(cleanPath);
                    
                        return res.status(200).json(publicData.publicUrl || null);
                    }

                    default:
                        return res.status(400).json({
                            error: "Invalid action",
                        });
                }
            }

            case "POST": {
                switch (action) {
                    case "upload-image": {
                        const { folder, name, fileData } = req.body;

                        if (!folder || !name || !fileData) {
                            return res.status(400).json({
                                error: "folder, name and fileData are required",
                            });
                        }

                        const data = await uploadImage(
                            folder,
                            name,
                            fileData,
                            req
                        );

                        return res.status(200).json(data);
                    }

                    case "upload-markdown": {
                        const {
                            fileNameWithExtension,
                            type,
                            htmlData,
                        } = req.body;

                        if (!fileNameWithExtension || !type || !htmlData) {
                            return res.status(400).json({
                                error: "fileNameWithExtension, type and htmlData are required",
                            });
                        }

                        await uploadMarkdownFile(
                            fileNameWithExtension,
                            type,
                            htmlData,
                            req
                        );

                        return res.status(200).json({
                            message: "Markdown file uploaded successfully",
                        });
                    }

                    default:
                        return res.status(400).json({
                            error: "Invalid action",
                        });
                }
            }

            case "DELETE": {
                switch (action) {
                    case "image": {
                        const { paths } = req.body;

                        if (!paths || !Array.isArray(paths)) {
                            return res.status(400).json({
                                error: "paths must be an array",
                            });
                        }

                        const data = await deleteImage(paths, req);

                        return res.status(200).json(data);
                    }

                    case "markdown-file": {
                        const {
                            fileNameWithExtension,
                            type,
                        } = req.body;

                        if (!fileNameWithExtension || !type) {
                            return res.status(400).json({
                                error: "fileNameWithExtension and type are required",
                            });
                        }

                        const data = await deleteMarkdownFile(
                            fileNameWithExtension,
                            type,
                            req
                        );

                        return res.status(200).json(data);
                    }

                    case "markdown-folder": {
                        const { folder, type } = req.body;

                        if (!folder || !type) {
                            return res.status(400).json({
                                error: "folder and type are required",
                            });
                        }

                        const data = await deleteMarkdownFolder(
                            folder,
                            type,
                            req
                        );

                        return res.status(200).json(data);
                    }

                    default:
                        return res.status(400).json({
                            error: "Invalid action",
                        });
                }
            }

            default:
                res.setHeader("Allow", ["GET", "POST", "DELETE"]);

                return res.status(405).json({
                    error: `Method ${req.method} not allowed`,
                });
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Internal server error",
        });
    }
};

export default handler;
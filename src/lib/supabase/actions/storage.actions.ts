import { apiFetch } from "../supabase";

const STORAGE_API = "/api/storage";

const getErrorMessage = async (response: Response) => {
    try {
        const data = await response.json();

        if (typeof data === "string") {
            return data;
        }

        return data?.error || `Request failed with status ${response.status}`;
    } catch {
        return `Request failed with status ${response.status}`;
    }
};

const get = async <T>(
    action: string,
    params: Record<string, string>
): Promise<T> => {
    const searchParams = new URLSearchParams({
        action,
        ...params,
    });

    const response = await fetch(
        `${STORAGE_API}?${searchParams.toString()}`
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

const post = async <T>(
    action: string,
    body: Record<string, unknown>
): Promise<T> => {
    const response = await apiFetch(STORAGE_API, {
        method: "POST",
        body: JSON.stringify({
            action,
            ...body,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

const del = async <T>(
    action: string,
    body: Record<string, unknown>
): Promise<T> => {
    const response = await apiFetch(STORAGE_API, {
        method: "DELETE",
        body: JSON.stringify({
            action,
            ...body,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};


export const getImagesFromFolder = async (folder: string) => {
    return get<string[]>("images", {
        folder,
    });
};


export const uploadImage = async (
    folder: string,
    name: string,
    fileData: string
) => {
    return post("upload-image", {
        folder,
        name,
        fileData,
    });
};


export const deleteImage = async (paths: string[]) => {
    return del("image", {
        paths,
    });
};


export const getMarkdownFile = async (
    fileName: string,
    type: string
) => {
    return get<string | null>("markdown", {
        fileName,
        type,
    });
};


export const uploadMarkdownFile = async (
    fileNameWithExtension: string,
    type: string,
    htmlData: string
) => {
    return post("upload-markdown", {
        fileNameWithExtension,
        type,
        htmlData,
    });
};


export const getMarkdownPublicURL = (
    fileName: string,
    folder: string
) => {
    return get<string>("markdown-url", {
        fileName,
        folder,
    });
};


export const getStorageImageUrl = async (path: string) => {
    if (!path?.trim()) {
        return null;
    }

    return get<string | null>("image-url", {
        path,
    });
};


export const getAllFiles = async (path: string) => {
    return get<string[]>("all-files", {
        path,
    });
};


export const deleteMarkdownFolder = async (
    folder: string,
    type: string
) => {
    return del("markdown-folder", {
        folder,
        type,
    });
};


export const deleteMarkdownFile = async (
    fileNameWithExtension: string,
    type: string
) => {
    return del("markdown-file", {
        fileNameWithExtension,
        type,
    });
};
import { BlogUserType } from "@/types";
import { apiFetch } from "../supabase";

const BLOGS_API = "/api/blogs";

const getErrorMessage = async (response: Response) => {
    try {
        const data = await response.json();

        if (typeof data === "string") {
            return data;
        }

        return (
            data?.error ||
            `Request failed with status ${response.status}`
        );
    } catch {
        return `Request failed with status ${response.status}`;
    }
};

export const fetchUserByEmail = async (email: string) => {
    const response = await fetch(
        `${BLOGS_API}?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const fetchUserBySID = async (sid: string) => {
    const response = await fetch(
        `${BLOGS_API}?sid=${encodeURIComponent(sid)}`
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const insertBlogPost = async (
    data: BlogUserType
) => {
    const response = await apiFetch(BLOGS_API, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const result = await response.json();

    return result.error ?? null;
};
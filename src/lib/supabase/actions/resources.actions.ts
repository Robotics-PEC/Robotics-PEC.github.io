import { FormResourceType } from "@/types";
import { apiFetch } from "../supabase";

const RESOURCES_API = "/api/resources";

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

export const getResourceData = async () => {
    const response = await fetch(RESOURCES_API);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const uploadResource = async (
    data: FormResourceType
) => {
    const response = await apiFetch(RESOURCES_API, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const result = await response.json();

    return result.error ?? null;
};

export const deleteResource = async (
    resource: FormResourceType
) => {
    const response = await apiFetch(RESOURCES_API, {
        method: "DELETE",
        body: JSON.stringify(resource),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const updateResource = async (
    resource: FormResourceType
) => {
    const response = await apiFetch(RESOURCES_API, {
        method: "PUT",
        body: JSON.stringify(resource),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const result = await response.json();

    return result.error ?? null;
};
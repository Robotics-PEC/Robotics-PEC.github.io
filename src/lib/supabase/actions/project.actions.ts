import { FormProjectType } from "@/types";
import { apiFetch } from "../supabase";

const PROJECTS_API = "/api/projects";

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

export const getProjects = async () => {
    const response = await fetch(PROJECTS_API);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const getProjectById = async (id: string) => {
    const response = await fetch(
        `${PROJECTS_API}?id=${encodeURIComponent(id)}`
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const uploadProject = async (
    project: FormProjectType,
    fileName: string
) => {
    const response = await apiFetch(PROJECTS_API, {
        method: "POST",
        body: JSON.stringify({
            project,
            fileName,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const deleteProject = async (
    project: FormProjectType
) => {
    const response = await apiFetch(PROJECTS_API, {
        method: "DELETE",
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const updateProject = async (
    project: FormProjectType,
    fileName: string
) => {
    const response = await apiFetch(PROJECTS_API, {
        method: "PUT",
        body: JSON.stringify({
            project,
            fileName,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};
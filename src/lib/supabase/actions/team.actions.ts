import { FormTeamType } from "@/types";
import { apiFetch } from "../supabase";

const TEAM_API = "/api/team";

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

export const getTeamImages = async () => {
    const response = await fetch(
        `${TEAM_API}?images=true`
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const getTeamMembers = async () => {
    const response = await fetch(TEAM_API);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const getTeamMemberById = async (id: string) => {
    const response = await fetch(
        `${TEAM_API}?id=${encodeURIComponent(id)}`
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const addTeamMember = async (
    memberData: FormTeamType,
    fileName: string
) => {
    const response = await apiFetch(TEAM_API, {
        method: "POST",
        body: JSON.stringify({
            memberData,
            fileName,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const deleteTeamMember = async (
    member: FormTeamType
) => {
    const response = await apiFetch(TEAM_API, {
        method: "DELETE",
        body: JSON.stringify(member),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const updateTeamMember = async (
    member: FormTeamType,
    fileName: string
) => {
    const response = await apiFetch(TEAM_API, {
        method: "PUT",
        body: JSON.stringify({
            memberData: member,
            fileName,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const getTeamMembersByCategory = async (
    category: string
) => {
    const response = await fetch(
        `${TEAM_API}?category=${encodeURIComponent(category)}`
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};
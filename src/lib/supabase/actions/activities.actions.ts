import { FormActivityType } from "@/types";
import { apiFetch } from "../supabase";

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

export const getActivites = async () => {
    try {
        // GET is public, so regular fetch is fine
        const response = await fetch("/api/activity");

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getActivityById = async (id: string) => {
    try {
        // GET is public, so regular fetch is fine
        const response = await fetch(
            `/api/activity?id=${encodeURIComponent(id)}`
        );

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateActivity = async (
    activity: FormActivityType
) => {
    try {
        // PUT requires authentication
        const response = await apiFetch("/api/activity", {
            method: "PUT",
            body: JSON.stringify(activity),
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const uploadActivity = async (
    activity: FormActivityType
) => {
    try {
        // POST requires authentication
        const response = await apiFetch("/api/activity", {
            method: "POST",
            body: JSON.stringify(activity),
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteActivity = async (id: string) => {
    try {
        // DELETE requires authentication
        const response = await apiFetch(
            `/api/activity?id=${encodeURIComponent(id)}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
};
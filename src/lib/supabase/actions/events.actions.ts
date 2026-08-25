import { FormEventType } from "@/types";
import { apiFetch } from "../supabase";

const EVENTS_API = "/api/events";

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

export const getEvents = async () => {
    const response = await fetch(EVENTS_API);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const uploadEvent = async (
    event: FormEventType
) => {
    const response = await apiFetch(EVENTS_API, {
        method: "POST",
        body: JSON.stringify(event),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const deleteEvent = async (
    id: string
) => {
    const response = await apiFetch(
        `${EVENTS_API}?id=${encodeURIComponent(id)}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const updateEvent = async (
    event: FormEventType
) => {
    const response = await apiFetch(EVENTS_API, {
        method: "PUT",
        body: JSON.stringify(event),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};
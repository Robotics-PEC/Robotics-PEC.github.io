import { HeroType } from "@/types";
import { apiFetch } from "../supabase";

const HERO_API = "/api/hero";

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

export const getHeroData = async () => {
    const response = await fetch(HERO_API);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};

export const updateHeroData = async (data: HeroType) => {
    const response = await apiFetch(HERO_API, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
};
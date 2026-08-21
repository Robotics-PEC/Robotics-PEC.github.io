import { FeatureFlagType } from "@/types";
import { client } from "../supabase"

export const createFeatureFlag = async (value: Omit<FeatureFlagType, "id" | "created_at" | "updatedAt">) => {
    const {error} = await client.from("featureFlags").insert(value);

    if(error) {
        console.log(error);
        return error;
    }

    return null;
}

export const getFeatureFlags= async (): Promise<FeatureFlagType[]>  => {
    const {data,error} = await client.from("featureFlags").select("*").order("name", {ascending: true});

    if(error) console.log(error);

    return (data ?? []) as FeatureFlagType[];
}

export const updateFeatureFlag = async (id: string, isEnabled: boolean) => {
    const {error} = await client.from("featureFlags").update({isEnabled}).eq("id", id);

    if(error) {
        console.log(error);
        return error;
    }
    return null;
}

export const getFeatureFlagByName = async (name: string): Promise<FeatureFlagType | null> => {
    const {data,error} = await client.from("featureFlags").select("*").eq("name", name).maybeSingle();

    if(error) {
        console.log(error);
    }

    return data as FeatureFlagType;
}
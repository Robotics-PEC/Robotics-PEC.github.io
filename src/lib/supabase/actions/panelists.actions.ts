import { client } from "../supabase";
import { PanelistType } from "@/types";

export const fetchPanelists = async (): Promise<PanelistType[]> => {
    const { data, error } = await client
        .from("panelists")
        .select("*")
        .order("panelNumber", { ascending: true });

    if (error) {
        console.error("Error fetching panelists:", error);
        return [];
    }

    return data as PanelistType[];
};

export const updateMyStatus = async (
    panelNumber: number,
    isOccupied: boolean
): Promise<boolean> => {
    const { error } = await client
        .from("panelists")
        .update({
            isOccupied: isOccupied,
        })
        .eq("panelNumber", panelNumber);

    if (error) {
        console.error("Error updating panelist status:", error);
        return false;
    }

    return true;
};

export const subscribeToPanelistUpdates = (
    onUpdate: (panelist: PanelistType) => void
) => {
    const channel = client
        .channel("panelists-status")
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "panelists",
            },
            (payload) => {
                onUpdate(payload.new as PanelistType);
            }
        )
        .subscribe();

    return () => {
        client.removeChannel(channel);
    };
};
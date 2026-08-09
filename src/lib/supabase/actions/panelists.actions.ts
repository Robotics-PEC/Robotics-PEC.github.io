import { panelistClient } from "../panelistClient";
import { PanelistType } from "@/types";

export const fetchPanelists = async (): Promise<PanelistType[]> => {
    const { data, error } = await panelistClient
        .from("panelists")
        .select("*")
        .order("panel_number", { ascending: true });

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
    const { error } = await panelistClient
        .from("panelists")
        .update({
            is_occupied: isOccupied,
        })
        .eq("panel_number", panelNumber);

    if (error) {
        console.error("Error updating panelist status:", error);
        return false;
    }

    return true;
};

export const subscribeToPanelistUpdates = (
    onUpdate: (panelist: PanelistType) => void
) => {
    const channel = panelistClient
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
        panelistClient.removeChannel(channel);
    };
};
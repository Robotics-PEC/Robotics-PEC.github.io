import { client } from "../supabase";
import { apiFetch } from "../supabase";
import { PanelistType } from "@/types";

const PANELISTS_API =
    "/api/panelists";

export const fetchPanelists =
    async (): Promise<
        PanelistType[]
    > => {
        const response =
            await apiFetch(
                PANELISTS_API
            );

        if (!response.ok) {
            console.error(
                "Error fetching panelists:",
                await response.text()
            );

            return [];
        }

        return response.json();
    };

export const updateMyStatus =
    async (
        panelNumber: number,
        isOccupied: boolean
    ): Promise<boolean> => {
        const response =
            await apiFetch(
                PANELISTS_API,
                {
                    method: "PUT",

                    body:
                        JSON.stringify({
                            panelNumber,
                            isOccupied,
                        }),
                }
            );

        if (!response.ok) {
            console.error(
                "Error updating panelist status:",
                await response.text()
            );

            return false;
        }

        return response.json();
    };

export const subscribeToPanelistUpdates =
    (
        onUpdate: (
            panelist: PanelistType
        ) => void
    ) => {
        const channel =
            client
                .channel(
                    `panelists-status-${Date.now()}`
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "UPDATE",
                        schema:
                            "public",
                        table:
                            "panelists",
                    },
                    (
                        payload
                    ) => {
                        onUpdate(
                            payload.new as PanelistType
                        );
                    }
                )
                .subscribe();

        return () => {
            client.removeChannel(
                channel
            );
        };
    };
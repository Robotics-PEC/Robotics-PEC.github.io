import { useEffect, useState } from "react";

import { PanelistType } from "@/types";

import PanelStatusIcon from "./PanelStatusIcon";
import MiniPanelIcon from "./MiniPanelIcon";

import {
    fetchPanelists,
    updateMyStatus,
    subscribeToPanelistUpdates,
} from "@/lib/supabase/actions/panelists.actions";

const PanelSidebar = () => {
    const [panelists, setPanelists] = useState<PanelistType[]>([]);
    const [myPanelNumber, setMyPanelNumber] = useState<number | null>(null);
    const [myName, setMyName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const session = sessionStorage.getItem("panelist_session");

        if (!session) {
            setIsLoading(false);
            return;
        }

        try {
            const parsedSession = JSON.parse(session);

            setMyPanelNumber(Number(parsedSession.panel_number));
            setMyName(parsedSession.name || "");
        } catch (error) {
            console.error("Invalid panelist session:", error);
        }
    }, []);

    useEffect(() => {
        const loadPanelists = async () => {
            const data = await fetchPanelists();

            setPanelists(data);
            setIsLoading(false);
        };

        loadPanelists();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToPanelistUpdates((updatedPanelist) => {
            setPanelists((currentPanelists) =>
                currentPanelists.map((panelist) =>
                    panelist.id === updatedPanelist.id
                        ? updatedPanelist
                        : panelist
                )
            );
        });

        return unsubscribe;
    }, []);

    const myPanel = panelists.find(
        (panelist) => panelist.panel_number === myPanelNumber
    );

    const handleToggle = async () => {
        if (myPanelNumber === null || !myPanel || isUpdating) {
            return;
        }

        const newStatus = !myPanel.is_occupied;

        setIsUpdating(true);

        const success = await updateMyStatus(
            myPanelNumber,
            newStatus
        );

        if (success) {
            setPanelists((currentPanelists) =>
                currentPanelists.map((panelist) =>
                    panelist.panel_number === myPanelNumber
                        ? {
                              ...panelist,
                              is_occupied: newStatus,
                          }
                        : panelist
                )
            );
        }

        setIsUpdating(false);
    };

    const otherPanelists = panelists.filter(
        (panelist) => panelist.panel_number !== myPanelNumber
    );

    return (
        <aside className="h-full w-full rounded-lg border bg-white p-6 shadow-sm">
            {/* Your Status */}
            <div className="flex flex-col items-center border-b pb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    Your Status
                </h2>

                {isLoading ? (
                    <p className="mt-6 text-sm text-gray-500">
                        Loading...
                    </p>
                ) : myPanel ? (
                    <>
                        <div className="mt-5">
                            <PanelStatusIcon
                                isOccupied={myPanel.is_occupied}
                                size="lg"
                            />
                        </div>

                        <p className="mt-3 font-semibold text-gray-800">
                            Panel {myPanel.panel_number}
                        </p>

                        <p className="text-sm text-gray-500">
                            {myName}
                        </p>

                        <button
                            type="button"
                            onClick={handleToggle}
                            disabled={isUpdating}
                            className={`mt-5 flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition ${
                                myPanel.is_occupied
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                            } ${
                                isUpdating
                                    ? "cursor-not-allowed opacity-50"
                                    : ""
                            }`}
                        >
                            <span
                                className={`h-3 w-3 rounded-full ${
                                    myPanel.is_occupied
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                }`}
                            />

                            {myPanel.is_occupied
                                ? "Occupied"
                                : "Free"}
                        </button>
                    </>
                ) : (
                    <p className="mt-6 text-sm text-red-500">
                        Panel information unavailable
                    </p>
                )}
            </div>

            {/* Other Panelists */}
            <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Other Panels
                </h2>

                <div className="mt-5 grid grid-cols-3 gap-5">
                    {otherPanelists.map((panelist) => (
                        <MiniPanelIcon
                            key={panelist.id}
                            panelist={panelist}
                        />
                    ))}
                </div>

                {!isLoading && otherPanelists.length === 0 && (
                    <p className="mt-4 text-sm text-gray-400">
                        No other panels found.
                    </p>
                )}
            </div>
        </aside>
    );
};

export default PanelSidebar;
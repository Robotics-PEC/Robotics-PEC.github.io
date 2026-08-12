import { useEffect, useState } from "react";
import { useAuthRole } from "@/lib/useAuthRole";

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

    const { role } = useAuthRole();

    useEffect(() => {
        if (!role) {
            return;
        }

        if (role.slug === "admin") {
            setMyName("Admin");
            setMyPanelNumber(null);
        } else {
            setMyName(role.name || "Panelist");
            const panelMatch = role.name?.match(/Panel\s*(\d+)/i);
            if (panelMatch) {
                setMyPanelNumber(parseInt(panelMatch[1], 10));
            } else {
                setMyPanelNumber(null);
            }
        }
    }, [role]);

    useEffect(() => {
        if (!role || role.slug === "admin" || myPanelNumber !== null) {
            return;
        }

        const matchedPanelists = panelists.filter(
            (panelist) =>
                panelist.name.trim().toLowerCase() === myName.trim().toLowerCase()
        );

        if (matchedPanelists.length === 1) {
            setMyPanelNumber(matchedPanelists[0].panelNumber);
        }
    }, [role, panelists, myPanelNumber, myName]);

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
        (panelist) => panelist.panelNumber === myPanelNumber
    );

    const handleToggle = async () => {
        if (myPanelNumber === null || !myPanel || isUpdating) {
            return;
        }

        const newStatus = !myPanel.isOccupied;

        setIsUpdating(true);

        const success = await updateMyStatus(
            myPanelNumber,
            newStatus
        );

        if (success) {
            setPanelists((currentPanelists) =>
                currentPanelists.map((panelist) =>
                    panelist.panelNumber === myPanelNumber
                        ? {
                              ...panelist,
                              isOccupied: newStatus,
                          }
                        : panelist
                )
            );
        }

        setIsUpdating(false);
    };

    const otherPanelists = panelists.filter(
        (panelist) => panelist.panelNumber !== myPanelNumber
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
                ) : role?.slug === "admin" ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <p className="mt-3 font-semibold text-gray-800">
                            Admin Access
                        </p>
                        <p className="text-sm text-gray-500">
                            Spectator Mode
                        </p>
                    </div>
                ) : myPanel ? (
                    <>
                        <div className="mt-5">
                            <PanelStatusIcon
                                isOccupied={myPanel.isOccupied}
                                size="lg"
                            />
                        </div>

                        <p className="mt-3 font-semibold text-gray-800">
                            Panel {myPanel.panelNumber}
                        </p>

                        <p className="text-sm text-gray-500">
                            {myName}
                        </p>

                        <button
                            type="button"
                            onClick={handleToggle}
                            disabled={isUpdating}
                            className={`mt-5 flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition ${
                                myPanel.isOccupied
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
                                    myPanel.isOccupied
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                }`}
                            />

                            {myPanel.isOccupied
                                ? "Occupied"
                                : "Free"}
                        </button>
                    </>
                ) : (
                    <p className="mt-6 text-sm text-red-500">
                        Panel information unavailable. Contact admin.
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
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
    const [panelists, setPanelists] =
        useState<PanelistType[]>([]);

    const [myPanelNumber, setMyPanelNumber] =
        useState<number | null>(null);

    const [myName, setMyName] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [isUpdating, setIsUpdating] =
        useState(false);

    /*
     * 0 = Panels 1-10
     * 1 = Panels 11-20
     */
    const [panelPage, setPanelPage] =
        useState(0);

    const { role } = useAuthRole();

    /*
     * ---------------------------------------------------------
     * Determine current user's panel
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (!role) {
            return;
        }

        if (role.slug === "admin") {
            setMyName("Admin");
            setMyPanelNumber(null);
            return;
        }

        setMyName(
            role.name || "Panelist"
        );

        const panelMatch =
            role.name?.match(
                /Panel\s*(\d+)/i
            );

        if (panelMatch) {
            setMyPanelNumber(
                parseInt(
                    panelMatch[1],
                    10
                )
            );
        } else {
            setMyPanelNumber(null);
        }
    }, [role]);

    /*
     * ---------------------------------------------------------
     * Fallback: match panel by name
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (
            !role ||
            role.slug === "admin" ||
            myPanelNumber !== null
        ) {
            return;
        }

        const matchedPanelists =
            panelists.filter(
                (panelist) =>
                    panelist.name &&
                    myName &&
                    panelist.name
                        .trim()
                        .toLowerCase() ===
                        myName
                            .trim()
                            .toLowerCase()
            );

        if (
            matchedPanelists.length === 1
        ) {
            setMyPanelNumber(
                matchedPanelists[0]
                    .panelNumber
            );
        }
    }, [
        role,
        panelists,
        myPanelNumber,
        myName,
    ]);

    /*
     * ---------------------------------------------------------
     * Load panelists
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const loadPanelists =
            async () => {
                const data =
                    await fetchPanelists();

                setPanelists(data);
                setIsLoading(false);
            };

        loadPanelists();
    }, []);

    /*
     * ---------------------------------------------------------
     * Realtime panel updates
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToPanelistUpdates(
                (updatedPanelist) => {
                    setPanelists(
                        (current) =>
                            current.map(
                                (panelist) =>
                                    panelist.id ===
                                    updatedPanelist.id
                                        ? updatedPanelist
                                        : panelist
                            )
                    );
                }
            );

        return unsubscribe;
    }, []);

    /*
     * ---------------------------------------------------------
     * Current panel
     * ---------------------------------------------------------
     */
    const myPanel =
        panelists.find(
            (panelist) =>
                panelist.panelNumber ===
                myPanelNumber
        );

    /*
     * ---------------------------------------------------------
     * Toggle current panel
     * ---------------------------------------------------------
     */
    const handleToggle = async () => {
        if (
            myPanelNumber === null ||
            !myPanel ||
            isUpdating
        ) {
            return;
        }

        const newStatus =
            !myPanel.isOccupied;

        setIsUpdating(true);

        const success =
            await updateMyStatus(
                myPanelNumber,
                newStatus
            );

        if (success) {
            setPanelists(
                (current) =>
                    current.map(
                        (panelist) =>
                            panelist.panelNumber ===
                            myPanelNumber
                                ? {
                                      ...panelist,
                                      isOccupied:
                                          newStatus,
                                  }
                                : panelist
                    )
            );
        }

        setIsUpdating(false);
    };

    /*
     * ---------------------------------------------------------
     * Sort ALL panels by their actual number.
     *
     * IMPORTANT:
     * We do this BEFORE removing the current panel.
     * This keeps:
     *
     * Page 1 = P1-P10
     * Page 2 = P11-P20
     * ---------------------------------------------------------
     */
    const sortedPanelists =
        [...panelists].sort(
            (a, b) =>
                a.panelNumber -
                b.panelNumber
        );

    /*
     * ---------------------------------------------------------
     * Actual panel groups
     * ---------------------------------------------------------
     */
    const firstTen =
        sortedPanelists.filter(
            (panelist) =>
                panelist.panelNumber >= 1 &&
                panelist.panelNumber <= 10
        );

    const secondTen =
        sortedPanelists.filter(
            (panelist) =>
                panelist.panelNumber >= 11 &&
                panelist.panelNumber <= 20
        );

    /*
     * Remove current user's panel ONLY after
     * determining the actual groups.
     */
    const visiblePanels =
        (
            panelPage === 0
                ? firstTen
                : secondTen
        ).filter(
            (panelist) =>
                panelist.panelNumber !==
                myPanelNumber
        );

    return (
        <aside className="flex h-full w-full flex-col rounded-lg border bg-white p-6 shadow-sm">

            {/* =================================================
                YOUR STATUS
                ================================================= */}
            <div className="flex shrink-0 flex-col items-center border-b pb-6">

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
                                isOccupied={
                                    myPanel.isOccupied
                                }
                                size="lg"
                            />
                        </div>

                        <p className="mt-3 font-semibold text-gray-800">
                            Panel{" "}
                            {
                                myPanel.panelNumber
                            }
                        </p>

                        <p className="text-sm text-gray-500">
                            {myName}
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleToggle
                            }
                            disabled={
                                isUpdating
                            }
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
                        Panel information
                        unavailable. Contact
                        admin.
                    </p>
                )}

            </div>

            {/* =================================================
                OTHER PANELS
                ================================================= */}
            <div className="mt-6 flex min-h-0 flex-1 flex-col">

                <h2 className="shrink-0 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Other Panels
                </h2>

                {/* Page buttons */}
                <div className="mt-4 grid shrink-0 grid-cols-2 gap-2">

                    <button
                        type="button"
                        onClick={() =>
                            setPanelPage(0)
                        }
                        className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                            panelPage === 0
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Panels 1–10
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setPanelPage(1)
                        }
                        className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                            panelPage === 1
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Panels 11–20
                    </button>

                </div>

                {/* Panel grid */}
                <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">

                    <div className="grid grid-cols-3 gap-x-4 gap-y-6">

                        {visiblePanels.map(
                            (panelist) => (
                                <MiniPanelIcon
                                    key={
                                        panelist.id
                                    }
                                    panelist={
                                        panelist
                                    }
                                />
                            )
                        )}

                    </div>

                    {!isLoading &&
                        visiblePanels.length ===
                            0 && (
                            <p className="mt-4 text-center text-sm text-gray-400">
                                No other panels
                                found.
                            </p>
                        )}

                </div>

            </div>

        </aside>
    );
};

export default PanelSidebar;
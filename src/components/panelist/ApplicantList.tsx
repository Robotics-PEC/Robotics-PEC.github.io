import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Search,
    Plus,
} from "lucide-react";

import { ApplicantType } from "@/types";

import {
    fetchApplicants,
    fetchApplicantWithResponses,
    subscribeToApplicantUpdates,
} from "@/lib/supabase/actions/applicants.actions";

import ApplicantCard from "./ApplicantCard";
import ApplicantFormView from "./ApplicantFormView";
import WalkInModal from "./WalkInModal";

const ApplicantList = () => {
    const [applicants, setApplicants] =
        useState<ApplicantType[]>([]);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [selectedApplicant, setSelectedApplicant] =
        useState<ApplicantType | null>(null);

    const [showWalkInModal, setShowWalkInModal] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    /*
     * ---------------------------------------------------------
     * LOAD APPLICANTS
     * ---------------------------------------------------------
     */
    const loadApplicants = async () => {
        setIsLoading(true);

        const data = await fetchApplicants();

        setApplicants(data);

        setIsLoading(false);
    };

    useEffect(() => {
        loadApplicants();
    }, []);

    /*
     * ---------------------------------------------------------
     * REALTIME UPDATES
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToApplicantUpdates(
                (updatedApplicant) => {
                    setApplicants(
                        (current) =>
                            current.map((app) =>
                                app.id ===
                                updatedApplicant.id
                                    ? {
                                          ...app,
                                          ...updatedApplicant,
                                      }
                                    : app
                            )
                    );

                    setSelectedApplicant(
                        (current) => {
                            if (
                                current &&
                                current.id ===
                                    updatedApplicant.id
                            ) {
                                return {
                                    ...current,
                                    ...updatedApplicant,
                                };
                            }

                            return current;
                        }
                    );

                    /*
                     * Rejection sound
                     */
                    if (
                        updatedApplicant.status ===
                        "rejected"
                    ) {
                        const audio =
                            new Audio(
                                "/sounds/faah.mp3"
                            );

                        audio.volume = 1.0;

                        audio
                            .play()
                            .catch((e) =>
                                console.log(
                                    "Meme audio blocked/failed:",
                                    e
                                )
                            );
                    }
                },

                (newApplicant) => {
                    setApplicants(
                        (current) => {
                            if (
                                current.some(
                                    (app) =>
                                        app.id ===
                                        newApplicant.id
                                )
                            ) {
                                return current;
                            }

                            return [
                                newApplicant,
                                ...current,
                            ];
                        }
                    );
                }
            );

        return unsubscribe;
    }, []);

    /*
     * ---------------------------------------------------------
     * WALK-IN CREATED
     * ---------------------------------------------------------
     */
    const handleWalkInSuccess = (
        newApplicant: ApplicantType
    ) => {
        setApplicants(
            (prev) => [
                newApplicant,
                ...prev,
            ]
        );

        setSelectedApplicant(
            newApplicant
        );
    };

    /*
     * ---------------------------------------------------------
     * SELECT APPLICANT
     *
     * ALWAYS fetch the complete applicant.
     *
     * This is the important change.
     *
     * Normal applications store:
     *
     * applicants
     *      +
     * applicant_response
     *
     * Therefore we fetch both before opening
     * the edit/view screen.
     * ---------------------------------------------------------
     */
    const handleSelectApplicant = async (
        applicant: ApplicantType
    ) => {
        /*
         * Show the selected applicant immediately
         * while we fetch the complete record.
         */
        setSelectedApplicant(
            applicant
        );

        /*
         * Fetch the complete record.
         *
         * This works for BOTH:
         *
         * - Walk-ins
         * - Normal applications
         */
        const fullApplicant =
            await fetchApplicantWithResponses(
                applicant.id
            );

        if (!fullApplicant) {
            /*
             * Keep the applicant already selected
             * if the detailed fetch fails.
             */
            return;
        }

        /*
         * Update the selected applicant with:
         *
         * name
         * SID
         * phone
         * status
         * remarks
         * branch
         * responses
         * reviewedBy
         * reviewedAt
         */
        setSelectedApplicant(
            fullApplicant
        );

        /*
         * Also update the list so that if the
         * applicant is opened again, the local
         * state already contains the complete data.
         */
        setApplicants(
            (current) =>
                current.map((app) =>
                    app.id ===
                    fullApplicant.id
                        ? fullApplicant
                        : app
                )
        );
    };

    /*
     * ---------------------------------------------------------
     * STATUS SORTING
     * ---------------------------------------------------------
     */
    const statusOrder: Record<
        string,
        number
    > = {
        pending: 1,
        accepted: 2,
        rejected: 3,
    };

    /*
     * ---------------------------------------------------------
     * SEARCH + SORT
     * ---------------------------------------------------------
     */
    const filteredApplicants =
        applicants
            .filter(
                (app) =>
                    app.name
                        .toLowerCase()
                        .includes(
                            searchQuery.toLowerCase()
                        ) ||
                    app.sid.includes(
                        searchQuery
                    )
            )
            .sort((a, b) => {
                const orderA =
                    statusOrder[
                        a.status
                    ] || 99;

                const orderB =
                    statusOrder[
                        b.status
                    ] || 99;

                return orderA - orderB;
            });

    /*
     * ---------------------------------------------------------
     * SELECTED APPLICANT VIEW
     * ---------------------------------------------------------
     */
    if (selectedApplicant) {
        return (
            <ApplicantFormView
                applicant={
                    selectedApplicant
                }
                onBack={() =>
                    setSelectedApplicant(
                        null
                    )
                }
                onStatusUpdate={(
                    updatedApplicant
                ) => {
                    /*
                     * Update list
                     */
                    setApplicants(
                        (prev) =>
                            prev.map(
                                (app) =>
                                    app.id ===
                                    updatedApplicant.id
                                        ? updatedApplicant
                                        : app
                            )
                    );

                    /*
                     * Update currently open applicant
                     */
                    setSelectedApplicant(
                        updatedApplicant
                    );
                }}
            />
        );
    }

    /*
     * ---------------------------------------------------------
     * APPLICANT LIST
     * ---------------------------------------------------------
     */
    return (
        <div className="flex h-full flex-col rounded-lg border bg-white">

            {/* Search + Walk-in */}
            <div className="flex items-center justify-between gap-4 border-b p-4">

                <div className="relative flex-1">

                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <Input
                        placeholder="Search by name or SID..."
                        value={
                            searchQuery
                        }
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                        className="pl-9"
                    />

                </div>

                <Button
                    onClick={() =>
                        setShowWalkInModal(
                            true
                        )
                    }
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />

                    Walk-In
                </Button>

            </div>

            {/* Applicants */}
            <div className="flex-1 overflow-y-auto p-4">

                {isLoading ? (

                    <div className="py-8 text-center text-gray-500">
                        Loading applicants...
                    </div>

                ) : filteredApplicants.length ===
                  0 ? (

                    <div className="py-8 text-center text-gray-500">
                        No applicants found.
                    </div>

                ) : (

                    filteredApplicants.map(
                        (app) => (
                            <ApplicantCard
                                key={app.id}
                                applicant={app}
                                onClick={
                                    handleSelectApplicant
                                }
                            />
                        )
                    )

                )}

            </div>

            {/* Walk-in modal */}
            <WalkInModal
                isOpen={
                    showWalkInModal
                }
                onClose={() =>
                    setShowWalkInModal(
                        false
                    )
                }
                onSuccess={
                    handleWalkInSuccess
                }
            />

        </div>
    );
};

export default ApplicantList;
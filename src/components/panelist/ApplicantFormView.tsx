import { useState } from "react";

import { useAuthRole } from "@/lib/useAuthRole";

import { ApplicantType } from "@/types";

import { Button } from "@/components/ui/button";

import {
    ArrowLeft,
    Pencil,
} from "lucide-react";

import ApplicantDecision from "./ApplicantDecision";
import ApplicantEditForm from "./ApplicantEditForm";

import {
    updateApplicant,
    updateApplicantDecision,
} from "@/lib/supabase/actions/applicants.actions";

import { APPLICATION_QUESTIONS } from "../ApplicationForm";

export interface ApplicantFormViewProps {
    applicant: ApplicantType;

    onBack: () => void;

    onStatusUpdate: (
        updatedApplicant: ApplicantType
    ) => void;
}

const ApplicantFormView = ({
    applicant,
    onBack,
    onStatusUpdate,
}: ApplicantFormViewProps) => {
    const { role } = useAuthRole();

    const [currentApplicant, setCurrentApplicant] =
        useState<ApplicantType>(
            applicant
        );

    const [currentStatus, setCurrentStatus] =
        useState<
            "pending" | "accepted" | "rejected"
        >(applicant.status);

    const [isEditing, setIsEditing] =
        useState(false);

    /*
     * ---------------------------------------------------------
     * SAVE EDITED APPLICANT
     * ---------------------------------------------------------
     *
     * This does NOT change status.
     */
    const handleSaveApplicant = async (
        editedApplicant: ApplicantType
    ) => {
        const updatedApplicant =
            await updateApplicant(
                editedApplicant.id,
                {
                    name:
                        editedApplicant.name,

                    sid:
                        editedApplicant.sid,

                    phone:
                        editedApplicant.phone ||
                        "",

                    remarks:
                        editedApplicant.remarks ||
                        "",

                    branch:
                        editedApplicant.branch,

                    responses:
                        editedApplicant.responses ||
                        {},
                }
            );

        if (!updatedApplicant) {
            throw new Error(
                "Failed to update applicant."
            );
        }

        /*
         * Preserve the existing decision.
         */
        setCurrentApplicant(
            updatedApplicant
        );

        setCurrentStatus(
            updatedApplicant.status
        );

        setIsEditing(false);

        /*
         * Update parent list immediately.
         */
        onStatusUpdate(
            updatedApplicant
        );
    };

    /*
     * ---------------------------------------------------------
     * ACCEPT / REJECT
     * ---------------------------------------------------------
     */
    const handleSubmitDecision = async (
        status:
            | "accepted"
            | "rejected",
        remarks: string
    ) => {
        const reviewedBy =
            role?.slug === "admin"
                ? "Admin"
                : "Panelist";

        const success =
            await updateApplicantDecision(
                currentApplicant.id,
                status,
                remarks,
                reviewedBy
            );

        if (!success) {
            throw new Error(
                "Failed to update applicant decision."
            );
        }

        const updatedApplicant: ApplicantType =
            {
                ...currentApplicant,

                status,

                remarks,

                reviewedBy,

                reviewedAt:
                    new Date().toISOString(),
            };

        setCurrentApplicant(
            updatedApplicant
        );

        setCurrentStatus(status);

        onStatusUpdate(
            updatedApplicant
        );
    };

    /*
     * ---------------------------------------------------------
     * EDIT MODE
     * ---------------------------------------------------------
     */
    if (isEditing) {
        return (
            <div className="flex h-full flex-col rounded-lg border bg-white p-6">

                {/* Header */}
                <div className="mb-6 flex items-center gap-4 border-b pb-4">

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setIsEditing(false)
                        }
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div>
                        <h2 className="text-2xl font-bold">
                            Edit Applicant
                        </h2>

                        <p className="text-muted-foreground">
                            {
                                currentApplicant.name
                            }

                            {" • "}

                            {
                                currentApplicant.sid
                            }
                        </p>
                    </div>

                </div>

                <ApplicantEditForm
                    applicant={
                        currentApplicant
                    }
                    onSave={
                        handleSaveApplicant
                    }
                    onCancel={() =>
                        setIsEditing(false)
                    }
                />

            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * NORMAL VIEW
     * ---------------------------------------------------------
     */
    return (
        <div className="flex h-full flex-col rounded-lg border bg-white p-6">

            {/* Header */}
            <div className="mb-6 flex items-center gap-4 border-b pb-4">

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex-1">

                    <h2 className="text-2xl font-bold">
                        {currentApplicant.name}
                    </h2>

                    <p className="text-muted-foreground">
                        SID:{" "}
                        {currentApplicant.sid}

                        {" "}

                        {currentApplicant.isWalkin
                            ? "(Walk-In)"
                            : ""}
                    </p>

                </div>

                {/* =============================================
                    EDIT BUTTON
                    =============================================

                    IMPORTANT:
                    There is NO status check here.

                    Therefore it appears for:
                    PENDING
                    ACCEPTED
                    REJECTED
                */}
                <Button
                    variant="outline"
                    onClick={() =>
                        setIsEditing(true)
                    }
                    className="flex items-center gap-2"
                >
                    <Pencil className="h-4 w-4" />

                    Edit
                </Button>

            </div>

            {/* Applicant details */}
            {currentApplicant.isWalkin ? (

                <div className="mb-6 flex flex-1 flex-col items-center justify-center rounded-lg border bg-gray-50 p-8 text-center">

                    <h3 className="mb-4 text-xl font-medium">
                        Walk-In Applicant
                    </h3>

                    <p className="mb-2 text-sm">
                        Name:{" "}
                        {currentApplicant.name}
                    </p>

                    <p className="mb-2 text-sm">
                        SID:{" "}
                        {currentApplicant.sid}
                    </p>

                    {currentApplicant.phone && (
                        <p className="text-sm">
                            Phone:{" "}
                            {
                                currentApplicant.phone
                            }
                        </p>
                    )}

                    {currentApplicant.remarks && (
                        <div className="mt-5 max-w-md rounded-md border bg-white p-4 text-left">

                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Remarks
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm">
                                {
                                    currentApplicant.remarks
                                }
                            </p>

                        </div>
                    )}

                </div>

            ) : (

                <div className="mb-6 flex-1 overflow-y-auto">

                    <div className="rounded-lg border bg-gray-50 p-6">

                        <h3 className="mb-6 text-xl font-semibold">
                            Application
                        </h3>

                        <div className="mb-8 grid gap-6 sm:grid-cols-2">

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Name
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {
                                        currentApplicant.name
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    SID
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {
                                        currentApplicant.sid
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {
                                        currentApplicant.phone ||
                                        "Not provided"
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Branch
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {
                                        currentApplicant.branch ||
                                        "Not provided"
                                    }
                                </p>
                            </div>

                        </div>

                        {/* Remarks */}
                        {currentApplicant.remarks && (
                            <div className="mb-8 rounded-lg border bg-white p-4">

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Remarks
                                </p>

                                <p className="mt-1 whitespace-pre-wrap text-sm">
                                    {
                                        currentApplicant.remarks
                                    }
                                </p>

                            </div>
                        )}

                        {/* Application questions */}
                        <div className="space-y-6">

                            {APPLICATION_QUESTIONS.map(
                                (question) => {

                                    const questionId =
                                        String(
                                            question.id
                                        );

                                    return (
                                        <div
                                            key={
                                                questionId
                                            }
                                        >

                                            <p className="text-sm font-semibold">
                                                {
                                                    question.text
                                                }
                                            </p>

                                            <div className="mt-2 rounded-md border bg-white p-4">

                                                <p className="whitespace-pre-wrap text-sm">
                                                    {
                                                        currentApplicant
                                                            .responses?.[
                                                            questionId
                                                        ] ||
                                                        "No answer provided."
                                                    }
                                                </p>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </div>
            )}

            {/* Decision section */}
            <ApplicantDecision
                applicantId={
                    currentApplicant.id
                }
                currentStatus={
                    currentStatus
                }
                remarks={
                    currentApplicant.remarks
                }
                reviewedBy={
                    currentApplicant.reviewedBy
                }
                onSubmitDecision={
                    handleSubmitDecision
                }
            />

        </div>
    );
};

export default ApplicantFormView;
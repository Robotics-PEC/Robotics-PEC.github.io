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
    resetApplicantDecision,
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

    const [currentStatus, setCurrentStatus] =
        useState<
            "pending" | "accepted" | "rejected"
        >(applicant.status);

    const [isEditing, setIsEditing] =
        useState(false);

    /*
     * Anyone who can reach the panelist applicant
     * view can edit.
     */
    const canEdit = true;

    /*
     * ---------------------------------------------------------
     * Save applicant
     * ---------------------------------------------------------
     */
    const handleSaveApplicant = async (
        editedApplicant: ApplicantType
    ) => {
        const updatedApplicant =
            await updateApplicant(
                applicant.id,
                {
                    name: editedApplicant.name,

                    sid: editedApplicant.sid,

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
                "Failed to update applicant"
            );
        }

        /*
         * Editing details or remarks does NOT
         * change the decision.
         */
        setCurrentStatus(
            updatedApplicant.status
        );

        setIsEditing(false);

        onStatusUpdate(
            updatedApplicant
        );
    };

    /*
     * ---------------------------------------------------------
     * Accept / Reject
     * ---------------------------------------------------------
     */
    const handleSubmitDecision = async (
        status: "accepted" | "rejected",
        remarks: string
    ) => {
        const reviewedBy =
            role?.slug === "admin"
                ? "Admin"
                : "Panelist";

        const success =
            await updateApplicantDecision(
                applicant.id,
                status,
                remarks,
                reviewedBy
            );

        if (!success) {
            throw new Error(
                "Failed to update applicant decision"
            );
        }

        setCurrentStatus(status);

        onStatusUpdate({
            ...applicant,

            status,

            remarks,

            reviewedBy,

            reviewedAt:
                new Date().toISOString(),
        });
    };

    /*
     * ---------------------------------------------------------
     * Reset decision
     * ---------------------------------------------------------
     */
    const handleResetDecision = async () => {
        const confirmed =
            window.confirm(
                "Reset this applicant to Pending? The current Accept/Reject decision and remarks will be cleared."
            );

        if (!confirmed) {
            return;
        }

        const success =
            await resetApplicantDecision(
                applicant.id
            );

        if (!success) {
            alert(
                "Failed to reset applicant decision."
            );

            return;
        }

        setCurrentStatus("pending");

        onStatusUpdate({
            ...applicant,

            status: "pending",

            remarks: undefined,

            reviewedBy: undefined,

            reviewedAt: undefined,
        });
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
                            {applicant.name}
                            {" • "}
                            {applicant.sid}
                        </p>

                    </div>

                </div>

                {/* Edit form */}
                <ApplicantEditForm
                    applicant={applicant}
                    onSave={
                        handleSaveApplicant
                    }
                    onCancel={() =>
                        setIsEditing(false)
                    }
                />

                {/* Reset decision */}
                {currentStatus !== "pending" && (
                    <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">

                        <h3 className="font-semibold text-yellow-900">
                            Interview Decision
                        </h3>

                        <p className="mt-1 text-sm text-yellow-800">
                            This applicant is
                            currently{" "}
                            <strong>
                                {currentStatus ===
                                "accepted"
                                    ? "Accepted"
                                    : "Rejected"}
                            </strong>
                            .
                        </p>

                        <p className="mt-2 text-sm text-yellow-800">
                            If the decision was
                            made by mistake,
                            reset the applicant
                            to Pending and
                            review them again.
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleResetDecision
                            }
                            className="mt-3"
                        >
                            Reset Decision to
                            Pending
                        </Button>

                    </div>
                )}

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

                {/* Back */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                {/* Applicant */}
                <div className="flex-1">

                    <h2 className="text-2xl font-bold">
                        {applicant.name}
                    </h2>

                    <p className="text-muted-foreground">
                        SID:{" "}
                        {applicant.sid}{" "}
                        {applicant.isWalkin
                            ? "(Walk-In)"
                            : ""}
                    </p>

                </div>

                {/* Edit */}
                {canEdit && (
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
                )}

            </div>

            {/* Applicant details */}
            {applicant.isWalkin ? (

                <div className="mb-6 flex flex-1 flex-col items-center justify-center rounded-lg border bg-gray-50 p-8 text-center">

                    <h3 className="mb-4 text-xl font-medium text-gray-700">
                        Walk-In Applicant
                        Details
                    </h3>

                    <p className="mb-2 text-sm font-medium text-gray-600">
                        Name:{" "}
                        {applicant.name}
                    </p>

                    <p className="mb-2 text-sm font-medium text-gray-600">
                        SID:{" "}
                        {applicant.sid}
                    </p>

                    {applicant.phone && (
                        <p className="text-sm font-medium text-gray-600">
                            Phone:{" "}
                            {applicant.phone}
                        </p>
                    )}

                    {applicant.remarks && (
                        <div className="mt-4 max-w-md rounded-md border bg-white p-4 text-left">

                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Remarks
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                {applicant.remarks}
                            </p>

                        </div>
                    )}

                </div>

            ) : (

                <div className="mb-6 flex-1 overflow-y-auto">

                    <div className="rounded-lg border bg-gray-50 p-6">

                        <h3 className="mb-6 text-xl font-semibold text-gray-900">
                            Application
                        </h3>

                        {/* Basic information */}
                        <div className="mb-8 grid gap-6 sm:grid-cols-2">

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Name
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {applicant.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    SID
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {applicant.sid}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {applicant.phone ||
                                        "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Branch
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {applicant.branch ||
                                        "Not provided"}
                                </p>
                            </div>

                        </div>

                        {/* Remarks */}
                        {applicant.remarks && (
                            <div className="mb-8 rounded-lg border bg-white p-4">

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Remarks
                                </p>

                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {applicant.remarks}
                                </p>

                            </div>
                        )}

                        {/* Questions */}
                        <div className="space-y-6">

                            {APPLICATION_QUESTIONS.map(
                                (q) => (
                                    <ApplicationAnswer
                                        key={q.id}
                                        number={String(
                                            q.id
                                        )}
                                        question={
                                            q.text
                                        }
                                        answer={
                                            applicant
                                                .responses?.[
                                                String(
                                                    q.id
                                                )
                                            ]
                                        }
                                    />
                                )
                            )}

                        </div>

                    </div>

                </div>
            )}

            {/* Decision */}
            <ApplicantDecision
                applicantId={
                    applicant.id
                }
                currentStatus={
                    currentStatus
                }
                remarks={
                    applicant.remarks
                }
                reviewedBy={
                    applicant.reviewedBy
                }
                onSubmitDecision={
                    handleSubmitDecision
                }
            />

        </div>
    );
};

/*
 * Application answer display.
 */
interface ApplicationAnswerProps {
    number: string;
    question: string;
    answer?: string;
}

function ApplicationAnswer({
    number,
    question,
    answer,
}: ApplicationAnswerProps) {
    return (
        <div>

            <p className="text-sm font-semibold leading-6 text-gray-900">

                <span className="mr-2 text-muted-foreground">
                    {number}.
                </span>

                {question}

            </p>

            <div className="mt-2 rounded-md border bg-white p-4">

                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {answer ||
                        "No answer provided."}
                </p>

            </div>

        </div>
    );
}

export default ApplicantFormView;
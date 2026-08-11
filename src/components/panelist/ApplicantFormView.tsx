import { useState } from "react";
import { useAuthRole } from "@/lib/useAuthRole";
import { ApplicantType } from "@/types";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import ApplicantDecision from "./ApplicantDecision";

import { updateApplicantDecision } from "@/lib/supabase/actions/applicants.actions";

export interface ApplicantFormViewProps {
    applicant: ApplicantType;
    onBack: () => void;
    onStatusUpdate: (updatedApplicant: ApplicantType) => void;
}

const ApplicantFormView = ({
    applicant,
    onBack,
    onStatusUpdate,
}: ApplicantFormViewProps) => {
    const { role } = useAuthRole();
    const [currentStatus, setCurrentStatus] = useState<
        "pending" | "accepted" | "rejected"
    >(applicant.status);

    const handleSubmitDecision = async (
        status: "accepted" | "rejected",
        remarks: string
    ) => {
        const reviewedBy = role?.slug === "admin" ? "Admin" : "Panelist";

        const success = await updateApplicantDecision(
            applicant.id,
            status,
            remarks,
            reviewedBy
        );

        if (!success) {
            throw new Error("Failed to update applicant decision");
        }

        setCurrentStatus(status);

        onStatusUpdate({
            ...applicant,
            status,
            remarks,
            reviewedBy: reviewedBy,
            reviewedAt: new Date().toISOString(),
        });
    };

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

                <div>
                    <h2 className="text-2xl font-bold">
                        {applicant.name}
                    </h2>

                    <p className="text-muted-foreground">
                        SID: {applicant.sid}{" "}
                        {applicant.isWalkin ? "(Walk-In)" : ""}
                    </p>
                </div>
            </div>

            {/* Applicant Details */}
            {applicant.isWalkin ? (
                <div className="mb-6 flex flex-1 flex-col items-center justify-center rounded-lg border bg-gray-50 p-8 text-center">
                    <h3 className="mb-4 text-xl font-medium text-gray-700">
                        Walk-In Applicant Details
                    </h3>

                    <p className="mb-2 text-sm font-medium text-gray-600">
                        Name: {applicant.name}
                    </p>

                    <p className="mb-2 text-sm font-medium text-gray-600">
                        SID: {applicant.sid}
                    </p>

                    {applicant.phone && (
                        <p className="text-sm font-medium text-gray-600">
                            Phone: {applicant.phone}
                        </p>
                    )}
                </div>
            ) : (
                <div className="mb-6 flex-1 overflow-y-auto">
                    <div className="rounded-lg border bg-gray-50 p-6">
                        <h3 className="mb-6 text-xl font-semibold text-gray-900">
                            Application
                        </h3>

                        {/* Basic Information */}
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
                                    Branch
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {applicant.branch || "Not provided"}
                                </p>
                            </div>
                        </div>

                        {/* Application Questions */}
                        <div className="space-y-6">
                            <ApplicationAnswer
                                number="Q1"
                                question="Why are you interested in robotics, and what motivates you to join this society?"
                                answer={applicant.q1}
                            />

                            <ApplicationAnswer
                                number="Q2"
                                question="Have you participated in any robotics competition or events? If yes, please provide details."
                                answer={applicant.q2}
                            />

                            <ApplicationAnswer
                                number="Q3"
                                question="If you would have the opportunity to make any robot of your choice, what would it be? Describe it."
                                answer={applicant.q3}
                            />

                            <ApplicationAnswer
                                number="Q4"
                                question="What are your expectations from Robotics Society?"
                                answer={applicant.q4}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Accept / Reject section */}
            <ApplicantDecision
                applicantId={applicant.id}
                currentStatus={currentStatus}
                remarks={applicant.remarks}
                reviewedBy={applicant.reviewedBy}
                onSubmitDecision={handleSubmitDecision}
            />
        </div>
    );
};

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
                    {answer || "No answer provided."}
                </p>
            </div>
        </div>
    );
}

export default ApplicantFormView;
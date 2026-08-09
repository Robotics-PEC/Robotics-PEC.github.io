import { useState } from "react";
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
    const [currentStatus, setCurrentStatus] = useState<
        "pending" | "accepted" | "rejected"
    >(applicant.status);

    const handleSubmitDecision = async (
        status: "accepted" | "rejected",
        remarks: string
    ) => {
        const session = sessionStorage.getItem("panelist_session");

        let reviewedBy = "Unknown Panelist";

        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                reviewedBy = parsedSession.name || reviewedBy;
            } catch (error) {
                console.error("Invalid panelist session:", error);
            }
        }

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
            reviewed_by: reviewedBy,
            reviewed_at: new Date().toISOString()
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border p-6">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
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
                        {applicant.is_walkin ? "(Walk-In)" : ""}
                    </p>
                </div>
            </div>

            {applicant.is_walkin ? (
                <div className="flex-1 flex flex-col items-center justify-center rounded-lg p-8 bg-gray-50 text-center mb-6 border">
                    <h3 className="text-xl font-medium text-gray-700 mb-4">
                        Walk-In Applicant Details
                    </h3>

                    <p className="text-sm font-medium text-gray-600 mb-2">
                        Name: {applicant.name}
                    </p>

                    <p className="text-sm font-medium text-gray-600 mb-2">
                        SID: {applicant.sid}
                    </p>

                    {applicant.phone && (
                        <p className="text-sm font-medium text-gray-600">
                            Phone: {applicant.phone}
                        </p>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 bg-gray-50 text-center mb-6">
                    <h3 className="text-xl font-medium text-gray-500 mb-2">
                        Application Form
                    </h3>

                    <p className="text-sm text-gray-400">
                        Placeholder for the main application form content.
                    </p>
                </div>
            )}

            <ApplicantDecision
                applicantId={applicant.id}
                currentStatus={currentStatus}
                remarks={applicant.remarks}
                reviewedBy={applicant.reviewed_by}
                onSubmitDecision={handleSubmitDecision}
            />
        </div>
    );
};

export default ApplicantFormView;
import { ApplicantType } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface ApplicantFormViewProps {
    applicant: ApplicantType;
    onBack: () => void;
}

const ApplicantFormView = ({ applicant, onBack }: ApplicantFormViewProps) => {
    return (
        <div className="flex flex-col h-full bg-white rounded-lg border p-6">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{applicant.name}</h2>
                    <p className="text-muted-foreground">SID: {applicant.sid} {applicant.is_walkin ? "(Walk-In)" : ""}</p>
                </div>
            </div>

            {applicant.is_walkin ? (
                <div className="flex-1 flex flex-col items-center justify-center rounded-lg p-8 bg-gray-50 text-center mb-6 border">
                    <h3 className="text-xl font-medium text-gray-700 mb-4">Walk-In Applicant Details</h3>
                    <p className="text-sm font-medium text-gray-600 mb-2">Name: {applicant.name}</p>
                    <p className="text-sm font-medium text-gray-600 mb-2">SID: {applicant.sid}</p>
                    {applicant.phone && <p className="text-sm font-medium text-gray-600">Phone: {applicant.phone}</p>}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 bg-gray-50 text-center mb-6">
                    <h3 className="text-xl font-medium text-gray-500 mb-2">Application Form</h3>
                    <p className="text-sm text-gray-400">Placeholder for the main application form content.</p>
                </div>
            )}

            {/* Placeholder for Decision Panel */}
            <div className="border rounded-lg p-6 bg-slate-50">
                <h3 className="font-semibold mb-2">Placeholder for Decision Panel</h3>
                <div className="flex gap-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                    <Button variant="destructive">Reject</Button>
                </div>
            </div>
        </div>
    );
};

export default ApplicantFormView;

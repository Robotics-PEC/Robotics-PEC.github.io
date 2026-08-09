import { useState } from "react";

export interface ApplicantDecisionProps {
    applicantId: string;
    currentStatus: "pending" | "accepted" | "rejected";
    onSubmitDecision: (
        status: "accepted" | "rejected",
        remarks: string
    ) => Promise<void>;
}

const ApplicantDecision = ({
    applicantId,
    currentStatus,
    onSubmitDecision,
}: ApplicantDecisionProps) => {
    const [selectedStatus, setSelectedStatus] = useState<
        "accepted" | "rejected" | null
    >(currentStatus === "pending" ? null : currentStatus);

    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedStatus || !remarks.trim() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmitDecision(selectedStatus, remarks.trim());
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 bg-slate-50">
            <h3 className="font-semibold mb-4">
                Interview Decision
            </h3>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => setSelectedStatus("accepted")}
                    className={`rounded-md px-4 py-2 font-medium ${
                        selectedStatus === "accepted"
                            ? "bg-green-600 text-white"
                            : "border border-green-600 bg-white text-green-700"
                    }`}
                >
                    Accept
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedStatus("rejected")}
                    className={`rounded-md px-4 py-2 font-medium ${
                        selectedStatus === "rejected"
                            ? "bg-red-600 text-white"
                            : "border border-red-600 bg-white text-red-700"
                    }`}
                >
                    Reject
                </button>
            </div>

            {selectedStatus && (
                <div className="mt-5">
                    <label
                        htmlFor={`remarks-${applicantId}`}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Remarks
                    </label>

                    <textarea
                        id={`remarks-${applicantId}`}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter your remarks..."
                        rows={4}
                        className="w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-gray-500"
                    />

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!remarks.trim() || isSubmitting}
                        className="mt-4 w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Submitting..."
                            : "Submit Decision"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ApplicantDecision;
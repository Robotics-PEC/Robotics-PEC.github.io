import { useState } from "react";
import { ReviewScore } from "@/types";
import { Slider } from "@/components/ui/slider";

export interface ApplicantDecisionProps {
    applicantId: string;
    currentStatus: "pending" | "accepted" | "rejected";
    reviewScore?: ReviewScore;
    remarks?: string;
    reviewedBy?: string;
    onSubmitReview: (
        reviewScore: ReviewScore,
        remarks: string
    ) => Promise<void>;
}

const PARAMETERS = [
    { key: "personality", label: "Personality" },
    { key: "thinking", label: "Thinking" },
    { key: "priorExperience", label: "Prior Experience" },
    { key: "motivation", label: "Motivation to join" },
    { key: "curiosity", label: "Curiosity" },
] as const;

const getColorClass = (val: number) => {
    if (val <= 3) return "text-red-600 bg-red-100 border-red-200";
    if (val <= 6) return "text-amber-600 bg-amber-100 border-amber-200";
    return "text-green-600 bg-green-100 border-green-200";
};

const ApplicantDecision = ({
    applicantId,
    currentStatus,
    reviewScore: initialReviewScore,
    remarks: initialRemarks,
    reviewedBy,
    onSubmitReview,
}: ApplicantDecisionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Default all scores to 5 so sliders have a valid initial state
    const [reviewScore, setReviewScore] = useState<ReviewScore>({
        personality: 5,
        thinking: 5,
        priorExperience: 5,
        motivation: 5,
        curiosity: 5
    });
    
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If a review has already been submitted, show the read-only view
    if (initialReviewScore || initialRemarks) {
        return (
            <div className="border rounded-lg p-6 bg-slate-50 mt-8">
                <h3 className="font-semibold mb-4 text-lg">Interview Review</h3>
                <div className="mb-6 space-y-4">
                    {PARAMETERS.map((param) => {
                        const score = initialReviewScore?.[param.key] || 0;
                        return (
                            <div key={param.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <span className="text-sm font-medium text-slate-700 w-1/3">{param.label}</span>
                                <div className="flex-1 max-w-sm">
                                    <Slider
                                        value={[score]}
                                        min={1}
                                        max={10}
                                        step={1}
                                        disabled
                                        className="w-full opacity-70"
                                    />
                                </div>
                                <div className={`flex h-8 w-10 items-center justify-center rounded-md border text-sm font-bold ${getColorClass(score)}`}>
                                    {score}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Remarks from {reviewedBy || "Panelist"}</label>
                    <div className="w-full rounded-md border border-gray-300 p-4 text-sm bg-white text-gray-700 leading-relaxed">
                        {initialRemarks || "No remarks provided."}
                    </div>
                </div>
            </div>
        );
    }

    if (!isExpanded) {
        return (
            <div className="mt-8 flex justify-center border-t border-slate-200 pt-8">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="rounded-lg bg-black px-8 py-3 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                    Give Review
                </button>
            </div>
        );
    }

    const isFormValid = remarks.trim().length > 0;

    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmitReview(reviewScore, remarks.trim());
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 bg-slate-50 mt-8 animate-in slide-in-from-top-4 fade-in duration-300">
            <h3 className="font-semibold mb-6 text-xl text-slate-800">
                Interview Review
            </h3>

            <div className="space-y-8 mb-8">
                {PARAMETERS.map((param) => {
                    const score = reviewScore[param.key];
                    return (
                        <div key={param.key} className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-semibold text-slate-700">
                                    {param.label}
                                </label>
                                <div className={`flex h-8 w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors ${getColorClass(score)}`}>
                                    {score}
                                </div>
                            </div>
                            <Slider
                                value={[score]}
                                onValueChange={([val]) => setReviewScore(prev => ({ ...prev, [param.key]: val }))}
                                min={1}
                                max={10}
                                step={1}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs font-medium text-slate-400">
                                <span>1</span>
                                <span>5</span>
                                <span>10</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-3 mt-8 pt-6 border-t border-slate-200">
                <label
                    htmlFor={`remarks-${applicantId}`}
                    className="block text-sm font-semibold text-slate-700"
                >
                    Detailed Remarks <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">
                    Please provide your detailed observations and reasoning for the scores above.
                </p>

                <textarea
                    id={`remarks-${applicantId}`}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter your detailed observations and review..."
                    rows={5}
                    className="w-full rounded-md border border-slate-300 p-4 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                />

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className="mt-6 w-full rounded-lg bg-black px-4 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                >
                    {isSubmitting
                        ? "Submitting Review..."
                        : "Submit Review"}
                </button>
            </div>
        </div>
    );
};

export default ApplicantDecision;
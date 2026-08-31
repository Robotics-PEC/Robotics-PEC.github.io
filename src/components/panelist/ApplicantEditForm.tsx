import { useEffect, useState } from "react";

import { ApplicantType } from "@/types";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
    Save,
    X,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { ReviewScore } from "@/types";

import { APPLICATION_QUESTIONS } from "../ApplicationForm";

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

interface ApplicantEditFormProps {
    applicant: ApplicantType;

    onSave: (
        updatedApplicant: ApplicantType
    ) => Promise<void>;

    onCancel: () => void;
}

const ApplicantEditForm = ({
    applicant,
    onSave,
    onCancel,
}: ApplicantEditFormProps) => {
    const [name, setName] = useState(
        applicant.name || ""
    );

    const [sid, setSid] = useState(
        applicant.sid || ""
    );

    const [phone, setPhone] = useState(
        applicant.phone || ""
    );

    const [branch, setBranch] = useState(
        applicant.branch || ""
    );

    const [remarks, setRemarks] =
        useState(
            applicant.remarks || ""
        );

    const [responses, setResponses] =
        useState<Record<string, string>>(
            applicant.responses || {}
        );

    const [reviewScore, setReviewScore] = useState<ReviewScore>(
        applicant.reviewScore || {
            personality: 5,
            thinking: 5,
            priorExperience: 5,
            motivation: 5,
            curiosity: 5
        }
    );

    const [isSaving, setIsSaving] =
        useState(false);

    /*
     * Keep form synchronized with the selected
     * applicant.
     */
    useEffect(() => {
        setName(applicant.name || "");
        setSid(applicant.sid || "");
        setPhone(applicant.phone || "");
        setBranch(applicant.branch || "");

        setRemarks(
            applicant.remarks || ""
        );

        setResponses(
            applicant.responses || {}
        );

        if (applicant.reviewScore) {
            setReviewScore(applicant.reviewScore);
        }
    }, [applicant]);

    const handleResponseChange = (
        questionId: string,
        value: string
    ) => {
        setResponses(
            (current) => ({
                ...current,
                [questionId]: value,
            })
        );
    };

    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        if (!name.trim()) {
            alert(
                "Name cannot be empty."
            );
            return;
        }

        if (!sid.trim()) {
            alert(
                "SID cannot be empty."
            );
            return;
        }

        if (
            !applicant.isWalkin &&
            !branch.trim()
        ) {
            alert(
                "Branch cannot be empty."
            );
            return;
        }

        setIsSaving(true);

        try {
            const updatedApplicant: ApplicantType =
                {
                    ...applicant,

                    name: name.trim(),

                    sid: sid.trim(),

                    phone: phone.trim(),

                    /*
                     * This works for BOTH:
                     * - pending
                     * - accepted
                     * - rejected
                     *
                     * and both:
                     * - normal applicants
                     * - walk-ins
                     */
                    remarks:
                        remarks.trim(),

                    ...(applicant.isWalkin
                        ? {}
                        : {
                              branch:
                                  branch.trim(),

                              responses,
                          }),

                    reviewScore,
                };

            await onSave(
                updatedApplicant
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">

            <div className="flex-1 overflow-y-auto">

                <div className="rounded-lg border bg-gray-50 p-6">

                    <h3 className="mb-6 text-xl font-semibold">
                        Edit Applicant
                    </h3>

                    {/* Basic details */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Name
                            </label>

                            <Input
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                SID
                            </label>

                            <Input
                                value={sid}
                                onChange={(e) =>
                                    setSid(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Phone
                            </label>

                            <Input
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {!applicant.isWalkin && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Branch
                                </label>

                                <Input
                                    value={branch}
                                    onChange={(e) =>
                                        setBranch(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        )}

                    </div>

                    {/* =========================================
                        REMARKS
                        ========================================= */}
                    <div className="mb-8">

                        <label
                            htmlFor="applicant-remarks"
                            className="mb-2 block text-sm font-medium"
                        >
                            Remarks
                        </label>

                        <Textarea
                            id="applicant-remarks"
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(
                                    e.target.value
                                )
                            }
                            placeholder="Enter or edit remarks..."
                            rows={5}
                        />

                        <p className="mt-2 text-xs text-muted-foreground">
                            Editing remarks does not
                            change the applicant's
                            accepted/rejected status.
                        </p>

                    </div>

                    {/* =========================================
                        REVIEW SCORE
                        ========================================= */}
                    <div className="mb-8">
                        <h4 className="mb-6 text-lg font-semibold">
                            Interview Review Score
                        </h4>

                        <div className="space-y-8">
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
                    </div>

                    {/* Application responses */}
                    {!applicant.isWalkin && (
                        <div>

                            <h4 className="mb-6 text-lg font-semibold">
                                Application Responses
                            </h4>

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
                                                className="rounded-lg border bg-white p-4"
                                            >

                                                <label className="block text-sm font-semibold">
                                                    {
                                                        question.text
                                                    }
                                                </label>

                                                <Textarea
                                                    value={
                                                        responses[
                                                            questionId
                                                        ] ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleResponseChange(
                                                            questionId,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    rows={5}
                                                    className="mt-3"
                                                />

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    )}

                </div>

            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-3 border-t pt-4">

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSaving}
                >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>

                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save className="mr-2 h-4 w-4" />

                    {isSaving
                        ? "Saving..."
                        : "Save Changes"}
                </Button>

            </div>

        </div>
    );
};

export default ApplicantEditForm;
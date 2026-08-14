import { useEffect, useState } from "react";

import { ApplicantType } from "@/types";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
    Save,
    X,
} from "lucide-react";

import { APPLICATION_QUESTIONS } from "../ApplicationForm";

export interface ApplicantEditFormProps {
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

    const [remarks, setRemarks] = useState(
        applicant.remarks || ""
    );

    const [responses, setResponses] =
        useState<Record<string, string>>(
            applicant.responses || {}
        );

    const [isSaving, setIsSaving] =
        useState(false);

    /*
     * Refresh form when applicant changes.
     */
    useEffect(() => {
        setName(applicant.name || "");
        setSid(applicant.sid || "");
        setPhone(applicant.phone || "");
        setBranch(applicant.branch || "");
        setRemarks(applicant.remarks || "");

        setResponses(
            applicant.responses || {}
        );
    }, [applicant]);

    /*
     * Update an application response.
     */
    const handleResponseChange = (
        questionId: string,
        value: string
    ) => {
        setResponses((current) => ({
            ...current,
            [questionId]: value,
        }));
    };

    /*
     * Save.
     */
    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        if (!name.trim()) {
            alert("Name cannot be empty.");
            return;
        }

        if (!sid.trim()) {
            alert("SID cannot be empty.");
            return;
        }

        if (
            !applicant.isWalkin &&
            !branch.trim()
        ) {
            alert("Branch cannot be empty.");
            return;
        }

        setIsSaving(true);

        try {
            const updatedApplicant:
                ApplicantType = {
                ...applicant,

                name: name.trim(),

                sid: sid.trim(),

                phone: phone.trim(),

                remarks:
                    remarks.trim(),

                ...(applicant.isWalkin
                    ? {}
                    : {
                          branch:
                              branch.trim(),

                          responses,
                      }),
            };

            await onSave(
                updatedApplicant
            );
        } catch (error) {
            console.error(
                "Error saving applicant:",
                error
            );

            alert(
                "Failed to save applicant changes."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto">

                <div className="rounded-lg border bg-gray-50 p-6">

                    <h3 className="mb-6 text-xl font-semibold text-gray-900">
                        Edit Applicant
                    </h3>

                    {/* Basic information */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2">

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="applicant-name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>

                            <Input
                                id="applicant-name"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="Applicant name"
                            />
                        </div>

                        {/* SID */}
                        <div>
                            <label
                                htmlFor="applicant-sid"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                SID
                            </label>

                            <Input
                                id="applicant-sid"
                                value={sid}
                                onChange={(e) =>
                                    setSid(
                                        e.target.value
                                    )
                                }
                                placeholder="Student ID"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="applicant-phone"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>

                            <Input
                                id="applicant-phone"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                                placeholder="Phone number"
                            />
                        </div>

                        {/* Branch */}
                        {!applicant.isWalkin && (
                            <div>
                                <label
                                    htmlFor="applicant-branch"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Branch
                                </label>

                                <Input
                                    id="applicant-branch"
                                    value={branch}
                                    onChange={(e) =>
                                        setBranch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Branch"
                                />
                            </div>
                        )}

                    </div>

                    {/* ------------------------------------------------
                        Remarks
                        ------------------------------------------------ */}
                    <div className="mb-8">

                        <label
                            htmlFor="applicant-remarks"
                            className="mb-2 block text-sm font-medium text-gray-700"
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
                            rows={4}
                            className="bg-white"
                        />

                        <p className="mt-1 text-xs text-muted-foreground">
                            Editing remarks does not
                            change the applicant's
                            Accept/Reject status.
                        </p>

                    </div>

                    {/* ------------------------------------------------
                        Application responses
                        ------------------------------------------------ */}
                    {!applicant.isWalkin && (
                        <div>

                            <h4 className="mb-6 text-lg font-semibold text-gray-900">
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

                                                <label
                                                    htmlFor={`question-${questionId}`}
                                                    className="block text-sm font-semibold leading-6 text-gray-900"
                                                >
                                                    <span className="mr-2 text-muted-foreground">
                                                        {
                                                            question.id
                                                        }
                                                        .
                                                    </span>

                                                    {
                                                        question.text
                                                    }
                                                </label>

                                                <Textarea
                                                    id={`question-${questionId}`}
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
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter applicant's answer..."
                                                    rows={
                                                        5
                                                    }
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
                    className="flex items-center gap-2"
                >
                    <X className="h-4 w-4" />

                    Cancel
                </Button>

                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />

                    {isSaving
                        ? "Saving..."
                        : "Save Changes"}
                </Button>

            </div>

        </div>
    );
};

export default ApplicantEditForm;
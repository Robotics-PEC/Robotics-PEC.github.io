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
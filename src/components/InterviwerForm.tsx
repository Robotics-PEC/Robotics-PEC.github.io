"use client";

import {
    useState,
} from "react";

import {
    createInterviewer,
    updateInterviewerPersonalInfo,
} from "@/lib/supabase/actions/interviewers.actions";

import type {
    InterviewerType,
} from "@/types";

const availableDaysOptions = [
    "September 1",
    "September 2",
    "September 3",
];

export const INTERVIEWER_QUESTIONS = [
    {
        id: "Q1",
        text: "List the activities you've participated in over the last year.",
    },
];

const createEmptyResponses =
    () =>
        INTERVIEWER_QUESTIONS.reduce(
            (
                acc,
                question
            ) => {
                acc[
                    question.id
                ] = "";

                return acc;
            },
            {} as Record<
                string,
                string
            >
        );

type FormState = {
    name: string;
    email: string;
    sid: string;

    availableDays: string[];

    responses: Record<
        string,
        string
    >;
};

const initialForm: FormState = {
    name: "",
    email: "",
    sid: "",
    availableDays: [],
    responses:
        createEmptyResponses(),
};

export default function InterviewerForm() {
    const [form, setForm] =
        useState<FormState>(
            initialForm
        );

    const [
        application,
        setApplication,
    ] =
        useState<InterviewerType | null>(
            null
        );

    const [error, setError] =
        useState("");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        savingPersonalInfo,
        setSavingPersonalInfo,
    ] = useState(false);

    /*
     * ---------------------------------------------------------
     * Field helper
     * ---------------------------------------------------------
     */

    const updateField = <
        K extends Exclude<
            keyof FormState,
            "responses" | "availableDays"
        >
    >(
        field: K,
        value: FormState[K]
    ) => {
        setForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        );
    };

    /*
     * ---------------------------------------------------------
     * Available days
     * ---------------------------------------------------------
     */

    const toggleAvailableDay = (
        day: string
    ) => {
        setForm(
            (current) => {
                const isSelected =
                    current.availableDays.includes(
                        day
                    );

                return {
                    ...current,

                    availableDays:
                        isSelected
                            ? current.availableDays.filter(
                                  (
                                      d
                                  ) =>
                                      d !==
                                      day
                              )
                            : [
                                  ...current.availableDays,
                                  day,
                              ],
                };
            }
        );
    };

    /*
     * ---------------------------------------------------------
     * Question response
     * ---------------------------------------------------------
     */

    const updateResponse = (
        questionId: string,
        value: string
    ) => {
        setForm(
            (current) => ({
                ...current,

                responses: {
                    ...current.responses,

                    [questionId]:
                        value,
                },
            })
        );
    };

    /*
     * ---------------------------------------------------------
     * Submit new application
     * ---------------------------------------------------------
     */

    const handleSubmit =
        async (
            event: React.FormEvent<HTMLFormElement>
        ) => {
            event.preventDefault();

            setError("");

            const name =
                form.name.trim();

            const email =
                form.email.trim();

            const sid =
                form.sid.trim();

            const availableDays =
                form.availableDays;

            /*
             * Required fields
             */

            if (
                !name ||
                !email ||
                !sid ||
                availableDays.length ===
                    0
            ) {
                setError(
                    "Please fill in all the required fields and select at least one available day."
                );

                return;
            }

            /*
             * Email validation
             */

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email
                )
            ) {
                setError(
                    "Please enter a valid email address."
                );

                return;
            }

            /*
             * SID validation
             */

            if (
                !/^\d{8}$/.test(
                    sid
                )
            ) {
                setError(
                    "SID must be exactly 8 digits."
                );

                return;
            }

            /*
             * Check questions
             */

            const missingResponses =
                INTERVIEWER_QUESTIONS.some(
                    (question) =>
                        !(
                            form.responses[
                                question.id
                            ] || ""
                        ).trim()
                );

            if (
                missingResponses
            ) {
                setError(
                    "Please answer the question below."
                );

                return;
            }

            /*
             * Trim responses
             */

            const trimmedResponses =
                Object.keys(
                    form.responses
                ).reduce(
                    (
                        acc,
                        key
                    ) => {
                        acc[key] =
                            (
                                form.responses[
                                    key
                                ] || ""
                            ).trim();

                        return acc;
                    },
                    {} as Record<
                        string,
                        string
                    >
                );

            setSubmitting(true);

            try {
                const result =
                    await createInterviewer(
                        name,
                        sid,
                        email,
                        availableDays,
                        trimmedResponses
                    );

                if (
                    !result.success
                ) {
                    if (
                        result.reason ===
                        "duplicate"
                    ) {
                        setError(
                            "You have already submitted an application."
                        );
                    } else {
                        setError(
                            "We could not submit your application. Please try again."
                        );
                    }

                    return;
                }

                /*
                 * Application successfully created.
                 */

                setApplication(
                    result.applicant
                );

                setForm({
                    name:
                        result
                            .applicant
                            .name ||
                        "",

                    email:
                        result
                            .applicant
                            .email ||
                        "",

                    sid:
                        result
                            .applicant
                            .sid ||
                        "",

                    availableDays:
                        result
                            .applicant
                            .availableDays ||
                        [],

                    responses:
                        result
                            .applicant
                            .responses ||
                        createEmptyResponses(),
                });
            } catch (
                submitError
            ) {
                console.error(
                    "Interviewer submission error:",
                    submitError
                );

                setError(
                    "We could not submit your application. Please try again."
                );
            } finally {
                setSubmitting(
                    false
                );
            }
        };

    /*
     * ---------------------------------------------------------
     * Save personal information
     * ---------------------------------------------------------
     */

    const handleSavePersonalInfo =
        async () => {
            if (!application) {
                return;
            }

            setError("");

            const name =
                form.name.trim();

            const email =
                form.email.trim();

            const sid =
                form.sid.trim();

            const availableDays =
                form.availableDays;

            /*
             * Required fields
             */

            if (
                !name ||
                !email ||
                !sid ||
                availableDays.length ===
                    0
            ) {
                setError(
                    "Please fill in all the personal information and select at least one available day."
                );

                return;
            }

            /*
             * Email validation
             */

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email
                )
            ) {
                setError(
                    "Please enter a valid email address."
                );

                return;
            }

            /*
             * SID validation
             */

            if (
                !/^\d{8}$/.test(
                    sid
                )
            ) {
                setError(
                    "SID must be exactly 8 digits."
                );

                return;
            }

            setSavingPersonalInfo(
                true
            );

            try {
                const result =
                    await updateInterviewerPersonalInfo(
                        application.id,
                        name,
                        email,
                        sid,
                        availableDays
                    );

                if (
                    !result.success
                ) {
                    setError(
                        result.reason ===
                            "not_found"
                            ? "Your application could not be found or can no longer be edited."
                            : "Could not update your personal information. Please try again."
                    );

                    return;
                }

                /*
                 * Update local application
                 */

                setApplication(
                    result.applicant
                );

                /*
                 * Update local form
                 */

                setForm(
                    (
                        current
                    ) => ({
                        ...current,

                        name:
                            result
                                .applicant
                                .name,

                        email:
                            result
                                .applicant
                                .email ||
                            "",

                        sid:
                            result
                                .applicant
                                .sid,

                        availableDays:
                            result
                                .applicant
                                .availableDays ||
                            [],
                    })
                );
            } catch (
                updateError
            ) {
                console.error(
                    "Interviewer update error:",
                    updateError
                );

                setError(
                    "Could not update your personal information. Please try again."
                );
            } finally {
                setSavingPersonalInfo(
                    false
                );
            }
        };

    /*
     * ---------------------------------------------------------
     * Existing application
     * ---------------------------------------------------------
     */

    if (application) {
        const canEdit =
            application.status ===
            "pending";

        return (
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Personal Information */}

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Personal Information
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {canEdit
                                    ? "You can update your personal information while your application is pending."
                                    : "Your personal information is locked because your application has been reviewed."}
                            </p>
                        </div>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                application.status ===
                                "accepted"
                                    ? "bg-green-100 text-green-700"
                                    : application.status ===
                                        "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {application.status
                                .charAt(
                                    0
                                )
                                .toUpperCase() +
                                application.status.slice(
                                    1
                                )}
                        </span>
                    </div>

                    <div className="mt-6 space-y-6">
                        {/* Name + Email */}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="existing-name"
                                    className="text-sm font-medium"
                                >
                                    Name
                                </label>

                                <input
                                    id="existing-name"
                                    type="text"
                                    value={
                                        form.name
                                    }
                                    disabled={
                                        !canEdit
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "name",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="existing-email"
                                    className="text-sm font-medium"
                                >
                                    Email
                                </label>

                                <input
                                    id="existing-email"
                                    type="email"
                                    value={
                                        form.email
                                    }
                                    disabled={
                                        !canEdit
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "email",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* SID */}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="existing-sid"
                                    className="text-sm font-medium"
                                >
                                    SID
                                </label>

                                <input
                                    id="existing-sid"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={
                                        8
                                    }
                                    value={
                                        form.sid
                                    }
                                    disabled={
                                        !canEdit
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "sid",
                                            event.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Available days */}

                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Days available
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {availableDaysOptions.map(
                                    (
                                        day
                                    ) => (
                                        <label
                                            key={
                                                day
                                            }
                                            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                                                canEdit
                                                    ? "cursor-pointer"
                                                    : "cursor-not-allowed opacity-60"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.availableDays.includes(
                                                    day
                                                )}
                                                disabled={
                                                    !canEdit
                                                }
                                                onChange={() =>
                                                    toggleAvailableDay(
                                                        day
                                                    )
                                                }
                                                className="h-4 w-4"
                                            />

                                            {
                                                day
                                            }
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        {canEdit && (
                            <button
                                type="button"
                                onClick={
                                    handleSavePersonalInfo
                                }
                                disabled={
                                    savingPersonalInfo
                                }
                                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingPersonalInfo
                                    ? "Saving..."
                                    : "Save Personal Information"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Submitted answers */}

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">
                        Submitted Application
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Your submitted answers cannot be changed.
                    </p>

                    <div className="mt-6 space-y-7">
                        {INTERVIEWER_QUESTIONS.map(
                            (
                                question
                            ) => (
                                <div
                                    key={
                                        question.id
                                    }
                                    className="space-y-3"
                                >
                                    <p className="text-sm font-medium leading-6">
                                        <span className="mr-2 text-muted-foreground">
                                            {
                                                question.id
                                            }
                                            .
                                        </span>

                                        {
                                            question.text
                                        }
                                    </p>

                                    <div className="rounded-md border bg-gray-50 p-4">
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                            {application
                                                .responses?.[
                                                question.id
                                            ] ||
                                                "No answer provided."}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * New application
     * ---------------------------------------------------------
     */

    return (
        <form
            onSubmit={
                handleSubmit
            }
            className="mx-auto max-w-3xl space-y-8"
        >
            {/* Personal Information */}

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Personal Information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Tell us a little about yourself.
                </p>

                <div className="mt-6 space-y-6">
                    {/* Name + Email */}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={
                                    form.name
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "name",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Enter your full name"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "email",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="you@example.com"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                            />
                        </div>
                    </div>

                    {/* SID */}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="sid"
                                className="text-sm font-medium"
                            >
                                SID
                            </label>

                            <input
                                id="sid"
                                type="text"
                                inputMode="numeric"
                                maxLength={
                                    8
                                }
                                value={
                                    form.sid
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "sid",
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="8-digit SID"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                            />
                        </div>
                    </div>

                    {/* Available days */}

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Days available
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {availableDaysOptions.map(
                                (
                                    day
                                ) => (
                                    <label
                                        key={
                                            day
                                        }
                                        className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.availableDays.includes(
                                                day
                                            )}
                                            onChange={() =>
                                                toggleAvailableDay(
                                                    day
                                                )
                                            }
                                            className="h-4 w-4"
                                        />

                                        {
                                            day
                                        }
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Application Question
                </h2>

                <div className="mt-6 space-y-7">
                    {INTERVIEWER_QUESTIONS.map(
                        (
                            question
                        ) => (
                            <Question
                                key={
                                    question.id
                                }
                                number={
                                    question.id
                                }
                                question={
                                    question.text
                                }
                                value={
                                    form
                                        .responses[
                                        question.id
                                    ]
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateResponse(
                                        question.id,
                                        value
                                    )
                                }
                            />
                        )
                    )}
                </div>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={
                    submitting
                }
                className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {submitting
                    ? "Submitting..."
                    : "Submit Application"}
            </button>
        </form>
    );
}

/*
 * ---------------------------------------------------------
 * Question component
 * ---------------------------------------------------------
 */

interface QuestionProps {
    number: string;
    question: string;
    value: string;
    onChange: (
        value: string
    ) => void;
}

function Question({
    number,
    question,
    value,
    onChange,
}: QuestionProps) {
    return (
        <div className="space-y-3">
            <label
                htmlFor={number}
                className="block text-sm font-medium leading-6"
            >
                <span className="mr-2 text-muted-foreground">
                    {number}.
                </span>

                {question}
            </label>

            <textarea
                id={number}
                value={value}
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target.value
                    )
                }
                rows={5}
                placeholder="Write your answer here..."
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
            />
        </div>
    );
}
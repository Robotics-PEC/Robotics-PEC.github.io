import {
    useEffect,
    useState,
} from "react";

import {
    createApplicant,
    fetchMyApplication,
    updateApplicantPersonalInfo,
} from "@/lib/supabase/actions/applicants.actions";

import type { ApplicantType } from "@/types";

const branches = [
    "Aerospace Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Production & Industrial Engineering",
    "Computer Science & Engineering (AI)",
    "Computer Science & Engineering (DS)",
    "Electronics Engineering (VLSI)",
    "Materials and Metallurgical Engineering",
    "Mathematics and Computing",
    "Bachelor of Design (B.Des)",
];

export const APPLICATION_QUESTIONS = [
    {
        id: "Q1",
        text: "Why are you interested in robotics, and what motivates you to join this society?",
    },
    {
        id: "Q2",
        text: "Have you participated in any robotics competition or events? If yes, please provide details.",
    },
    {
        id: "Q3",
        text: "If you would have the opportunity to make any robot of your choice, what would it be? Describe it.",
    },
    {
        id: "Q4",
        text: "What are your expectations from Robotics Society?",
    },
];

const createEmptyResponses = () =>
    APPLICATION_QUESTIONS.reduce(
        (acc, question) => {
            acc[question.id] = "";
            return acc;
        },
        {} as Record<string, string>
    );

type FormState = {
    name: string;
    phone: string;
    sid: string;
    branch: string;
    gender: string;
    hosteller: string;
    responses: Record<string, string>;
};

const initialForm: FormState = {
    name: "",
    phone: "",
    sid: "",
    branch: "",
    gender: "",
    hosteller: "",
    responses: createEmptyResponses(),
};

export default function ApplicationForm() {
    const [form, setForm] =
        useState<FormState>(initialForm);

    const [application, setApplication] =
        useState<ApplicantType | null>(null);

    const [
        checkingApplication,
        setCheckingApplication,
    ] = useState(true);

    const [error, setError] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [
        savingPersonalInfo,
        setSavingPersonalInfo,
    ] = useState(false);

    /*
     * ---------------------------------------------------------
     * Field helpers
     * ---------------------------------------------------------
     */

    const updateField = (
        field: Exclude<keyof FormState, "responses">,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const updateResponse = (
        questionId: string,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            responses: {
                ...current.responses,
                [questionId]: value,
            },
        }));
    };

    /*
     * ---------------------------------------------------------
     * Load existing application
     * ---------------------------------------------------------
     */

    useEffect(() => {
        let active = true;

        const loadApplication = async () => {
            const existing =
                await fetchMyApplication();

            if (!active) {
                return;
            }

            if (existing) {
                setApplication(existing);

                setForm({
                    name: existing.name || "",
                    phone: existing.phone || "",
                    sid: existing.sid || "",
                    branch: existing.branch || "",
                    gender: existing.gender || "",
                    hosteller:
                        existing.hosteller || "",
                    responses:
                        existing.responses ||
                        createEmptyResponses(),
                });
            }

            setCheckingApplication(false);
        };

        void loadApplication();

        return () => {
            active = false;
        };
    }, []);

    /*
     * ---------------------------------------------------------
     * Create new application
     * ---------------------------------------------------------
     */

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        const name =
            form.name.trim();

        const phone =
            form.phone.trim();

        const sid =
            form.sid.trim();

        const branch =
            form.branch;

        const gender =
            form.gender;

        const hosteller =
            form.hosteller;

        /*
         * Validate personal information
         */

        if (
            !name ||
            !phone ||
            !sid ||
            !branch ||
            !gender ||
            !hosteller
        ) {
            setError(
                "Please fill in all the required personal fields."
            );

            return;
        }

        /*
         * Validate gender
         */

        if (
            gender !== "male" &&
            gender !== "female"
        ) {
            setError(
                "Please select a valid gender."
            );

            return;
        }

        /*
         * Validate hosteller
         */

        if (
            hosteller !== "yes" &&
            hosteller !== "no"
        ) {
            setError(
                "Please select whether you are a hosteller."
            );

            return;
        }

        /*
         * Validate phone
         */

        if (
            !/^[6-9]\d{9}$/.test(
                phone
            )
        ) {
            setError(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }

        /*
         * Validate SID
         */

        if (
            !/^\d{8}$/.test(sid)
        ) {
            setError(
                "SID must be exactly 8 digits."
            );

            return;
        }

        /*
         * Validate application questions
         */

        const missingResponses =
            APPLICATION_QUESTIONS.some(
                (question) =>
                    !form.responses[
                        question.id
                    ].trim()
            );

        if (missingResponses) {
            setError(
                "Please answer all the application questions."
            );

            return;
        }

        /*
         * Trim all responses
         */

        const trimmedResponses =
            Object.keys(
                form.responses
            ).reduce(
                (acc, key) => {
                    acc[key] =
                        form.responses[
                            key
                        ].trim();

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
                await createApplicant(
                    name,
                    sid,
                    phone,
                    branch,
                    gender as
                        | "male"
                        | "female",
                    hosteller as
                        | "yes"
                        | "no",
                    trimmedResponses
                );

            if (!result.success) {
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
             * Store returned application
             */

            setApplication(
                result.applicant
            );

            setForm({
                name:
                    result.applicant.name ||
                    "",
                phone:
                    result.applicant.phone ||
                    "",
                sid:
                    result.applicant.sid ||
                    "",
                branch:
                    result.applicant.branch ||
                    "",
                gender:
                    result.applicant.gender ||
                    "",
                hosteller:
                    result.applicant.hosteller ||
                    "",
                responses:
                    result.applicant
                        .responses ||
                    createEmptyResponses(),
            });
        } catch (submissionError) {
            console.error(
                "Unexpected application submission error:",
                submissionError
            );

            setError(
                "We could not submit your application. Please try again."
            );
        } finally {
            setSubmitting(false);
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

            const phone =
                form.phone.trim();

            const sid =
                form.sid.trim();

            const branch =
                form.branch;

            const gender =
                form.gender;

            const hosteller =
                form.hosteller;

            /*
             * Validate fields
             */

            if (
                !name ||
                !phone ||
                !sid ||
                !branch ||
                !gender ||
                !hosteller
            ) {
                setError(
                    "Please fill in all the personal information."
                );

                return;
            }

            /*
             * Validate gender
             */

            if (
                gender !== "male" &&
                gender !== "female"
            ) {
                setError(
                    "Please select a valid gender."
                );

                return;
            }

            /*
             * Validate hosteller
             */

            if (
                hosteller !== "yes" &&
                hosteller !== "no"
            ) {
                setError(
                    "Please select whether you are a hosteller."
                );

                return;
            }

            /*
             * Validate phone
             */

            if (
                !/^[6-9]\d{9}$/.test(
                    phone
                )
            ) {
                setError(
                    "Please enter a valid 10-digit phone number."
                );

                return;
            }

            /*
             * Validate SID
             */

            if (
                !/^\d{8}$/.test(sid)
            ) {
                setError(
                    "SID must be exactly 8 digits."
                );

                return;
            }

            setSavingPersonalInfo(true);

            try {
                const result =
                    await updateApplicantPersonalInfo(
                        application.id,
                        name,
                        phone,
                        sid,
                        branch,
                        gender as
                            | "male"
                            | "female",
                        hosteller as
                            | "yes"
                            | "no"
                    );

                if (!result.success) {
                    setError(
                        result.reason ===
                            "not_found"
                            ? "Your application could not be found or can no longer be edited."
                            : "Could not update your personal information. Please try again."
                    );

                    return;
                }

                setApplication(
                    result.applicant
                );

                setForm(
                    (current) => ({
                        ...current,

                        name:
                            result.applicant
                                .name,

                        phone:
                            result.applicant
                                .phone ||
                            "",

                        sid:
                            result.applicant
                                .sid,

                        branch:
                            result.applicant
                                .branch ||
                            "",

                        gender:
                            result.applicant
                                .gender ||
                            "",

                        hosteller:
                            result.applicant
                                .hosteller ||
                            "",
                    })
                );
            } catch (updateError) {
                console.error(
                    "Error updating personal information:",
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
     * Loading state
     * ---------------------------------------------------------
     */

    if (checkingApplication) {
        return (
            <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">
                    Checking your application...
                </p>
            </div>
        );
    }

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
                                .charAt(0)
                                .toUpperCase() +
                                application.status.slice(
                                    1
                                )}
                        </span>
                    </div>

                    <div className="mt-6 space-y-6">
                        {/* Name + Phone */}
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
                                    htmlFor="existing-phone"
                                    className="text-sm font-medium"
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="existing-phone"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={
                                        10
                                    }
                                    value={
                                        form.phone
                                    }
                                    disabled={
                                        !canEdit
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "phone",
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

                        {/* SID + Branch */}
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

                            <div className="space-y-2">
                                <label
                                    htmlFor="existing-branch"
                                    className="text-sm font-medium"
                                >
                                    Branch
                                </label>

                                <select
                                    id="existing-branch"
                                    value={
                                        form.branch
                                    }
                                    disabled={
                                        !canEdit
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "branch",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">
                                        Select your branch
                                    </option>

                                    {branches.map(
                                        (
                                            branch
                                        ) => (
                                            <option
                                                key={
                                                    branch
                                                }
                                                value={
                                                    branch
                                                }
                                            >
                                                {
                                                    branch
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Gender + Hosteller */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="existing-gender"
                                    className="text-sm font-medium"
                                >
                                    Gender
                                </label>

                                <select
                                    id="existing-gender"
                                    value={
                                        form.gender
                                    }
                                    disabled={
                                        !canEdit
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "gender",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">
                                        Select your gender
                                    </option>

                                    <option value="male">
                                        Male
                                    </option>

                                    <option value="female">
                                        Female
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="existing-hosteller"
                                    className="text-sm font-medium"
                                >
                                    Are you a hosteller?
                                </label>

                                <select
                                    id="existing-hosteller"
                                    value={
                                        form.hosteller
                                    }
                                    disabled={
                                        !canEdit
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "hosteller",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">
                                        Select an option
                                    </option>

                                    <option value="yes">
                                        Yes
                                    </option>

                                    <option value="no">
                                        No
                                    </option>
                                </select>
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

                {/* Read-only answers */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">
                        Submitted Application
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Your submitted answers
                        cannot be changed.
                    </p>

                    <div className="mt-6 space-y-7">
                        {APPLICATION_QUESTIONS.map(
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
     * New application form
     * ---------------------------------------------------------
     */

    return (
        <form
            onSubmit={handleSubmit}
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
                    {/* Name + Phone */}
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
                                htmlFor="phone"
                                className="text-sm font-medium"
                            >
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                inputMode="numeric"
                                maxLength={
                                    10
                                }
                                value={
                                    form.phone
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "phone",
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="10-digit phone number"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                            />
                        </div>
                    </div>

                    {/* SID + Branch */}
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

                        <div className="space-y-2">
                            <label
                                htmlFor="branch"
                                className="text-sm font-medium"
                            >
                                Branch
                            </label>

                            <select
                                id="branch"
                                value={
                                    form.branch
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "branch",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                            >
                                <option value="">
                                    Select your branch
                                </option>

                                {branches.map(
                                    (
                                        branch
                                    ) => (
                                        <option
                                            key={
                                                branch
                                            }
                                            value={
                                                branch
                                            }
                                        >
                                            {
                                                branch
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Gender + Hosteller */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="gender"
                                className="text-sm font-medium"
                            >
                                Gender
                            </label>

                            <select
                                id="gender"
                                value={
                                    form.gender
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "gender",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                            >
                                <option value="">
                                    Select your gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="hosteller"
                                className="text-sm font-medium"
                            >
                                Are you a hosteller?
                            </label>

                            <select
                                id="hosteller"
                                value={
                                    form.hosteller
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "hosteller",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                            >
                                <option value="">
                                    Select an option
                                </option>

                                <option value="yes">
                                    Yes
                                </option>

                                <option value="no">
                                    No
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Application Questions
                </h2>

                <div className="mt-6 space-y-7">
                    {APPLICATION_QUESTIONS.map(
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
                onChange={(event) =>
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
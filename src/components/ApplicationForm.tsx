import { useState } from "react";
import { createApplicant } from "@/lib/supabase/actions/applicants.actions";

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

const initialForm = {
    name: "",
    sid: "",
    branch: "",
    responses: APPLICATION_QUESTIONS.reduce((acc, q) => {
        acc[q.id] = "";
        return acc;
    }, {} as Record<string, string>),
};

export default function ApplicationForm() {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const updateField = (
        field: keyof typeof initialForm,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const updateResponse = (questionId: string, value: string) => {
        setForm((current) => ({
            ...current,
            responses: {
                ...current.responses,
                [questionId]: value,
            },
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess(false);

        const name = form.name.trim();
        const sid = form.sid.trim();
        const branch = form.branch;
        
        // Ensure all required fields and questions are filled
        if (!name || !sid || !branch) {
            setError("Please fill in all the required personal fields.");
            return;
        }

        const missingResponses = APPLICATION_QUESTIONS.some(
            (q) => !form.responses[q.id].trim()
        );

        if (missingResponses) {
            setError("Please answer all the application questions.");
            return;
        }

        if (!/^\d{8}$/.test(sid)) {
            setError("SID must be exactly 8 digits.");
            return;
        }

        setSubmitting(true);

        try {
            // Trim responses
            const trimmedResponses = Object.keys(form.responses).reduce((acc, key) => {
                acc[key] = form.responses[key].trim();
                return acc;
            }, {} as Record<string, string>);

            const result = await createApplicant(
                name,
                sid,
                branch,
                trimmedResponses
            );

            if (!result.success) {
                if (result.reason === "duplicate") {
                    setError(
                        "An application with this SID has already been submitted."
                    );
                } else {
                    setError(
                        "We could not submit your application. Please try again."
                    );
                }

                return;
            }

            setSuccess(true);
            setForm(initialForm);
        } catch (error) {
            console.error("Unexpected application submission error:", error);

            setError(
                "We could not submit your application. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                </div>

                <h2 className="text-2xl font-semibold">
                    Application Submitted
                </h2>

                <p className="mt-3 text-muted-foreground">
                    Your application has been successfully submitted
                    to the Robotics Society.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                    Please wait for further communication regarding
                    the selection process.
                </p>
            </div>
        );
    }

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
                    {/* Name */}
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
                            value={form.name}
                            onChange={(e) =>
                                updateField("name", e.target.value)
                            }
                            placeholder="Enter your full name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
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
                                maxLength={8}
                                value={form.sid}
                                onChange={(e) =>
                                    updateField(
                                        "sid",
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                placeholder="8-digit SID"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
                                value={form.branch}
                                onChange={(e) =>
                                    updateField("branch", e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="">
                                    Select your branch
                                </option>

                                {branches.map((branch) => (
                                    <option
                                        key={branch}
                                        value={branch}
                                    >
                                        {branch}
                                    </option>
                                ))}
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
                    {APPLICATION_QUESTIONS.map((q) => (
                        <Question
                            key={q.id}
                            number={q.id}
                            question={q.text}
                            value={form.responses[q.id]}
                            onChange={(value) => updateResponse(q.id, value)}
                        />
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
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
    onChange: (value: string) => void;
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
                onChange={(e) => onChange(e.target.value)}
                rows={5}
                placeholder="Write your answer here..."
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
        </div>
    );
}
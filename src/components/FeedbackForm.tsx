import { useState } from "react";

const branches = [
    "Aerospace Engineering",
    "Bachelor of Design (B.Des)",
    "Civil Engineering",
    "Computer Science & Engineering",
    "Computer Science & Engineering (AI)",
    "Computer Science & Engineering (DS)",
    "Electrical Engineering",
    "Electronics & Communication Engineering",
    "Electronics Engineering (VLSI)",
    "Materials and Metallurgical Engineering",
    "Mathematics and Computing",
    "Mechanical Engineering",
    "Production & Industrial Engineering",
];

export interface FeedbackData {
    name: string;
    sid: string;
    email: string;
    branch: string;
    rating: number;
    review: string;
}

interface FeedbackFormProps {
    onContinue?: (data: FeedbackData) => void;
}

export default function FeedbackForm({
    onContinue,
}: FeedbackFormProps) {
    const [name, setName] = useState("");
    const [sid, setSid] = useState("");
    const [email, setEmail] = useState("");
    const [branch, setBranch] = useState("");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        const trimmedName = name.trim();
        const trimmedSid = sid.trim();
        const trimmedEmail = email.trim();
        const trimmedReview = review.trim();

        if (
            !trimmedName ||
            !trimmedSid ||
            !trimmedEmail ||
            !branch ||
            rating === 0
        ) {
            setError(
                "Please fill in all the required fields."
            );
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!/^\d{8}$/.test(trimmedSid)) {
            setError(
                "SID must be exactly 8 digits."
            );
            return;
        }

        const feedbackData: FeedbackData = {
            name: trimmedName,
            sid: trimmedSid,
            email: trimmedEmail,
            branch,
            rating,
            review: trimmedReview,
        };

        /*
         * For now, simply pass the form data forward.
         *
         * Later this can be connected to the Dino game/session
         * without changing the form validation itself.
         */
        try {
            localStorage.setItem("dinoFeedbackData", JSON.stringify(feedbackData));
        } catch(e) {}

        if (onContinue) {
            onContinue(feedbackData);
        } else {
            console.log(
                "Feedback submitted:",
                feedbackData
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl space-y-6"
        >
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Feedback Form
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    A tiny surprise awaits 👀
                </p>
            </div>

            {/* Personal Information */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="space-y-6">
                    {/* Name + SID */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="feedback-name"
                                className="text-sm font-medium"
                            >
                                Name
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="feedback-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your full name"
                                autoComplete="name"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="feedback-email"
                                className="text-sm font-medium"
                            >
                                Email
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="feedback-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="feedback-sid"
                                className="text-sm font-medium"
                            >
                                SID
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="feedback-sid"
                                type="text"
                                inputMode="numeric"
                                maxLength={8}
                                value={sid}
                                onChange={(event) =>
                                    setSid(
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="e.g. 23103000"
                                autoComplete="off"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Branch */}
                    <div className="space-y-2">
                        <label
                            htmlFor="feedback-branch"
                            className="text-sm font-medium"
                        >
                            Branch
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <select
                            id="feedback-branch"
                            value={branch}
                            onChange={(event) =>
                                setBranch(
                                    event.target.value
                                )
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">
                                Select your branch
                            </option>

                            {branches.map(
                                (branchName) => (
                                    <option
                                        key={branchName}
                                        value={branchName}
                                    >
                                        {branchName}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Rating */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">
                            How would you rate the orientation?
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Your feedback helps us make the next
                            orientation even better.
                        </p>
                    </div>

                    <div
                        className="flex items-center gap-2"
                        role="radiogroup"
                        aria-label="Orientation rating"
                    >
                        {[1, 2, 3, 4, 5].map(
                            (value) => (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={
                                        rating === value
                                    }
                                    aria-label={`${value} out of 5`}
                                    onClick={() =>
                                        setRating(value)
                                    }
                                    className={`text-4xl leading-none transition-transform hover:scale-110 focus:outline-none ${
                                        value <= rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                >
                                    ★
                                </button>
                            )
                        )}

                        {rating > 0 && (
                            <span className="ml-3 text-sm text-muted-foreground">
                                {rating}/5
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Review */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="space-y-2">
                    <label
                        htmlFor="feedback-review"
                        className="text-sm font-medium"
                    >
                        Tell us what you thought
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            Optional
                        </span>
                    </label>

                    <textarea
                        id="feedback-review"
                        value={review}
                        onChange={(event) =>
                            setReview(
                                event.target.value
                            )
                        }
                        rows={5}
                        maxLength={1000}
                        placeholder="What did you like? What could we improve?"
                        className="flex min-h-[120px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                    />

                    <div className="text-right text-xs text-muted-foreground">
                        {review.length}/1000
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            {/* Continue */}
            <button
                type="submit"
                className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
                Continue →
            </button>
        </form>
    );
}
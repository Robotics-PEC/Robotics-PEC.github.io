/**
 * Shared constants used across multiple forms.
 * Extracted to eliminate duplication across ApplicationForm,
 * InterviwerForm, FeedbackForm, etc.
 */

export const BRANCHES = [
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Aerospace Engineering",
    "Production Engineering",
    "Metallurgical and Materials Engineering",
    "Information Technology",
] as const;

export type Branch = typeof BRANCHES[number];

export const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
] as const;

export const HOSTELLER_OPTIONS = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
] as const;

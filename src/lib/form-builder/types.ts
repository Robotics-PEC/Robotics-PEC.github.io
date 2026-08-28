import { z } from "zod";
import type { ReactNode } from "react";

/* ================================================================
 * Enums — string enums used as object keys throughout configs.
 * Each enum is named after the concept it describes, never with
 * a generic "Enum" suffix.
 * ================================================================ */

/** Top-level keys of a `FormConfig` object. */
export enum FormConfigKey {
    SECTIONS = "sections",
    SUBMIT = "submit",
    DEFAULT_VALUES = "defaultValues",
    CLASS_NAME = "className",
}

/** Keys that describe a single section inside a form. */
export enum SectionKey {
    TITLE = "title",
    DESCRIPTION = "description",
    COLUMNS = "columns",
    FIELDS = "fields",
    CLASS_NAME = "className",
}

/** Keys that describe a single field definition. */
export enum FieldConfigKey {
    NAME = "name",
    LABEL = "label",
    TYPE = "type",
    REQUIRED = "required",
    PLACEHOLDER = "placeholder",
    DESCRIPTION = "description",
    OPTIONS = "options",
    VALIDATION = "validation",
    INPUT_MODE = "inputMode",
    MAX_LENGTH = "maxLength",
    ROWS = "rows",
    MAX_COUNT = "maxCount",
    DISABLED = "disabled",
    CLASS_NAME = "className",
    ICON = "icon",
    TRANSFORM = "transform",
    HIDDEN = "hidden",
    COLUMNS = "columns",
    AUTO_COMPLETE = "autoComplete",
}

/** Discriminant values for `FieldConfig.type`. */
export enum FieldType {
    TEXT = "text",
    EMAIL = "email",
    TEL = "tel",
    PASSWORD = "password",
    URL = "url",
    SELECT = "select",
    TEXTAREA = "textarea",
    CHECKBOX_GROUP = "checkbox-group",
    RADIO_GROUP = "radio-group",
    RATING = "rating",
    // Admin-specific field types
    MARKDOWN = "markdown",
    IMAGE = "image",
    DATE = "date",
    CATEGORY = "category",
}

/** Keys of the per-field validation object. */
export enum ValidationKey {
    PATTERN = "pattern",
    MESSAGE = "message",
    MIN_LENGTH = "minLength",
    MAX_LENGTH = "maxLength",
    CUSTOM = "custom",
}

/** Keys of the submit-button configuration. */
export enum SubmitConfigKey {
    LABEL = "label",
    LOADING_LABEL = "loadingLabel",
    CLASS_NAME = "className",
}

/** Input-mode values forwarded to the HTML `inputMode` attribute. */
export enum InputMode {
    NONE = "none",
    TEXT = "text",
    DECIMAL = "decimal",
    NUMERIC = "numeric",
    TEL = "tel",
    SEARCH = "search",
    EMAIL = "email",
    URL = "url",
}

/* ================================================================
 * Value types
 * ================================================================ */

/** A single option for select / radio / checkbox-group fields. */
export type FieldOption = {
    readonly [SubmitConfigKey.LABEL]: string;
    readonly value: string;
};

/** Per-field validation rules. */
export type FieldValidation = {
    readonly [ValidationKey.PATTERN]?: RegExp;
    readonly [ValidationKey.MESSAGE]?: string;
    readonly [ValidationKey.MIN_LENGTH]?: number;
    readonly [ValidationKey.MAX_LENGTH]?: number;
    /**
     * A Zod refinement applied after the built-in checks.
     * Return `true` when the value is valid.
     */
    readonly [ValidationKey.CUSTOM]?: (value: unknown) => boolean;
};

/**
 * Transform applied to input values before they reach the form
 * state (e.g. stripping non-digits from a phone field).
 */
export type FieldTransform = (raw: string) => string;

/* ================================================================
 * Field configs — one type per FieldType for total type safety
 * ================================================================ */

/** Properties shared by every field type. */
interface BaseFieldConfig {
    readonly [FieldConfigKey.NAME]: string;
    readonly [FieldConfigKey.LABEL]: string;
    readonly [FieldConfigKey.REQUIRED]?: boolean;
    readonly [FieldConfigKey.DESCRIPTION]?: string;
    readonly [FieldConfigKey.DISABLED]?: boolean;
    readonly [FieldConfigKey.CLASS_NAME]?: string;
    readonly [FieldConfigKey.HIDDEN]?: boolean;
    readonly [FieldConfigKey.COLUMNS]?: number;
}

export interface TextFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.TEXT;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    readonly [FieldConfigKey.VALIDATION]?: FieldValidation;
    readonly [FieldConfigKey.INPUT_MODE]?: InputMode;
    readonly [FieldConfigKey.MAX_LENGTH]?: number;
    readonly [FieldConfigKey.ICON]?: ReactNode;
    readonly [FieldConfigKey.TRANSFORM]?: FieldTransform;
    readonly [FieldConfigKey.AUTO_COMPLETE]?: string;
}

export interface EmailFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.EMAIL;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    readonly [FieldConfigKey.VALIDATION]?: FieldValidation;
    readonly [FieldConfigKey.ICON]?: ReactNode;
    readonly [FieldConfigKey.AUTO_COMPLETE]?: string;
}

export interface TelFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.TEL;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    readonly [FieldConfigKey.VALIDATION]?: FieldValidation;
    readonly [FieldConfigKey.MAX_LENGTH]?: number;
    readonly [FieldConfigKey.ICON]?: ReactNode;
    readonly [FieldConfigKey.AUTO_COMPLETE]?: string;
}

export interface PasswordFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.PASSWORD;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    readonly [FieldConfigKey.VALIDATION]?: FieldValidation;
    readonly [FieldConfigKey.ICON]?: ReactNode;
}

export interface UrlFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.URL;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    readonly [FieldConfigKey.VALIDATION]?: FieldValidation;
    readonly [FieldConfigKey.ICON]?: ReactNode;
}

export interface SelectFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.SELECT;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    readonly [FieldConfigKey.OPTIONS]: readonly (string | FieldOption)[];
}

export interface TextareaFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.TEXTAREA;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    readonly [FieldConfigKey.VALIDATION]?: FieldValidation;
    readonly [FieldConfigKey.ROWS]?: number;
    readonly [FieldConfigKey.MAX_LENGTH]?: number;
}

export interface CheckboxGroupFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.CHECKBOX_GROUP;
    readonly [FieldConfigKey.OPTIONS]: readonly (string | FieldOption)[];
    readonly [FieldConfigKey.MAX_COUNT]?: number;
}

export interface RadioGroupFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.RADIO_GROUP;
    readonly [FieldConfigKey.OPTIONS]: readonly (string | FieldOption)[];
}

export interface RatingFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.RATING;
    readonly [FieldConfigKey.MAX_COUNT]?: number; // default 5
}

export interface MarkdownFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.MARKDOWN;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
    /** Whether to hide the image upload option in the markdown editor */
    readonly dontWantImage?: boolean;
}

export interface ImageFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.IMAGE;
    /** Callback to store the filename separately if needed */
    readonly onFileNameChange?: (fileName: string) => void;
}

export interface DateFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.DATE;
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
}

export interface CategoryFieldConfig extends BaseFieldConfig {
    readonly [FieldConfigKey.TYPE]: FieldType.CATEGORY;
    readonly [FieldConfigKey.OPTIONS]: readonly (string | FieldOption)[];
    readonly [FieldConfigKey.PLACEHOLDER]?: string;
}

/** Discriminated union of every field configuration. */
export type FieldConfig =
    | TextFieldConfig
    | EmailFieldConfig
    | TelFieldConfig
    | PasswordFieldConfig
    | UrlFieldConfig
    | SelectFieldConfig
    | TextareaFieldConfig
    | CheckboxGroupFieldConfig
    | RadioGroupFieldConfig
    | RatingFieldConfig
    | MarkdownFieldConfig
    | ImageFieldConfig
    | DateFieldConfig
    | CategoryFieldConfig;

/* ================================================================
 * Section & form-level config
 * ================================================================ */

export interface SectionConfig {
    readonly [SectionKey.TITLE]?: string;
    readonly [SectionKey.DESCRIPTION]?: string;
    readonly [SectionKey.COLUMNS]?: number;
    readonly [SectionKey.FIELDS]: readonly FieldConfig[];
    readonly [SectionKey.CLASS_NAME]?: string;
}

export interface SubmitConfig {
    readonly [SubmitConfigKey.LABEL]: string;
    readonly [SubmitConfigKey.LOADING_LABEL]?: string;
    readonly [SubmitConfigKey.CLASS_NAME]?: string;
}

export interface FormConfig {
    readonly [FormConfigKey.SECTIONS]: readonly SectionConfig[];
    readonly [FormConfigKey.SUBMIT]: SubmitConfig;
    readonly [FormConfigKey.DEFAULT_VALUES]?: Record<string, unknown>;
    readonly [FormConfigKey.CLASS_NAME]?: string;
}

/* ================================================================
 * Helper: infer the Zod output type from a FormConfig at the
 * type level. Consumers can use `InferFormValues<typeof myConfig>`
 * instead of writing a parallel interface.
 * ================================================================ */

/**
 * Extracts all field names from a config as a string union.
 * Usage: `type Fields = ExtractFieldNames<typeof config>;`
 */
export type ExtractFieldNames<C extends FormConfig> =
    C[FormConfigKey.SECTIONS][number][SectionKey.FIELDS][number][FieldConfigKey.NAME];

/**
 * Convenience: resolves to `z.infer<ReturnType<buildFormSchema>>` but
 * is declared here so you can reference it without importing zod in
 * every consumer module.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferFormValues<C extends FormConfig> = Record<
    ExtractFieldNames<C>,
    unknown
>;

/* ================================================================
 * Props for the DynamicForm component
 * ================================================================ */

export interface DynamicFormProps<TValues extends Record<string, unknown> = Record<string, unknown>> {
    readonly config: FormConfig;
    readonly onSubmit: (values: TValues) => void | Promise<void>;
    readonly disabled?: boolean;
    /** Override default values from config. */
    readonly defaultValues?: Partial<TValues>;
    readonly className?: string;
    /** Allows injecting extra content before the submit button. */
    readonly footer?: ReactNode;
}

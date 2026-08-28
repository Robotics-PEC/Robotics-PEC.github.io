/**
 * Form Builder — a config-driven form system for Robotics PEC website.
 *
 * Eliminates the need to copy-paste form boilerplate by providing a
 * reusable DynamicForm component that generates forms from config objects.
 *
 * Features:
 * - Typesafe config with string enums for all object keys
 * - Automatic Zod schema generation from config
 * - Built on react-hook-form + shadcn/ui primitives
 * - Discriminated union field types for complete type safety
 * - Support for text, email, tel, password, url, select, textarea,
 *   checkbox-group, radio-group, and rating fields
 *
 * Usage:
 * ```tsx
 * import { DynamicForm, FormConfigKey, SectionKey, FieldConfigKey, FieldType } from "@/lib/form-builder";
 *
 * const config = {
 *   [FormConfigKey.SECTIONS]: [
 *     {
 *       [SectionKey.TITLE]: "Personal Information",
 *       [SectionKey.FIELDS]: [
 *         {
 *           [FieldConfigKey.NAME]: "name",
 *           [FieldConfigKey.LABEL]: "Full Name",
 *           [FieldConfigKey.TYPE]: FieldType.TEXT,
 *           [FieldConfigKey.REQUIRED]: true,
 *         },
 *       ],
 *     },
 *   ],
 *   [FormConfigKey.SUBMIT]: {
 *     [SubmitConfigKey.LABEL]: "Submit",
 *   },
 * };
 *
 * <DynamicForm
 *   config={config}
 *   onSubmit={async (values) => {
 *     await saveToDatabase(values);
 *   }}
 * />
 * ```
 */

// Core component
export { DynamicForm } from "./DynamicForm";

// Schema builder (for advanced use cases)
export { buildFormSchema } from "./schema";

// Field renderer (for custom form layouts)
export { FieldRenderer } from "./fields";

// Type exports
export type {
    FormConfig,
    SectionConfig,
    SubmitConfig,
    FieldConfig,
    TextFieldConfig,
    EmailFieldConfig,
    TelFieldConfig,
    PasswordFieldConfig,
    UrlFieldConfig,
    SelectFieldConfig,
    TextareaFieldConfig,
    CheckboxGroupFieldConfig,
    RadioGroupFieldConfig,
    RatingFieldConfig,
    MarkdownFieldConfig,
    ImageFieldConfig,
    DateFieldConfig,
    CategoryFieldConfig,
    FieldOption,
    FieldValidation,
    FieldTransform,
    DynamicFormProps,
    InferFormValues,
    ExtractFieldNames,
} from "./types";

// Enum exports
export {
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    ValidationKey,
    SubmitConfigKey,
    InputMode,
} from "./types";

// Shared constants
export { BRANCHES, GENDER_OPTIONS, HOSTELLER_OPTIONS } from "./constants";
export type { Branch } from "./constants";

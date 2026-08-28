import { z } from "zod";
import {
    FormConfig,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    ValidationKey,
    type FieldConfig,
    type FieldValidation,
} from "./types";

/**
 * Builds a Zod schema from a FormConfig at runtime.
 * Iterates over all sections and fields, creating the appropriate
 * Zod validator for each field type, with required/validation rules applied.
 */
export function buildFormSchema<C extends FormConfig>(
    config: C
): z.ZodObject<any> {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const section of config[FormConfigKey.SECTIONS]) {
        for (const field of section[SectionKey.FIELDS]) {
            const fieldName = field[FieldConfigKey.NAME];
            const isRequired = field[FieldConfigKey.REQUIRED] ?? false;

            shape[fieldName] = buildFieldSchema(field, isRequired);
        }
    }

    return z.object(shape);
}

/**
 * Builds the Zod schema for a single field based on its type.
 */
function buildFieldSchema(
    field: FieldConfig,
    isRequired: boolean
): z.ZodTypeAny {
    const fieldType = field[FieldConfigKey.TYPE];

    switch (fieldType) {
        case FieldType.TEXT:
        case FieldType.EMAIL:
        case FieldType.TEL:
        case FieldType.PASSWORD:
        case FieldType.URL:
            return buildStringSchema(
                fieldType,
                isRequired,
                "validation" in field ? field[FieldConfigKey.VALIDATION] : undefined
            );

        case FieldType.SELECT:
        case FieldType.RADIO_GROUP:
        case FieldType.CATEGORY:
            return buildStringSchema(fieldType, isRequired, undefined);

        case FieldType.TEXTAREA:
        case FieldType.MARKDOWN:
            return buildTextareaSchema(
                isRequired,
                "validation" in field ? field[FieldConfigKey.VALIDATION] : undefined,
                "maxLength" in field ? field[FieldConfigKey.MAX_LENGTH] : undefined
            );

        case FieldType.CHECKBOX_GROUP:
            return buildCheckboxGroupSchema(isRequired);

        case FieldType.RATING:
            return buildRatingSchema(isRequired);

        case FieldType.IMAGE:
            // Image fields store base64 strings
            return isRequired
                ? z.string().min(1, "Image is required")
                : z.string().optional();

        case FieldType.DATE:
            // Date fields store Date objects
            return isRequired
                ? z.date({ required_error: "Date is required" })
                : z.date().optional();

        default:
            // Exhaustiveness check — TypeScript will error if a FieldType is unhandled
            const _exhaustive: never = fieldType;
            throw new Error(`Unhandled field type: ${_exhaustive}`);
    }
}

/**
 * String-based fields: text, email, tel, password, url, select, radio-group
 */
function buildStringSchema(
    fieldType: FieldType,
    isRequired: boolean,
    validation?: FieldValidation
): z.ZodTypeAny {
    let schema = z.string();

    // Apply built-in type validation
    if (fieldType === FieldType.EMAIL) {
        schema = schema.email("Invalid email address");
    } else if (fieldType === FieldType.URL) {
        schema = schema.url("Invalid URL");
    }

    // Apply required constraint first (before refine which returns ZodEffects)
    if (isRequired) {
        schema = schema.min(1, "This field is required");
    }

    // Apply custom validation rules
    if (validation) {
        if (validation[ValidationKey.MIN_LENGTH]) {
            schema = schema.min(
                validation[ValidationKey.MIN_LENGTH],
                validation[ValidationKey.MESSAGE] ?? `Minimum ${validation[ValidationKey.MIN_LENGTH]} characters`
            );
        }

        if (validation[ValidationKey.MAX_LENGTH]) {
            schema = schema.max(
                validation[ValidationKey.MAX_LENGTH],
                validation[ValidationKey.MESSAGE] ?? `Maximum ${validation[ValidationKey.MAX_LENGTH]} characters`
            );
        }

        if (validation[ValidationKey.PATTERN]) {
            schema = schema.regex(
                validation[ValidationKey.PATTERN],
                validation[ValidationKey.MESSAGE] ?? "Invalid format"
            );
        }

        if (validation[ValidationKey.CUSTOM]) {
            const refined = schema.refine(
                validation[ValidationKey.CUSTOM],
                validation[ValidationKey.MESSAGE] ?? "Validation failed"
            );
            return isRequired ? refined : refined.optional();
        }
    }

    return isRequired ? schema : schema.optional();
}

/**
 * Textarea field with optional maxLength
 */
function buildTextareaSchema(
    isRequired: boolean,
    validation?: FieldValidation,
    maxLength?: number
): z.ZodTypeAny {
    let schema = z.string();

    // Apply required constraint first
    if (isRequired) {
        schema = schema.min(1, "This field is required");
    }

    if (maxLength) {
        schema = schema.max(maxLength, `Maximum ${maxLength} characters`);
    }

    if (validation) {
        if (validation[ValidationKey.MIN_LENGTH]) {
            schema = schema.min(
                validation[ValidationKey.MIN_LENGTH],
                validation[ValidationKey.MESSAGE] ?? `Minimum ${validation[ValidationKey.MIN_LENGTH]} characters`
            );
        }

        if (validation[ValidationKey.MAX_LENGTH]) {
            schema = schema.max(
                validation[ValidationKey.MAX_LENGTH],
                validation[ValidationKey.MESSAGE] ?? `Maximum ${validation[ValidationKey.MAX_LENGTH]} characters`
            );
        }

        if (validation[ValidationKey.PATTERN]) {
            schema = schema.regex(
                validation[ValidationKey.PATTERN],
                validation[ValidationKey.MESSAGE] ?? "Invalid format"
            );
        }

        if (validation[ValidationKey.CUSTOM]) {
            const refined = schema.refine(
                validation[ValidationKey.CUSTOM],
                validation[ValidationKey.MESSAGE] ?? "Validation failed"
            );
            return isRequired ? refined : refined.optional();
        }
    }

    return isRequired ? schema : schema.optional();
}

/**
 * Checkbox group field — array of strings
 */
function buildCheckboxGroupSchema(isRequired: boolean): z.ZodTypeAny {
    const schema = z.array(z.string());
    return isRequired
        ? schema.min(1, "Select at least one option")
        : schema.optional();
}

/**
 * Rating field — number (1-5 or 1-maxCount)
 */
function buildRatingSchema(isRequired: boolean): z.ZodTypeAny {
    const schema = z.number();
    return isRequired
        ? schema.min(1, "Rating is required")
        : schema.optional();
}

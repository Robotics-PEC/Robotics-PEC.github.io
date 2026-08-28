import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import MarkdownEditor from "@/pages/admin/components/MarkdownEditor";
import Blob from "@/components/Blob";
import DatePicker from "@/components/DatePicker";
import SelectSearch from "@/pages/admin/components/SelectSearch";
import {
    FieldConfig,
    FieldConfigKey,
    FieldType,
    type TextFieldConfig,
    type EmailFieldConfig,
    type TelFieldConfig,
    type PasswordFieldConfig,
    type UrlFieldConfig,
    type SelectFieldConfig,
    type TextareaFieldConfig,
    type CheckboxGroupFieldConfig,
    type RadioGroupFieldConfig,
    type RatingFieldConfig,
    type MarkdownFieldConfig,
    type ImageFieldConfig,
    type DateFieldConfig,
    type CategoryFieldConfig,
    type FieldOption,
    SubmitConfigKey,
} from "./types";

interface FieldRendererProps {
    field: FieldConfig;
    form: UseFormReturn<any>;
}

/**
 * Renders a single form field based on its config type.
 * Wraps react-hook-form's FormField with shadcn primitives.
 */
export function FieldRenderer({ field, form }: FieldRendererProps) {
    const fieldType = field[FieldConfigKey.TYPE];
    const fieldName = field[FieldConfigKey.NAME];
    const isHidden = field[FieldConfigKey.HIDDEN];

    if (isHidden) {
        return null;
    }

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => {
                switch (fieldType) {
                    case FieldType.TEXT:
                        return <TextFieldRenderer config={field} formField={formField} />;
                    case FieldType.EMAIL:
                        return <EmailFieldRenderer config={field} formField={formField} />;
                    case FieldType.TEL:
                        return <TelFieldRenderer config={field} formField={formField} />;
                    case FieldType.PASSWORD:
                        return <PasswordFieldRenderer config={field} formField={formField} />;
                    case FieldType.URL:
                        return <UrlFieldRenderer config={field} formField={formField} />;
                    case FieldType.SELECT:
                        return <SelectFieldRenderer config={field} formField={formField} />;
                    case FieldType.TEXTAREA:
                        return <TextareaFieldRenderer config={field} formField={formField} />;
                    case FieldType.CHECKBOX_GROUP:
                        return <CheckboxGroupFieldRenderer config={field} formField={formField} />;
                    case FieldType.RADIO_GROUP:
                        return <RadioGroupFieldRenderer config={field} formField={formField} />;
                    case FieldType.RATING:
                        return <RatingFieldRenderer config={field} formField={formField} />;
                    case FieldType.MARKDOWN:
                        return <MarkdownFieldRenderer config={field} formField={formField} />;
                    case FieldType.IMAGE:
                        return <ImageFieldRenderer config={field} formField={formField} />;
                    case FieldType.DATE:
                        return <DateFieldRenderer config={field} formField={formField} />;
                    case FieldType.CATEGORY:
                        return <CategoryFieldRenderer config={field} formField={formField} />;
                    default:
                        const _exhaustive: never = fieldType;
                        return <></>;
                }
            }}
        />
    );
}

/* ================================================================
 * Individual field renderers
 * ================================================================ */

function TextFieldRenderer({
    config,
    formField,
}: {
    config: TextFieldConfig;
    formField: any;
}) {
    const transform = config[FieldConfigKey.TRANSFORM];

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <div className="relative">
                    {config[FieldConfigKey.ICON] && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {config[FieldConfigKey.ICON]}
                        </div>
                    )}
                    <Input
                        {...formField}
                        type="text"
                        placeholder={config[FieldConfigKey.PLACEHOLDER]}
                        disabled={config[FieldConfigKey.DISABLED]}
                        maxLength={config[FieldConfigKey.MAX_LENGTH]}
                        inputMode={config[FieldConfigKey.INPUT_MODE]}
                        autoComplete={config[FieldConfigKey.AUTO_COMPLETE]}
                        className={cn(config[FieldConfigKey.ICON] && "pl-10")}
                        onChange={(e) => {
                            const value = transform
                                ? transform(e.target.value)
                                : e.target.value;
                            formField.onChange(value);
                        }}
                    />
                </div>
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function EmailFieldRenderer({
    config,
    formField,
}: {
    config: EmailFieldConfig;
    formField: any;
}) {
    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <div className="relative">
                    {config[FieldConfigKey.ICON] && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {config[FieldConfigKey.ICON]}
                        </div>
                    )}
                    <Input
                        {...formField}
                        type="email"
                        placeholder={config[FieldConfigKey.PLACEHOLDER]}
                        disabled={config[FieldConfigKey.DISABLED]}
                        autoComplete={config[FieldConfigKey.AUTO_COMPLETE]}
                        className={cn(config[FieldConfigKey.ICON] && "pl-10")}
                    />
                </div>
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function TelFieldRenderer({
    config,
    formField,
}: {
    config: TelFieldConfig;
    formField: any;
}) {
    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <div className="relative">
                    {config[FieldConfigKey.ICON] && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {config[FieldConfigKey.ICON]}
                        </div>
                    )}
                    <Input
                        {...formField}
                        type="tel"
                        placeholder={config[FieldConfigKey.PLACEHOLDER]}
                        disabled={config[FieldConfigKey.DISABLED]}
                        maxLength={config[FieldConfigKey.MAX_LENGTH]}
                        autoComplete={config[FieldConfigKey.AUTO_COMPLETE]}
                        className={cn(config[FieldConfigKey.ICON] && "pl-10")}
                    />
                </div>
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function PasswordFieldRenderer({
    config,
    formField,
}: {
    config: PasswordFieldConfig;
    formField: any;
}) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <div className="relative">
                    {config[FieldConfigKey.ICON] && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {config[FieldConfigKey.ICON]}
                        </div>
                    )}
                    <Input
                        {...formField}
                        type={showPassword ? "text" : "password"}
                        placeholder={config[FieldConfigKey.PLACEHOLDER]}
                        disabled={config[FieldConfigKey.DISABLED]}
                        className={cn(
                            config[FieldConfigKey.ICON] && "pl-10",
                            "pr-10"
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                </div>
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function UrlFieldRenderer({
    config,
    formField,
}: {
    config: UrlFieldConfig;
    formField: any;
}) {
    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <div className="relative">
                    {config[FieldConfigKey.ICON] && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {config[FieldConfigKey.ICON]}
                        </div>
                    )}
                    <Input
                        {...formField}
                        type="url"
                        placeholder={config[FieldConfigKey.PLACEHOLDER]}
                        disabled={config[FieldConfigKey.DISABLED]}
                        className={cn(config[FieldConfigKey.ICON] && "pl-10")}
                    />
                </div>
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function SelectFieldRenderer({
    config,
    formField,
}: {
    config: SelectFieldConfig;
    formField: any;
}) {
    const options = normalizeOptions(config[FieldConfigKey.OPTIONS]);

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <Select onValueChange={formField.onChange} value={formField.value}>
                <FormControl>
                    <SelectTrigger disabled={config[FieldConfigKey.DISABLED]}>
                        <SelectValue
                            placeholder={config[FieldConfigKey.PLACEHOLDER]}
                        />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt[SubmitConfigKey.LABEL]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function TextareaFieldRenderer({
    config,
    formField,
}: {
    config: TextareaFieldConfig;
    formField: any;
}) {
    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <Textarea
                    {...formField}
                    placeholder={config[FieldConfigKey.PLACEHOLDER]}
                    disabled={config[FieldConfigKey.DISABLED]}
                    rows={config[FieldConfigKey.ROWS]}
                    maxLength={config[FieldConfigKey.MAX_LENGTH]}
                />
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function CheckboxGroupFieldRenderer({
    config,
    formField,
}: {
    config: CheckboxGroupFieldConfig;
    formField: any;
}) {
    const options = normalizeOptions(config[FieldConfigKey.OPTIONS]);
    const value = (formField.value ?? []) as string[];

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <div className="mb-4">
                <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
                {config[FieldConfigKey.DESCRIPTION] && (
                    <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
                )}
            </div>
            <div className="space-y-2">
                {options.map((opt) => (
                    <FormItem
                        key={opt.value}
                        className="flex items-center space-x-3 space-y-0"
                    >
                        <FormControl>
                            <Checkbox
                                checked={value.includes(opt.value)}
                                onCheckedChange={(checked) => {
                                    const newValue = checked
                                        ? [...value, opt.value]
                                        : value.filter((v) => v !== opt.value);
                                    formField.onChange(newValue);
                                }}
                                disabled={config[FieldConfigKey.DISABLED]}
                            />
                        </FormControl>
                        <Label className="font-normal cursor-pointer">
                            {opt[SubmitConfigKey.LABEL]}
                        </Label>
                    </FormItem>
                ))}
            </div>
            <FormMessage />
        </FormItem>
    );
}

function RadioGroupFieldRenderer({
    config,
    formField,
}: {
    config: RadioGroupFieldConfig;
    formField: any;
}) {
    const options = normalizeOptions(config[FieldConfigKey.OPTIONS]);

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <div className="mb-4">
                <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
                {config[FieldConfigKey.DESCRIPTION] && (
                    <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
                )}
            </div>
            <FormControl>
                <RadioGroup
                    onValueChange={formField.onChange}
                    value={formField.value}
                    disabled={config[FieldConfigKey.DISABLED]}
                    className="space-y-2"
                >
                    {options.map((opt) => (
                        <FormItem
                            key={opt.value}
                            className="flex items-center space-x-3 space-y-0"
                        >
                            <FormControl>
                                <RadioGroupItem value={opt.value} />
                            </FormControl>
                            <Label className="font-normal cursor-pointer">
                                {opt[SubmitConfigKey.LABEL]}
                            </Label>
                        </FormItem>
                    ))}
                </RadioGroup>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}

function RatingFieldRenderer({
    config,
    formField,
}: {
    config: RatingFieldConfig;
    formField: any;
}) {
    const maxCount = config[FieldConfigKey.MAX_COUNT] ?? 5;
    const value = formField.value ?? 0;

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <div className="flex gap-2">
                    {Array.from({ length: maxCount }, (_, i) => i + 1).map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            onClick={() => formField.onChange(rating)}
                            disabled={config[FieldConfigKey.DISABLED]}
                            className={cn(
                                "w-10 h-10 rounded-full border-2 transition-colors",
                                value >= rating
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground/25 hover:border-primary/50",
                                config[FieldConfigKey.DISABLED] && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {rating}
                        </button>
                    ))}
                </div>
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

/* ================================================================
 * Helper utilities
 * ================================================================ */

/**
 * Admin field renderers
 */

function MarkdownFieldRenderer({
    config,
    formField,
}: {
    config: MarkdownFieldConfig;
    formField: any;
}) {
    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <MarkdownEditor
                    value={formField.value || ""}
                    onChange={formField.onChange}
                    placeholder={config[FieldConfigKey.PLACEHOLDER] || ""}
                    dontWantImage={config.dontWantImage}
                />
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function ImageFieldRenderer({
    config,
    formField,
}: {
    config: ImageFieldConfig;
    formField: any;
}) {
    const [fileName, setFileName] = React.useState("");

    React.useEffect(() => {
        if (fileName && config.onFileNameChange) {
            config.onFileNameChange(fileName);
        }
    }, [fileName, config]);

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <Blob
                    id={config[FieldConfigKey.NAME]}
                    onChange={(value: any) => {
                        // Handle the state update from Blob
                        if (typeof value === 'function') {
                            const prev = formField.value || "";
                            formField.onChange(value(prev));
                        } else {
                            formField.onChange(value);
                        }
                    }}
                    setFileName={setFileName}
                />
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function DateFieldRenderer({
    config,
    formField,
}: {
    config: DateFieldConfig;
    formField: any;
}) {
    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <DatePicker
                    date={formField.value}
                    setDate={formField.onChange}
                    placeholder={config[FieldConfigKey.PLACEHOLDER]}
                />
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

function CategoryFieldRenderer({
    config,
    formField,
}: {
    config: CategoryFieldConfig;
    formField: any;
}) {
    const options = normalizeOptions(config[FieldConfigKey.OPTIONS]);

    return (
        <FormItem className={config[FieldConfigKey.CLASS_NAME]}>
            <FormLabel>{config[FieldConfigKey.LABEL]}</FormLabel>
            <FormControl>
                <SelectSearch
                    options={options}
                    value={formField.value || ""}
                    onChange={formField.onChange}
                    placeholder={config[FieldConfigKey.PLACEHOLDER]}
                />
            </FormControl>
            {config[FieldConfigKey.DESCRIPTION] && (
                <FormDescription>{config[FieldConfigKey.DESCRIPTION]}</FormDescription>
            )}
            <FormMessage />
        </FormItem>
    );
}

/* ================================================================
 * Helper utilities
 * ================================================================ */

/**
 * Normalizes option arrays from `string[] | FieldOption[]` to `FieldOption[]`
 */
function normalizeOptions(
    options: readonly (string | FieldOption)[]
): FieldOption[] {
    return options.map((opt) =>
        typeof opt === "string"
            ? { [SubmitConfigKey.LABEL]: opt, value: opt }
            : opt
    );
}

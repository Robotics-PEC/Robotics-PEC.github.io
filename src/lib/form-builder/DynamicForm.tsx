"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    FormConfigKey,
    SectionKey,
    SubmitConfigKey,
    type DynamicFormProps,
} from "./types";
import { buildFormSchema } from "./schema";
import { FieldRenderer } from "./fields";

/**
 * DynamicForm — a config-driven form component.
 *
 * Takes a FormConfig and automatically generates:
 * - Zod schema with validation
 * - Form fields with shadcn primitives
 * - Submit handling with loading states
 *
 * Usage:
 * ```tsx
 * <DynamicForm
 *   config={myFormConfig}
 *   onSubmit={async (values) => {
 *     await saveToDatabase(values);
 *   }}
 * />
 * ```
 */
export function DynamicForm<TValues extends Record<string, unknown> = Record<string, unknown>>({
    config,
    onSubmit,
    disabled = false,
    defaultValues,
    className,
    footer,
}: DynamicFormProps<TValues>) {
    const schema = React.useMemo(() => buildFormSchema(config), [config]);

    const form = useForm<TValues>({
        resolver: zodResolver(schema),
        defaultValues: (defaultValues ?? config[FormConfigKey.DEFAULT_VALUES] ?? {}) as any,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (values: TValues) => {
        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitConfig = config[FormConfigKey.SUBMIT];
    const sections = config[FormConfigKey.SECTIONS];

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={cn("space-y-8", config[FormConfigKey.CLASS_NAME], className)}
            >
                {sections.map((section, sectionIdx) => {
                    const sectionTitle = section[SectionKey.TITLE];
                    const sectionDescription = section[SectionKey.DESCRIPTION];
                    const sectionFields = section[SectionKey.FIELDS];
                    const sectionColumns = section[SectionKey.COLUMNS] ?? 1;
                    const sectionClassName = section[SectionKey.CLASS_NAME];

                    return (
                        <div key={sectionIdx} className={cn("space-y-6", sectionClassName)}>
                            {(sectionTitle || sectionDescription) && (
                                <div className="space-y-2">
                                    {sectionTitle && (
                                        <h3 className="text-lg font-semibold">{sectionTitle}</h3>
                                    )}
                                    {sectionDescription && (
                                        <p className="text-sm text-muted-foreground">
                                            {sectionDescription}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div
                                className={cn(
                                    "grid gap-6",
                                    sectionColumns === 1 && "grid-cols-1",
                                    sectionColumns === 2 && "grid-cols-1 md:grid-cols-2",
                                    sectionColumns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                                    sectionColumns >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                                )}
                            >
                                {sectionFields.map((field, fieldIdx) => (
                                    <FieldRenderer
                                        key={field.name}
                                        field={field}
                                        form={form}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {footer}

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={disabled || isSubmitting}
                        className={submitConfig[SubmitConfigKey.CLASS_NAME]}
                    >
                        {isSubmitting
                            ? (submitConfig[SubmitConfigKey.LOADING_LABEL] ?? "Submitting...")
                            : submitConfig[SubmitConfigKey.LABEL]}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

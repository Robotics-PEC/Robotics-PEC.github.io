import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import {
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    SubmitConfigKey,
    FieldType,
    type FormConfig,
    type FieldConfig
} from "@/lib/form-builder";

interface Props {
    initialConfig?: FormConfig;
    onSave: (config: FormConfig) => void;
}

export const FormBuilder = ({ initialConfig, onSave }: Props) => {
    const [config, setConfig] = useState<FormConfig>(initialConfig || {
        [FormConfigKey.SECTIONS]: [{ [SectionKey.FIELDS]: [] }],
        [FormConfigKey.SUBMIT]: { [SubmitConfigKey.LABEL]: "Submit" },
    });

    const addField = (sectionIndex: number) => {
        const newConfig = { ...config };
        const sections = [...newConfig[FormConfigKey.SECTIONS]];
        const section = { ...sections[sectionIndex] };
        section[SectionKey.FIELDS] = [
            ...section[SectionKey.FIELDS],
            {
                [FieldConfigKey.NAME]: `field_${Date.now()}`,
                [FieldConfigKey.LABEL]: "New Field",
                [FieldConfigKey.TYPE]: FieldType.TEXT,
                [FieldConfigKey.REQUIRED]: false
            }
        ];
        sections[sectionIndex] = section;
        newConfig[FormConfigKey.SECTIONS] = sections;
        setConfig(newConfig);
    };

    const updateField = (sectionIndex: number, fieldIndex: number, field: FieldConfig) => {
        const newConfig = { ...config };
        const sections = [...newConfig[FormConfigKey.SECTIONS]];
        const section = { ...sections[sectionIndex] };
        const fields = [...section[SectionKey.FIELDS]];
        fields[fieldIndex] = field;
        section[SectionKey.FIELDS] = fields;
        sections[sectionIndex] = section;
        newConfig[FormConfigKey.SECTIONS] = sections;
        setConfig(newConfig);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Form Builder</h3>
            {config[FormConfigKey.SECTIONS].map((section, sIndex) => (
                <Card key={sIndex} className="p-4 space-y-2">
                    {section[SectionKey.FIELDS].map((field, fIndex) => (
                        <div key={fIndex} className="flex gap-2 items-center flex-wrap">
                            <Input
                                value={field[FieldConfigKey.LABEL]}
                                onChange={(e) => updateField(sIndex, fIndex, { ...field, [FieldConfigKey.LABEL]: e.target.value })}
                                placeholder="Label"
                                className="w-1/4"
                            />
                            <Select
                                value={field[FieldConfigKey.TYPE]}
                                onValueChange={(value: FieldType) => {
                                    const newField = {
                                        [FieldConfigKey.NAME]: field[FieldConfigKey.NAME],
                                        [FieldConfigKey.LABEL]: field[FieldConfigKey.LABEL],
                                        [FieldConfigKey.TYPE]: value,
                                        [FieldConfigKey.REQUIRED]: field[FieldConfigKey.REQUIRED],
                                    };
                                    updateField(sIndex, fIndex, newField as FieldConfig);
                                }}
                            >
                                <SelectTrigger className="w-1/4">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(FieldType).map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                                <Checkbox
                                    id={`required-${sIndex}-${fIndex}`}
                                    checked={!!field[FieldConfigKey.REQUIRED]}
                                    onCheckedChange={(checked) => updateField(sIndex, fIndex, { ...field, [FieldConfigKey.REQUIRED]: !!checked })}
                                />
                                <Label htmlFor={`required-${sIndex}-${fIndex}`}>Required</Label>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => {
                                const newConfig = { ...config };
                                const sections = [...newConfig[FormConfigKey.SECTIONS]];
                                const section = { ...sections[sIndex] };
                                const fields = [...section[SectionKey.FIELDS]];
                                fields.splice(fIndex, 1);
                                section[SectionKey.FIELDS] = fields;
                                sections[sIndex] = section;
                                newConfig[FormConfigKey.SECTIONS] = sections;
                                setConfig(newConfig);
                            }}>
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addField(sIndex)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Field
                    </Button>
                </Card>
            ))}
            <Button onClick={() => onSave(config)}>Save Form Config</Button>
        </div>
    );
};

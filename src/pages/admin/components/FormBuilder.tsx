import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import {
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
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
        [FormConfigKey.SECTIONS]: [{ [SectionKey.FIELDS]: [] }]
    });

    const addField = (sectionIndex: number) => {
        const newConfig = { ...config };
        newConfig[FormConfigKey.SECTIONS][sectionIndex][SectionKey.FIELDS].push({
            [FieldConfigKey.NAME]: `field_${Date.now()}`,
            [FieldConfigKey.LABEL]: "New Field",
            [FieldConfigKey.TYPE]: FieldType.TEXT,
            [FieldConfigKey.REQUIRED]: false
        });
        setConfig(newConfig);
    };

    const updateField = (sectionIndex: number, fieldIndex: number, field: FieldConfig) => {
        const newConfig = { ...config };
        newConfig[FormConfigKey.SECTIONS][sectionIndex][SectionKey.FIELDS][fieldIndex] = field;
        setConfig(newConfig);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Form Builder</h3>
            {config[FormConfigKey.SECTIONS].map((section, sIndex) => (
                <Card key={sIndex} className="p-4 space-y-2">
                    {section[SectionKey.FIELDS].map((field, fIndex) => (
                        <div key={fIndex} className="flex gap-2 items-center">
                            <Input
                                value={field[FieldConfigKey.LABEL]}
                                onChange={(e) => updateField(sIndex, fIndex, { ...field, [FieldConfigKey.LABEL]: e.target.value })}
                                placeholder="Label"
                                className="w-1/3"
                            />
                            <Select
                                value={field[FieldConfigKey.TYPE]}
                                onValueChange={(value: FieldType) => updateField(sIndex, fIndex, { ...field, [FieldConfigKey.TYPE]: value })}
                            >
                                <SelectTrigger className="w-1/3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(FieldType).map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={() => {
                                const newConfig = { ...config };
                                newConfig[FormConfigKey.SECTIONS][sIndex][SectionKey.FIELDS].splice(fIndex, 1);
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

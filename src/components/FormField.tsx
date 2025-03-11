import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { FormFieldProps } from '@/types'
import MarkdownEditor from './admin/MarkdownEditor'
import Blob from './Blob'

const FormField = ({ htmlFor, title, id, onChange, placeholder, value, type, setFileName }: FormFieldProps) => {

    switch (type) {
        case "TEXT":
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>{title}</Label>
                    <Input
                        id={id}
                        value={value}
                        onChange={(e) => onChange((prev: any) => ({ ...prev, [id]: e.target.value }))}
                        placeholder={placeholder}
                    />
                </div>
            )
        case "IMAGE":
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>Upload Image</Label>
                    <Blob id={id}
                        onChange={onChange}
                        setFileName={setFileName!}
                    />
                </div>
            )
        case "MARKDOWN":
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>Detailed Description (Markdown)</Label>
                    <MarkdownEditor
                        value={value}
                        onChange={(value) => onChange((prev: any) => ({ ...prev, [id]: value }))}
                        placeholder={placeholder}
                        minHeight="200px"
                    />
                </div>
            )
        default:
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>{title}</Label>
                    <Input
                        id={id}
                        value={value}
                        onChange={(e) => onChange((prev: any) => ({ ...prev, image: e.target.value }))}
                        placeholder={placeholder}
                    />
                </div>
            )

    }
}

export default FormField
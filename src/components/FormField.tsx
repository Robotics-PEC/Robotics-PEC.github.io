import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { FormFieldProps } from '@/types'
import MarkdownEditor from '../pages/admin/components/MarkdownEditor'
import Blob from './Blob'
import DatePicker from './DatePicker'
import SelectSearch from '@/pages/admin/components/SelectSearch'
import { teamCategoryOptions } from '@/lib/utils'

const FormField = ({ htmlFor, title, id, onChange, placeholder, value, type, setFileName, date, setDate }: FormFieldProps) => {

    switch (type) {
        case "TEXT":
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>{title}</Label>
                    <Input
                        id={id}
                        value={value as string}
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
                        setFileName={setFileName}
                    />
                </div>
            )
        case "MARKDOWN":
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>{title}</Label>
                    <MarkdownEditor
                        value={value as string}
                        onChange={(value) => onChange((prev: any) => ({ ...prev, [id]: value }))}
                        placeholder={placeholder}
                    />
                </div>
            )
        case "DATE":
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>{title}</Label>
                    <DatePicker
                        date={date}
                        setDate={setDate!}
                    />
                </div>

            )
        case "CATEGORY":

            return (
                <div>
                    <Label htmlFor={htmlFor}>{title}</Label>
                    <SelectSearch
                        options={teamCategoryOptions}
                        value={value as string}
                        onChange={(e) => onChange((prev: any) => ({ ...prev, [id]: e }))}
                    />
                </div>
            )
        default:
            return (
                <div className="space-y-2">
                    <Label htmlFor={htmlFor}>{title}</Label>
                    <Input
                        id={id}
                        value={value as string}
                        onChange={(e) => onChange((prev: any) => ({ ...prev, [id]: e.target.value }))}
                        placeholder={placeholder}
                    />
                </div>
            )
    }
}

export default FormField
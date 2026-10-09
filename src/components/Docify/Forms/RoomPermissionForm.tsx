"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export const RoomPermissionForm = ({
    onFormDataChange,
}: {
    onFormDataChange: (formData: any) => void;
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        society: "",
        eventName: "",
        fromDate: "",
        toDate: "",
        fromTime: "",
        toTime: "",
        roomNumber: "",
        department: "",
        eventDescription: "",
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        onFormDataChange(updatedData);

        sessionStorage.setItem("formData", JSON.stringify(updatedData));
        sessionStorage.setItem("type", "RoomPermission");
    };

    const formFields = [
        { label: "Name of Society", name: "society", type: "text" },
        { label: "Event Name", name: "eventName", type: "text" },
        { label: "From Date", name: "fromDate", type: "date" },
        { label: "To Date", name: "toDate", type: "date" },
        { label: "From Time", name: "fromTime", type: "time" },
        { label: "To Time", name: "toTime", type: "time" },
        { label: "Room Number", name: "roomNumber", type: "text" },
        { label: "Department", name: "department", type: "text" },
        {
            label: "Brief Event Description",
            name: "eventDescription",
            type: "textarea",
        },
        {
            label: "Expected participation & Audience:",
            name: "audience",
            type: "textarea",
        },
    ];

    useEffect(() => {
        const type = sessionStorage.getItem("type");
        if (type && type === "RoomPermission") {
            const form = sessionStorage.getItem("formData");

            if (form) {
                const parsed = JSON.parse(form);

                setFormData(parsed);
                onFormDataChange(parsed);
            }
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field, index) => (
                    <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`space-y-2 ${
                            field.type === "textarea" ? "md:col-span-2" : ""
                        }`}
                    >
                        <Label
                            htmlFor={field.name}
                            className="text-sm font-medium text-gray-700"
                        >
                            {field.label}
                        </Label>
                        {field.type === "textarea" ? (
                            <Textarea
                                id={field.name}
                                name={field.name}
                                rows={4}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="w-full resize-none "
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                            />
                        ) : (
                            <Input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                className="w-full "
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

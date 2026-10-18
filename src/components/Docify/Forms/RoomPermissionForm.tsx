"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const RoomPermissionForm = ({
    onFormDataChange,
}: {
    onFormDataChange: (formData: any) => void;
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        society: "",
        eventName: "",
        date: "",
        time: "",
        roomNumber: "",
        department: "",
        eventDescription: "",
        audience: "",
    });

    const handleChange = (name: string, value: any) => {
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        onFormDataChange(updatedData);

        sessionStorage.setItem("formData", JSON.stringify(updatedData));
        sessionStorage.setItem("type", "RoomPermission");
    };

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
        <div className="w-full font-serif text-black">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-lg font-bold tracking-wide">
                    PUNJAB ENGINEERING COLLEGE
                </h2>
                <h3 className="text-sm font-semibold tracking-wide">
                    (Deemed to be University)
                </h3>
                <h3 className="text-sm font-bold mt-3 underline">
                    PERFORMA FOR BOOKING OF LECTURE ROOMS BY
                    CLUBS/SOCIETY/NSS/SPORTS & DEPARTMENTS
                </h3>
                <div className="text-left font-bold text-xs mt-4">
                    P/I Security
                </div>
            </div>

            {/* Table layout matching PDF */}
            <div className="border border-black mb-6 text-xs">
                {/* Society */}
                <div className="flex border-b border-black items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Name of Club/Society:
                    </div>
                    <div className="w-1/2 p-1">
                        <Input
                            value={formData.society || ""}
                            onChange={(e) =>
                                handleChange("society", e.target.value)
                            }
                            placeholder="Enter club/society..."
                            className="border-none shadow-none focus-visible:ring-0 text-sm h-8 bg-transparent"
                        />
                    </div>
                </div>

                {/* Event Name */}
                <div className="flex border-b border-black items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Event Name:
                    </div>
                    <div className="w-1/2 p-1">
                        <Input
                            value={formData.eventName || ""}
                            onChange={(e) =>
                                handleChange("eventName", e.target.value)
                            }
                            placeholder="Enter event name..."
                            className="border-none shadow-none focus-visible:ring-0 text-sm h-8 bg-transparent"
                        />
                    </div>
                </div>

                {/* Brief Event Description */}
                <div className="flex border-b border-black items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Brief Event Description:
                    </div>
                    <div className="w-1/2 p-1">
                        <Textarea
                            value={formData.eventDescription || ""}
                            onChange={(e) =>
                                handleChange("eventDescription", e.target.value)
                            }
                            placeholder="Enter event description..."
                            className="border-none shadow-none focus-visible:ring-0 text-xs min-h-[50px] bg-transparent resize-y"
                        />
                    </div>
                </div>

                {/* Date */}
                <div className="flex border-b border-black items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Date:
                    </div>
                    <div className="w-1/2 p-1 flex gap-1 items-center">
                        <Input
                            type="text"
                            value={formData.date || ""}
                            onChange={(e) =>
                                handleChange("date", e.target.value)
                            }
                            className="text-[10px] h-7 px-0.5 bg-transparent"
                            placeholder="20/10/2026"
                        />
                    </div>
                </div>

                {/* Time */}
                <div className="flex border-b border-black items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Time:
                    </div>
                    <div className="w-1/2 p-1 flex gap-1 items-center">
                        <Input
                            type="text"
                            value={formData.time || ""}
                            onChange={(e) =>
                                handleChange("time", e.target.value)
                            }
                            className="text-[10px] h-7 px-0.5 bg-transparent"
                            placeholder="10:30 AM - 4:30 PM"
                        />
                    </div>
                </div>

                {/* Room Number */}
                <div className="flex border-b border-black items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Room Number:
                    </div>
                    <div className="w-1/2 p-1">
                        <Input
                            value={formData.roomNumber || ""}
                            onChange={(e) =>
                                handleChange("roomNumber", e.target.value)
                            }
                            placeholder="Enter room number..."
                            className="border-none shadow-none focus-visible:ring-0 text-sm h-8 bg-transparent"
                        />
                    </div>
                </div>

                {/* Department */}
                <div className="flex border-b border-black items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Department:
                    </div>
                    <div className="w-1/2 p-1">
                        <Input
                            value={formData.department || ""}
                            onChange={(e) =>
                                handleChange("department", e.target.value)
                            }
                            placeholder="Enter department..."
                            className="border-none shadow-none focus-visible:ring-0 text-xl h-8 bg-transparent"
                        />
                    </div>
                </div>

                {/* Expected participation & Audience */}
                <div className="flex items-center">
                    <div className="w-1/2 p-2.5 font-bold border-r border-black bg-gray-50">
                        Expected participation & Audience:
                    </div>
                    <div className="w-1/2 p-1">
                        <Textarea
                            value={formData.audience || ""}
                            onChange={(e) =>
                                handleChange("audience", e.target.value)
                            }
                            placeholder="Enter audience details..."
                            className="border-none shadow-none focus-visible:ring-0 text-xs min-h-[50px] bg-transparent resize-y"
                        />
                    </div>
                </div>
            </div>

            {/* Notes matching PDF */}
            <div className="text-[11px] space-y-3 mb-8">
                <p>
                    Note: The undersigned takes full responsibility for any
                    damage to the institute’s property in the above-mentioned
                    rooms during the specified time.
                </p>
                <p>
                    NOTE: Proper disciplined will be maintained during
                    practices/activity by everyone and secretary/ joint
                    secretary are responsible for it.
                </p>
                <p>Any financial assistance required? (Yes/No)</p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between pt-8 text-xs font-bold">
                <div>(Secretary/J. Secretary)</div>
                <div>(CCS/CSTS)</div>
            </div>
            <div className="flex justify-between pt-8 text-xs font-bold">
                <div>(Officer Incharge)</div>
                <div>(ADSA)</div>
            </div>
            <div className="pt-8 text-xs font-bold">
                <div>(DSA)</div>
            </div>
        </div>
    );
};

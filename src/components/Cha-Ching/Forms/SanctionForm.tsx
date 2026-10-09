import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const SanctionForm = ({
    onFormDataChange,
}: {
    onFormDataChange: (formData: any) => void;
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        clubName: "",
        eventName: "",
        fromEventDate: "",
        toEventDate: "",
        venues: [],
        fromTime: "",
        toTime: "",
        eventDescription: "",
        detailsSigned: "NO",
        expenditureItems: [],
        totalAmount: 0,
        fundSource: "",
        advanceAmount: "",
        recipientName: "",
    });

    useEffect(() => {
        if (typeof window !== undefined) {
            const form = sessionStorage.getItem("formData");
            if (form) {
                const originalFormData = JSON.parse(form);
                setFormData(originalFormData);
            }
        }
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        onFormDataChange(updatedData);
    };

    const addExpenditureItem = () => {
        const newItem = {
            id: Date.now().toString(),
            description: "",
            cost: 0,
            justification: "",
        };

        const updatedData = {
            ...formData,
            expenditureItems: [...formData.expenditureItems, newItem],
        };

        setFormData(updatedData);
        onFormDataChange(updatedData);
        toast.success("Expenditure item added");
    };

    const updateExpenditureItem = (
        id: string,
        field: string,
        value: string,
    ) => {
        const updatedItems = formData.expenditureItems.map((item: any) => {
            if (item.id === id) {
                return {
                    ...item,
                    [field]:
                        field === "cost" || field === "quantity"
                            ? parseFloat(value) || 0
                            : value,
                };
            }
            return item;
        });

        const totalAmount = updatedItems.reduce(
            (sum: number, item: any) => sum + item.cost * item.quantity,
            0,
        );

        const updatedData = {
            ...formData,
            expenditureItems: updatedItems,
            totalAmount,
        };

        setFormData(updatedData);
        onFormDataChange(updatedData);
    };

    const removeExpenditureItem = (id: string) => {
        const updatedItems = formData.expenditureItems.filter(
            (item: any) => item.id !== id,
        );
        const totalAmount = updatedItems.reduce(
            (sum: number, item: any) => sum + item.cost,
            0,
        );

        const updatedData = {
            ...formData,
            expenditureItems: updatedItems,
            totalAmount,
        };

        setFormData(updatedData);
        onFormDataChange(updatedData);
        toast.success("Expenditure item removed");
    };

    const basicInfoFields = [
        {
            label: "Name of Club/Technical Society",
            name: "clubName",
            type: "text",
            placeholder: "Enter club/society name...",
        },
        {
            label: "Event Name",
            name: "eventName",
            type: "text",
            placeholder: "Enter event name...",
        },
        {
            label: "From Date",
            name: "fromEventDate",
            type: "date",
        },
        {
            label: "To Date",
            name: "toEventDate",
            type: "date",
        },
        {
            label: "Venue(s)",
            name: "venues",
            type: "text",
            placeholder: "Enter venue...",
        },
        {
            label: "From Time",
            name: "fromTime",
            type: "time",
        },
        {
            label: "To Time",
            name: "toTime",
            type: "time",
        },
    ];

    return (
        <div className="space-y-4 max-w-full overflow-hidden">
            <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                    Event Permission & Financial Sanction
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                    Fill out the details for event permission and funding
                </p>
            </div>

            {/* Basic Event Information */}
            <div className="space-y-3 mx-4">
                {basicInfoFields.map((field, index) => (
                    <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-1 grid grid-cols-2"
                    >
                        <Label
                            htmlFor={field.name}
                            className="text-xs font-medium text-gray-700 block"
                        >
                            {field.label}
                        </Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className="w-full h-8 text-sm"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Event Description */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-1 mx-4"
            >
                <Label
                    htmlFor="eventDescription"
                    className="text-xs font-medium text-gray-700"
                >
                    Brief Event Description
                </Label>
                <Textarea
                    id="eventDescription"
                    name="eventDescription"
                    value={formData.eventDescription}
                    onChange={handleChange}
                    placeholder="Provide a brief description of your event..."
                    className="w-full min-h-[60px] resize-y text-sm"
                    rows={2}
                />
            </motion.div>

            {/* Expenditure Details */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2 mx-4"
            >
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-gray-700">
                        Expenditure Details
                    </Label>
                    <Button
                        type="button"
                        onClick={addExpenditureItem}
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Item
                    </Button>
                </div>

                <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                    {formData.expenditureItems.map(
                        (item: any, index: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-3">
                                    <div className="space-y-2">
                                        <div>
                                            <Label className="text-xs font-medium text-gray-700 block mb-1">
                                                Description
                                            </Label>
                                            <Input
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateExpenditureItem(
                                                        item.id,
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Item description..."
                                                className="text-xs w-full h-7"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-xs font-medium text-gray-700 block mb-1">
                                                    Cost Per Unit (₹)
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={item.cost}
                                                    onChange={(e) =>
                                                        updateExpenditureItem(
                                                            item.id,
                                                            "cost",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="text-xs w-full h-7"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-medium text-gray-700 block mb-1">
                                                    Quantity
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateExpenditureItem(
                                                            item.id,
                                                            "quantity",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="text-xs w-full h-7"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-xs font-medium text-gray-700 block mb-1">
                                                    Justification
                                                </Label>
                                                <Input
                                                    value={item.justification}
                                                    onChange={(e) =>
                                                        updateExpenditureItem(
                                                            item.id,
                                                            "justification",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Justification..."
                                                    className="text-xs w-full h-7"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExpenditureItem(
                                                            item.id,
                                                        )
                                                    }
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ),
                    )}

                    {formData.expenditureItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg"
                        >
                            <p className="text-xs">
                                No expenditure items added yet.
                            </p>
                            <p className="text-xs mt-1">
                                Click "Add Item" to add expenses.
                            </p>
                        </motion.div>
                    )}
                </div>

                {formData.expenditureItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="p-2 bg-green-50 rounded-lg border border-green-200"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">
                                Total Cost:
                            </span>
                            <span className="text-lg font-bold text-green-600">
                                ₹{formData.totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Financial Details */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 mx-4"
            >
                <div className="space-y-1">
                    <Label
                        htmlFor="fundSource"
                        className="text-xs font-medium text-gray-700 block"
                    >
                        Fund Source
                    </Label>
                    <Input
                        id="fundSource"
                        name="fundSource"
                        type="text"
                        value={formData.fundSource}
                        onChange={handleChange}
                        placeholder="e.g., Club Fund, College Fund..."
                        className="w-full h-8 text-sm"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label
                            htmlFor="advanceAmount"
                            className="text-xs font-medium text-gray-700 block"
                        >
                            Advance Amount (₹)
                        </Label>
                        <Input
                            id="advanceAmount"
                            name="advanceAmount"
                            type="number"
                            value={formData.advanceAmount}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full h-8 text-sm"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label
                            htmlFor="recipientName"
                            className="text-xs font-medium text-gray-700 block"
                        >
                            Recipient Name
                        </Label>
                        <Input
                            id="recipientName"
                            name="recipientName"
                            type="text"
                            value={formData.recipientName}
                            onChange={handleChange}
                            placeholder="Recipient name..."
                            className="w-full h-8 text-sm"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SanctionForm;

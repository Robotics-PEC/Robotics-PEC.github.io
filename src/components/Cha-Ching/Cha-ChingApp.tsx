import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Trash2, GripVertical } from "lucide-react";
import Sanction from "@/components/Cha-Ching/Documents/Sanction";
import PaperViewer from "@/components/PaperViewer";
import { toast } from "sonner";
import { round2 } from "@/lib/utils";
import {
    Sortable,
    SortableContent,
    SortableItem,
    SortableItemHandle,
} from "../ui/sortable";

const ChaChingApp = () => {
    const [formData, setFormData] = useState<Record<string, any>>({
        clubName: "",
        eventName: "",
        eventDate: "",
        venues: "",
        time: "",
        eventDescription: "",
        detailsSigned: "NO",
        expenditureItems: [],
        fundSource: "",
        advanceAmount: "",
        recipientName: "",
    });

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
        null,
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = sessionStorage.getItem("formData");
            if (saved) {
                try {
                    setFormData(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse saved form data", e);
                }
            }
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        sessionStorage.setItem("formData", JSON.stringify(updated));
    };

    const addExpenditureItem = () => {
        const newItem = {
            id: Date.now().toString(),
            description: "",
            quantity: 1,
            cost: 0,
            justification: "",
        };
        const updatedItems = [...(formData.expenditureItems || []), newItem];
        handleChange("expenditureItems", updatedItems);
        toast.success("Added expenditure item");
    };

    const updateExpenditureItem = (id: string, field: string, value: any) => {
        const updatedItems = (formData.expenditureItems || []).map(
            (item: any) =>
                item.id === id ? { ...item, [field]: value } : item,
        );
        handleChange("expenditureItems", updatedItems);
    };

    const removeExpenditureItem = (id: string) => {
        const updatedItems = (formData.expenditureItems || []).filter(
            (item: any) => item.id !== id,
        );
        handleChange("expenditureItems", updatedItems);
        toast.success("Removed expenditure item");
    };

    // Calculate total amount
    const totalAmount = (formData.expenditureItems || []).reduce(
        (sum: number, item: any) =>
            sum +
            round2(parseFloat(item.cost || 0) * parseFloat(item.quantity || 1)),
        0,
    );

    // Debounced PDF generation for preview mode
    useEffect(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(async () => {
            try {
                const blob = await pdf(
                    <Sanction formData={{ ...formData, totalAmount }} />,
                ).toBlob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (err) {
                console.error("PDF generation error", err);
            }
        }, 400);
        setDebounceTimer(timer);

        return () => {
            clearTimeout(timer);
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [formData, totalAmount]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const blob = await pdf(
                <Sanction formData={{ ...formData, totalAmount }} />,
            ).toBlob();

            // 1. Submit to backend API
            try {
                await fetch("/api/sanction", {
                    headers: {
                        "Content-Type": "application/pdf",
                        "X-Filename": formData.clubName || "sanction",
                    },
                    method: "POST",
                    body: blob,
                });
            } catch (error) {
                console.log(error);
            }

            // 2. Trigger local download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(formData.clubName || "Event").replace(/\s+/g, "_")}_Sanction_Form.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            toast.error(err.message || "Error downloading sanction");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            {/* Main Workspace */}
            <main className="flex-grow h-[calc(100vh-24px)] flex flex-col lg:flex-row gap-3 p-2 overflow-hidden">
                {/* Sanction Form (Scrollable) */}
                <div className="flex-1 h-full min-h-0 overflow-y-auto bg-white shadow-2xl rounded-lg border border-gray-300 p-12 font-serif text-black relative">
                    {/* Header */}
                    <div className="flex flex-row justify-end">
                        <div className="text-center mb-8">
                            <h2 className="text-lg font-bold tracking-wide">
                                PUNJAB ENGINEERING COLLEGE
                            </h2>
                            <h3 className="text-sm font-semibold tracking-wide">
                                (Deemed to be University)
                            </h3>
                            <h3 className="text-sm font-bold mt-2">
                                PERFORMA FOR EVENT PERMISSION AND FINANCIAL
                                SANCTION BY
                            </h3>
                            <h3 className="text-sm font-bold">
                                CLUBS/SOCIETIES/SPORTS DEPARTMENT
                            </h3>
                        </div>
                        <div>
                            <Button
                                size="sm"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className="gap-1.5 text-xs"
                            >
                                <Download className="w-3.5 h-3.5" />
                                {isSubmitting
                                    ? "Processing..."
                                    : "Download PDF"}
                            </Button>
                        </div>
                    </div>
                    {/* Event Details Table */}
                    <div className="border border-black mb-6">
                        {/* Club Name */}
                        <div className="flex border-b border-black items-center">
                            <div className="w-1/3 p-2.5 font-bold text-xs border-r border-black bg-gray-50">
                                Name of Club/Technical Society
                            </div>
                            <div className="w-2/3 p-1">
                                <Input
                                    value={formData.clubName || ""}
                                    onChange={(e) =>
                                        handleChange("clubName", e.target.value)
                                    }
                                    placeholder="Enter Club / Society Name..."
                                    className="border-none shadow-none focus-visible:ring-0 text-sm h-8 bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Event Name */}
                        <div className="flex border-b border-black items-center">
                            <div className="w-1/3 p-2.5 font-bold text-xs border-r border-black bg-gray-50">
                                Event Name
                            </div>
                            <div className="w-2/3 p-1">
                                <Input
                                    value={formData.eventName || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            "eventName",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter Event Name..."
                                    className="border-none shadow-none focus-visible:ring-0 text-sm h-8 bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Date, Venue, Time Row */}
                        <div className="flex border-b border-black items-stretch text-xs">
                            <div className="w-1/3 p-2.5 border-r border-black flex flex-col justify-center">
                                <span className="font-bold mb-1">Date</span>
                                <Input
                                    type="text"
                                    value={formData.eventDate || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            "eventDate",
                                            e.target.value,
                                        )
                                    }
                                    className="border-none shadow-none focus-visible:ring-0 text-xs h-7 p-0 bg-transparent"
                                    placeholder="20-08-2026"
                                />
                            </div>
                            <div className="w-1/3 p-2.5 border-r border-black flex flex-col justify-center">
                                <span className="font-bold mb-1">
                                    Venue(s):
                                </span>
                                <Input
                                    value={formData.venues || ""}
                                    onChange={(e) =>
                                        handleChange("venues", e.target.value)
                                    }
                                    placeholder="e.g. Audi, Drawing Hall"
                                    className="border-none shadow-none focus-visible:ring-0 text-xs h-7 p-0 bg-transparent"
                                />
                            </div>
                            <div className="w-1/3 p-2.5 flex flex-col justify-center">
                                <span className="font-bold mb-1">Time:</span>
                                <Input
                                    type="text"
                                    value={formData.time || ""}
                                    onChange={(e) =>
                                        handleChange("time", e.target.value)
                                    }
                                    placeholder="12:00 PM to 03:00 PM"
                                    className="border-none shadow-none focus-visible:ring-0 text-xs h-7 p-0 bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Brief Event Description */}
                        <div className="flex items-stretch">
                            <div className="w-1/3 p-2.5 font-bold text-xs border-r border-black bg-gray-50">
                                Brief Event Description
                            </div>
                            <div className="w-2/3 p-1">
                                <Textarea
                                    value={formData.eventDescription || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            "eventDescription",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter brief description of event..."
                                    className="border-none shadow-none focus-visible:ring-0 text-sm min-h-[60px] bg-transparent resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Details signed row */}
                    <div className="flex items-center justify-between mb-6 text-xs font-serif">
                        <span>
                            Have the details of the event signed by Club
                            Secretary attached along with sanction?
                        </span>
                        <Select
                            value={formData.detailsSigned || "NO"}
                            onValueChange={(val) =>
                                handleChange("detailsSigned", val)
                            }
                        >
                            <SelectTrigger className="w-24 h-8 text-xs font-bold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="YES">YES</SelectItem>
                                <SelectItem value="NO">NO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <p className="text-xs mb-6 font-serif">
                        Permission may please be granted for conducting above
                        mentioned event.
                    </p>

                    {/* Expenditure Table Section */}
                    <div className="mb-6">
                        <div className="text-center font-bold text-xs mb-2">
                            PROPOSED EXPENDITURE ITEMS
                        </div>
                        <div className="border border-black">
                            <div className="flex border-b border-black bg-gray-50 text-xs font-bold text-center">
                                <div className="w-[6%] shrink-0 p-1.5 border-r border-black" />
                                <div className="w-[6%] shrink-0 p-1.5 border-r border-black">
                                    S.No
                                </div>
                                <div className="w-[28%] shrink-0 p-1.5 border-r border-black">
                                    Description of Item
                                </div>
                                <div className="w-[10%] shrink-0 p-1.5 border-r border-black">
                                    Qty
                                </div>
                                <div className="w-[16%] shrink-0 p-1.5 border-r border-black">
                                    Cost (₹)
                                </div>
                                <div className="w-[26%] shrink-0 p-1.5 border-r border-black">
                                    Justification
                                </div>
                                <div className="w-[8%] shrink-0 p-1.5">
                                    Action
                                </div>
                            </div>

                            {(formData.expenditureItems || []).length === 0 ? (
                                <div className="p-4 text-center text-xs text-gray-500 italic">
                                    No expenditure items added yet. Click below
                                    to add items.
                                </div>
                            ) : (
                                <Sortable
                                    value={formData.expenditureItems || []}
                                    onValueChange={(items) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            expenditureItems: items,
                                        }))
                                    }
                                    getItemValue={(item: any) => item.id}
                                >
                                    <SortableContent>
                                        {(formData.expenditureItems || []).map(
                                            (item: any, index: number) => (
                                                <>
                                                    <SortableItem
                                                        value={item.id}
                                                    >
                                                        <div
                                                            key={item.id}
                                                            className="flex border-b border-black last:border-b-none text-xs items-stretch"
                                                        >
                                                            <div className="w-[6%] p-1 text-center border-r border-black font-bold">
                                                                <SortableItemHandle
                                                                    render={
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="size-8"
                                                                        />
                                                                    }
                                                                >
                                                                    <GripVertical className="h-4 w-4" />
                                                                </SortableItemHandle>
                                                            </div>
                                                            <div className="w-[6%] p-1 text-center border-r border-black text-xl">
                                                                {index + 1}
                                                            </div>
                                                            <div className="w-[28%] p-1 border-r border-black">
                                                                <Input
                                                                    value={
                                                                        item.description ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateExpenditureItem(
                                                                            item.id,
                                                                            "description",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Item name"
                                                                    className="border-none shadow-none h-7 text-xs bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="w-[10%] p-1 border-r border-black">
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        item.quantity ??
                                                                        1
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateExpenditureItem(
                                                                            item.id,
                                                                            "quantity",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="border-none shadow-none h-7 text-xs text-center bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="w-[16%] p-1 border-r border-black">
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        item.cost ??
                                                                        0
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateExpenditureItem(
                                                                            item.id,
                                                                            "cost",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="border-none shadow-none h-7 text-xs text-center bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="w-[26%] p-1 border-r border-black">
                                                                <Input
                                                                    value={
                                                                        item.justification ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateExpenditureItem(
                                                                            item.id,
                                                                            "justification",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Why needed?"
                                                                    className="border-none shadow-none h-7 text-xs bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="w-[8%] p-1 text-center">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        removeExpenditureItem(
                                                                            item.id,
                                                                        )
                                                                    }
                                                                    className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </SortableItem>
                                                </>
                                            ),
                                        )}
                                    </SortableContent>
                                </Sortable>
                            )}
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addExpenditureItem}
                                className="gap-1 text-xs"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Item
                            </Button>
                            <div className="">
                                Total Amount: ₹ {totalAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div className="border border-black p-4 mb-8 text-xs space-y-3 bg-gray-50/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-bold block mb-1">
                                    Source of Funds:
                                </span>
                                <Input
                                    value={formData.fundSource || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            "fundSource",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Student Council / Club Funds"
                                    className="h-8 text-xs bg-white"
                                />
                            </div>
                            <div>
                                <span className="font-bold block mb-1">
                                    Advance Amount Required (if any):
                                </span>
                                <Input
                                    value={formData.advanceAmount || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            "advanceAmount",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. ₹ 5,000"
                                    className="h-8 text-xs bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-bold block mb-1">
                                Name of Recipient for Advance:
                            </span>
                            <Input
                                value={formData.recipientName || ""}
                                onChange={(e) =>
                                    handleChange(
                                        "recipientName",
                                        e.target.value,
                                    )
                                }
                                placeholder="Full name of student recipient"
                                className="h-8 text-xs bg-white w-1/2"
                            />
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between pt-12 text-xs">
                        <div className="text-center">
                            <div className="border-b border-black w-48 mb-1"></div>
                            <span className="font-bold">
                                Club President / Secretary
                            </span>
                        </div>
                        <div className="text-center">
                            <div className="border-b border-black w-48 mb-1"></div>
                            <span className="font-bold">
                                Faculty Incharge / Advisor
                            </span>
                        </div>
                    </div>
                </div>
                {/* PDF View (Independent Scroll) */}
                <div className="flex-1 h-full min-h-0 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex flex-col">
                    {pdfUrl ? (
                        <PaperViewer url={pdfUrl} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-pulse text-gray-500 text-sm">
                                Generating PDF Preview...
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ChaChingApp;

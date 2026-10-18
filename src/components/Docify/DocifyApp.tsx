"use client";

import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { RoomPermission } from "@/components/Docify/Documents/RoomPermission";
import { Letter } from "@/components/Docify/Documents/Letter";
import { RoomPermissionForm } from "@/components/Docify/Forms/RoomPermissionForm";
import LetterForm from "@/components/Docify/Forms/LetterForm";
import PaperViewer from "@/components/PaperViewer";
import { AuditoriumPermissionForm } from "@/components/Docify/Forms/AuditoriumPermissionForm";
import { AuditoriumPermission } from "@/components/Docify/Documents/AuditoriumPermssion";
import { DocumentType } from "@/types";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const DocifyApp = () => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [documentType, setDocumentType] = useState<DocumentType>(
        DocumentType.ROOM_PERMISSION,
    );
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const changeDocumentType = (type: DocumentType) => {
        sessionStorage.clear();
        setFormData({});
        setDocumentType(type);
        sessionStorage.setItem("type", type);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const type = sessionStorage.getItem("type");
            if (type) {
                setDocumentType(type as DocumentType);
            }
            const form = sessionStorage.getItem("formData");
            if (form) {
                try {
                    setFormData(JSON.parse(form));
                } catch (e) {
                    console.error("Failed to parse form data", e);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const newTimer = setTimeout(async () => {
            try {
                const DocumentComponent =
                    documentType === "RoomPermission"
                        ? RoomPermission
                        : documentType === "Letter"
                          ? Letter
                          : AuditoriumPermission;
                const blob = await pdf(
                    <DocumentComponent formData={formData} />,
                ).toBlob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (error) {
                console.error("PDF generation error", error);
            }
        }, 400);

        setDebounceTimer(newTimer);

        return () => {
            clearTimeout(newTimer);
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [formData, documentType]);

    const handleDownload = async () => {
        try {
            setIsSubmitting(true);
            const DocumentComponent =
                documentType === "RoomPermission"
                    ? RoomPermission
                    : documentType === "Letter"
                      ? Letter
                      : AuditoriumPermission;

            const blob = await pdf(
                <DocumentComponent formData={formData} />,
            ).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${documentType}_Document.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("PDF downloaded successfully!");
        } catch (err: any) {
            toast.error(err.message || "Error generating PDF");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            {/* Top Toolbar */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-50">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                        <h1 className="text-base font-bold text-gray-900 leading-tight">
                            Docify In-PDF Document Generator
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Fill in the document view on the left; preview
                            updates instantly on the right.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700">
                            Document Type:
                        </span>
                        <Select
                            onValueChange={(val) =>
                                changeDocumentType(val as DocumentType)
                            }
                            value={documentType}
                        >
                            <SelectTrigger className="w-[200px] h-8 text-xs">
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RoomPermission">
                                    Room Permission
                                </SelectItem>
                                <SelectItem value="Letter">
                                    Application Letter
                                </SelectItem>
                                <SelectItem value="AuditoriumPermission">
                                    Auditorium Permission
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        size="sm"
                        disabled={isSubmitting}
                        onClick={handleDownload}
                        className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 h-8"
                    >
                        <Download className="w-3.5 h-3.5" />
                        {isSubmitting ? "Preparing..." : "Download PDF"}
                    </Button>
                </div>
            </header>

            {/* Main Workspace: Side-by-Side Independent Scrolling */}
            <main className="flex-grow h-[calc(100vh-65px)] flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
                {/* Form / In-Document Editor (Scrollable) */}
                <div className="flex-1 h-full min-h-0 overflow-y-auto bg-white shadow-2xl rounded-lg border border-gray-300 p-12 relative">
                    {documentType === "RoomPermission" ? (
                        <RoomPermissionForm onFormDataChange={setFormData} />
                    ) : documentType === "Letter" ? (
                        <LetterForm onFormDataChange={setFormData} />
                    ) : (
                        <AuditoriumPermissionForm
                            onFormDataChange={setFormData}
                        />
                    )}
                </div>

                {/* PDF Live Preview (Independent Scroll) */}
                <div className="flex-1 h-full min-h-0 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex flex-col">
                    {pdfUrl ? (
                        <PaperViewer url={pdfUrl} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm animate-pulse">
                            Generating PDF Preview...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DocifyApp;

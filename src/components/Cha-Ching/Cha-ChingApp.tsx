import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import Sanction from "@/components/Cha-Ching/Documents/Sanction";
import PaperViewer from "@/components/PaperViewer";
import SanctionForm from "@/components/Cha-Ching/Forms/SanctionForm";
import { toast } from "sonner";

const ChaChingApp = () => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
        null,
    );

    // Debounced PDF generation for preview mode
    useEffect(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(async () => {
            try {
                const blob = await pdf(
                    <Sanction formData={formData} />,
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
    }, [formData]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const blob = await pdf(<Sanction formData={formData} />).toBlob();

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
                <div className="flex-1 h-full min-h-0 overflow-y-auto bg-white shadow-2xl rounded-lg border border-gray-300 p-12 relative">
                    <SanctionForm
                        onFormDataChange={setFormData}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
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

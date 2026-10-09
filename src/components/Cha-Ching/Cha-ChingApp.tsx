import { useState, useEffect } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import PaperViewer from "@/components/PaperViewer";
import Sanction from "@/components/Cha-Ching/Documents/Sanction";
import SanctionForm from "@/components/Cha-Ching/Forms/SanctionForm";

const App = () => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isMobile, setIsMobile] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
        null,
    );
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleClick = async () => {
        const blob = await pdf(<Sanction formData={formData} />).toBlob();
        const response = await fetch("/api/sanction", {
            headers: {
                "Content-Type": "application/pdf",
                "X-Filename": formData.clubName,
            },
            method: "POST",
            body: blob,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        if (typeof window !== undefined) {
            const form = sessionStorage.getItem("formData");
            const originalFormData = JSON.parse(form || "{}");

            if (originalFormData) {
                setFormData(originalFormData);
            }
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Cleanup previous URL
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        setPdfLoading(true);

        const newTimer = setTimeout(async () => {
            try {
                const blob = await pdf(
                    <Sanction formData={formData} />,
                ).toBlob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setPdfLoading(false);
            }
        }, 500);

        setDebounceTimer(newTimer);

        return () => {
            clearTimeout(newTimer);
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [formData]);

    const onFormDataChange = (data: any) => {
        setFormData(data);
        sessionStorage.setItem("formData", JSON.stringify(data));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow px-6 py-12 lg:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4">
                            Welcome to Cha-Ching
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Create Sanction with ease
                        </p>
                        <p className="mt-4 text-sm text-gray-600">
                            For changes contact:{" "}
                            <a
                                href="tel:+919424889220"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Kartavya Bang (+91 94248 89220)
                            </a>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[calc(100vh-200px)]">
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Form Section */}
                            <div className="lg:w-[400px] p-8 border-r border-gray-100 overflow-y-auto">
                                <div className="space-y-6">
                                    <SanctionForm
                                        onFormDataChange={onFormDataChange}
                                    />
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <PDFDownloadLink
                                        document={
                                            <Sanction formData={formData} />
                                        }
                                        fileName="Event_Sanction_Form.pdf"
                                    >
                                        {({ loading }) => (
                                            <Button
                                                className="w-full transition-colors"
                                                disabled={loading}
                                                onClick={handleClick}
                                            >
                                                {loading
                                                    ? "Preparing Download..."
                                                    : "Download PDF"}
                                            </Button>
                                        )}
                                    </PDFDownloadLink>
                                </div>
                            </div>

                            {/* PDF Viewer Section */}
                            <div className="flex-1 p-8 bg-gray-50 rounded-r-2xl overflow-hidden">
                                {pdfLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                            <div className="text-gray-500">
                                                Generating PDF preview...
                                            </div>
                                        </div>
                                    </div>
                                ) : pdfUrl ? (
                                    <PaperViewer url={pdfUrl} />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-gray-500">
                                            <p className="text-lg mb-2">
                                                PDF Preview
                                            </p>
                                            <p className="text-sm">
                                                Fill out the form to see the
                                                preview
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;

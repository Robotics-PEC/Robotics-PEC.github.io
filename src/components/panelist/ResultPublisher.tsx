import { useState, useEffect } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { FileUp, Save, Upload, CheckCircle2, AlertCircle, FileCheck, RefreshCw } from "lucide-react";
import { batchUpdateApplicantStatuses } from "@/lib/supabase/actions/applicants.actions";
import { updateFeatureFlagByName } from "@/lib/supabase/actions/flags.actions";

type ParsedResult = {
    applicationId: string;
    status: "accepted" | "rejected";
};

type PublishedMeta = {
    fileName: string;
    publishedAt: string;
    acceptedCount: number;
    rejectedCount: number;
};

const STORAGE_KEY = "results_publisher_last_published";

const ResultPublisher = () => {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedResult[] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [publishedMeta, setPublishedMeta] = useState<PublishedMeta | null>(null);

    // Load last published meta from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setPublishedMeta(JSON.parse(stored));
        } catch {}
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        
        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as Record<string, any>[];
                
                const validResults: ParsedResult[] = [];
                let missingCount = 0;

                data.forEach(row => {
                    const appId = row["Application ID"]?.toString().trim();
                    const statusStr = row["Status"]?.toString().trim().toLowerCase();

                    if (appId && (statusStr === "accepted" || statusStr === "rejected")) {
                        validResults.push({
                            applicationId: appId,
                            status: statusStr as "accepted" | "rejected"
                        });
                    } else {
                        missingCount++;
                    }
                });

                if (validResults.length === 0) {
                    toast.error("No valid results found. Ensure you have 'Application ID' and 'Status' columns, and Status is either 'Accepted' or 'Rejected'.");
                    setParsedData(null);
                    return;
                }

                if (missingCount > 0) {
                    toast.warning(`${missingCount} rows were ignored due to missing or invalid data.`);
                }

                setParsedData(validResults);
            },
            error: (error) => {
                toast.error(`Failed to parse CSV: ${error.message}`);
            }
        });
    };

    const handlePublish = async () => {
        if (!parsedData || parsedData.length === 0 || !file) return;

        setIsProcessing(true);
        try {
            // 1. Batch update database
            const updates = parsedData.map(d => ({
                id: d.applicationId,
                status: d.status
            }));
            
            const { success, updatedCount } = await batchUpdateApplicantStatuses(updates);
            
            if (!success) {
                throw new Error("Database batch update failed. Check console for details.");
            }

            if (updatedCount === 0) {
                toast.warning("Published, but 0 applicant rows were actually updated. Check that Application IDs in the CSV match the database.");
            }

            // 2. Enable Feature Flag
            const flagUpdated = await updateFeatureFlagByName("interview-results-2026", true);
            if (!flagUpdated) {
                toast.warning("Statuses updated, but failed to automatically toggle the results flag. Please enable it manually above.");
            } else {
                toast.success(`Successfully published! ${updatedCount} applicant(s) updated.`);
            }

            // 3. Persist published metadata
            const accepted = parsedData.filter(d => d.status === "accepted").length;
            const rejected = parsedData.filter(d => d.status === "rejected").length;
            const meta: PublishedMeta = {
                fileName: file.name,
                publishedAt: new Date().toISOString(),
                acceptedCount: accepted,
                rejectedCount: rejected,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
            setPublishedMeta(meta);
            
            setFile(null);
            setParsedData(null);
        } catch (error: any) {
            toast.error(error.message || "An error occurred while publishing.");
        } finally {
            setIsProcessing(false);
        }
    };

    const acceptedCount = parsedData?.filter(d => d.status === "accepted").length || 0;
    const rejectedCount = parsedData?.filter(d => d.status === "rejected").length || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Publish Interview Results</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Upload your finalized CSV or Excel file to publish results. The file must contain an <strong>Application ID</strong> column and a <strong>Status</strong> column (Accepted / Rejected).
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button 
                        onClick={() => window.open("/apply?preview=accepted", "_blank")}
                        className="text-sm px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-md shadow-sm font-medium transition-colors"
                    >
                        Preview Accepted
                    </button>
                    <button 
                        onClick={() => window.open("/apply?preview=rejected", "_blank")}
                        className="text-sm px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-md shadow-sm font-medium transition-colors"
                    >
                        Preview Rejected
                    </button>
                </div>
            </div>

            {/* Currently Published CSV Banner */}
            {publishedMeta && !parsedData && (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                            <p className="font-medium text-emerald-900 text-sm">Currently Published: <span className="font-mono">{publishedMeta.fileName}</span></p>
                            <p className="text-xs text-emerald-700 mt-0.5">
                                {new Date(publishedMeta.publishedAt).toLocaleString()} &middot; {publishedMeta.acceptedCount} accepted &middot; {publishedMeta.rejectedCount} rejected
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-emerald-600 font-medium">Upload new CSV to replace</span>
                        <RefreshCw className="w-4 h-4 text-emerald-500" />
                    </div>
                </div>
            )}

            {!parsedData ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isProcessing}
                    />
                    <Upload className="w-10 h-10 text-gray-400 mb-4" />
                    <p className="text-sm font-medium text-gray-900">Click or drag CSV file to upload</p>
                    <p className="text-xs text-gray-500 mt-1">Only .csv files are supported</p>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FileUp className="w-6 h-6 text-blue-600" />
                            <div>
                                <p className="font-medium text-blue-900">{file?.name}</p>
                                <p className="text-sm text-blue-700">{parsedData.length} valid records found</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setFile(null); setParsedData(null); }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 bg-white rounded-md border shadow-sm"
                            disabled={isProcessing}
                        >
                            Change File
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-green-200 bg-green-50 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-800">Accepted</p>
                                <p className="text-3xl font-bold text-green-900 mt-1">{acceptedCount}</p>
                            </div>
                            <CheckCircle2 className="w-10 h-10 text-green-200" />
                        </div>
                        <div className="p-4 rounded-xl border border-red-200 bg-red-50 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-800">Rejected</p>
                                <p className="text-3xl font-bold text-red-900 mt-1">{rejectedCount}</p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-red-200" />
                        </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-end">
                        <button
                            onClick={handlePublish}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-sm transition-opacity ${isProcessing ? 'opacity-50 cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isProcessing ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Publish Results
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultPublisher;

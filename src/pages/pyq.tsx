import { useState, useEffect } from "react";
import { client } from "@/lib/supabase/supabase";
import {
    fetchVerifiedPapers,
    QuestionPaper,
} from "@/lib/supabase/actions/pyq.actions";
import {
    uploadPaper,
    deletePaper,
    getStorageImageUrl,
} from "@/lib/supabase/actions/storage.actions";
import { getProfileFromUserId } from "@/lib/supabase/actions/profiles.actions";
import PageHead from "@/components/layout/PageHead";
import { Loader } from "@/components/layout/Loader";
import { useAuthRole } from "@/lib/useAuthRole";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    DynamicForm,
    FormConfig,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    SubmitConfigKey,
    InputMode,
} from "@/lib/form-builder";

const PYQPage = () => {
    const [papers, setPapers] = useState<QuestionPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(
        null,
    );
    const [paperUrl, setPaperUrl] = useState<string | null>(null);
    const { user, userId } = useAuthRole();

    const pyqUploadFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "courseCode",
                        [FieldConfigKey.LABEL]: "Course Code and Name",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.REQUIRED]: true,
                        [FieldConfigKey.PLACEHOLDER]:
                            "Enter course code (e.g., CS101 (Introduction to C++))",
                    },
                    {
                        [FieldConfigKey.NAME]: "year",
                        [FieldConfigKey.LABEL]: "Year",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.REQUIRED]: true,
                        [FieldConfigKey.PLACEHOLDER]: "Year (e.g., 2026)",
                        [FieldConfigKey.INPUT_MODE]: InputMode.NUMERIC,
                    },
                    {
                        [FieldConfigKey.NAME]: "type",
                        [FieldConfigKey.LABEL]: "Paper Type",
                        [FieldConfigKey.TYPE]: FieldType.SELECT,
                        [FieldConfigKey.REQUIRED]: true,
                        [FieldConfigKey.OPTIONS]: [
                            { label: "Mid-term", value: "midterm" },
                            { label: "End-term", value: "endterm" },
                        ],
                    },
                    {
                        [FieldConfigKey.NAME]: "file",
                        [FieldConfigKey.LABEL]: "Question Paper PDF",
                        [FieldConfigKey.TYPE]: FieldType.FILE,
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: "Upload",
            [SubmitConfigKey.LOADING_LABEL]: "Uploading...",
        },
    };

    useEffect(() => {
        const loadPapers = async () => {
            try {
                const data = await fetchVerifiedPapers();
                setPapers(data);
            } catch (error) {
                console.error("Failed to fetch papers:", error);
                toast.error("Failed to fetch papers");
            } finally {
                setLoading(false);
            }
        };
        loadPapers();
    }, []);

    useEffect(() => {
        const fetchUrl = async () => {
            if (selectedPaper) {
                const url = await getStorageImageUrl(
                    selectedPaper.filePath,
                    "verifiedPapers",
                );
                setPaperUrl(url);
            } else {
                setPaperUrl(null);
            }
        };
        fetchUrl();
    }, [selectedPaper]);

    const handleUpload = async (values: any) => {
        const { file, courseCode, year, type } = values;

        if (!file || !courseCode || !year || !type || !userId) return;

        // Get profile ID
        const { data: profile, error: profileError } =
            await getProfileFromUserId(userId);
        if (profileError || !profile) {
            toast.error("Could not find your profile");
            return;
        }

        // 1. Upload to storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${courseCode}_${year}_${Date.now()}.${fileExt}`;

        try {
            await uploadPaper(fileName, file, "unverifiedPapers");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file");
            return;
        }

        // 2. Insert DB record
        try {
            const {
                data: { session },
            } = await client.auth.getSession();
            const response = await fetch("/api/pyq/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token || ""}`,
                },
                body: JSON.stringify({
                    courseCode,
                    year: parseInt(year),
                    type,
                    filePath: fileName,
                    uploaderId: profile.id, // Pass profile ID
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to upload paper");
            }

            toast.success("Paper uploaded for verification!");
            setIsUploadOpen(false);
        } catch (error) {
            // ROLLBACK: Cleanup the orphaned file
            try {
                await deletePaper(fileName, "unverifiedPapers");
                toast.success("Transaction rolled back: file cleaned up.");
            } catch (rollbackError) {
                console.error("Rollback failed:", rollbackError);
                toast.error(
                    "Database error, and failed to cleanup file. Please contact support.",
                );
            }

            console.error("DB error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save paper details.",
            );
        }
    };

    return (
        <Loader isLoading={loading}>
            <PageHead
                title="Previous Year Questions | Robotics PEC"
                description="Explore previous year question papers for different courses."
            />
            <div className="container mx-auto p-4">
                <div className="flex flex-row justify-between">
                    <h1 className="text-3xl font-bold mb-4">
                        Previous Year Questions
                    </h1>

                    {user && (
                        <Dialog
                            open={isUploadOpen}
                            onOpenChange={setIsUploadOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="mb-4">Upload Paper</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Paper</DialogTitle>
                                </DialogHeader>
                                <DynamicForm
                                    config={pyqUploadFormConfig}
                                    onSubmit={handleUpload}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {papers.length === 0 ? (
                    <p>No papers found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {papers.map((paper) => (
                            <div
                                key={paper.id}
                                className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                                onClick={() => setSelectedPaper(paper)}
                            >
                                <h2 className="text-xl font-semibold">
                                    {paper.courseCode}
                                </h2>
                                <p>Year: {paper.year}</p>
                                <p>Type: {paper.type}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* PDF Preview Dialog */}
                <Dialog
                    open={!!selectedPaper}
                    onOpenChange={() => setSelectedPaper(null)}
                >
                    <DialogContent className="max-w-4xl h-[80vh] flex flex-col gap-3">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedPaper?.courseCode} -{" "}
                                {selectedPaper?.year}
                            </DialogTitle>
                        </DialogHeader>
                        {paperUrl ? (
                            <>
                                <iframe
                                    src={paperUrl}
                                    title="PDF Preview"
                                    className="w-full flex-1 min-h-0 rounded border"
                                />
                                <a
                                    href={paperUrl}
                                    download
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    Download PDF
                                </a>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </Loader>
    );
};

export default PYQPage;

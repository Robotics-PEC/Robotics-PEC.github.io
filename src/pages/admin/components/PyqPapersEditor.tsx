"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/supabase/supabase";
import {
    QuestionPaper,
    fetchAllPapers,
} from "@/lib/supabase/actions/pyq.actions";
import { getSignedUrl } from "@/lib/supabase/actions/storage.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function PyqPapersEditor() {
    const [papers, setPapers] = useState<QuestionPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(
        null,
    );
    const [paperUrl, setPaperUrl] = useState<string | null>(null);

    useEffect(() => {
        loadPapers();
    }, []);

    useEffect(() => {
        const fetchUrl = async () => {
            if (selectedPaper) {
                const bucket = selectedPaper.isVerified
                    ? "verifiedPapers"
                    : "unverifiedPapers";
                const url = await getSignedUrl(bucket, selectedPaper.filePath);
                setPaperUrl(url);
            } else {
                setPaperUrl(null);
            }
        };
        fetchUrl();
    }, [selectedPaper]);

    async function loadPapers() {
        setLoading(true);
        try {
            const data = await fetchAllPapers();
            setPapers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load papers");
        } finally {
            setLoading(false);
        }
    }

    async function toggleVerification(paper: QuestionPaper) {
        setTogglingId(paper.id);
        const nextVerifiedState = !paper.isVerified;
        try {
            const {
                data: { session },
            } = await client.auth.getSession();

            const response = await fetch("/api/pyq/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token || ""}`,
                },
                body: JSON.stringify({
                    id: paper.id,
                    filePath: paper.filePath,
                    isVerified: nextVerifiedState,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Failed to verify paper");
            }

            setPapers((prev) =>
                prev.map((p) =>
                    p.id === paper.id
                        ? { ...p, isVerified: nextVerifiedState }
                        : p,
                ),
            );
            toast.success("Status updated and file moved");
        } catch (error) {
            console.error(error);
            toast.error(
                "Failed to update status: " +
                    (error instanceof Error ? error.message : "Unknown error"),
            );
        } finally {
            setTogglingId(null);
        }
    }

    async function viewPaper(paper: QuestionPaper) {
        setSelectedPaper(paper);
    }

    if (loading) {
        return <Skeleton className="h-60 w-full" />;
    }

    return (
        <div className="rounded-lg border max-h-[50vh] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Verified</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {papers.map((paper) => (
                        <TableRow key={paper.id}>
                            <TableCell>{paper.courseCode}</TableCell>
                            <TableCell>{paper.year}</TableCell>
                            <TableCell>{paper.type}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => viewPaper(paper)}
                                >
                                    View
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={paper.isVerified}
                                    onCheckedChange={() =>
                                        toggleVerification(paper)
                                    }
                                    disabled={togglingId === paper.id}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* PDF Preview Dialog */}
            <Dialog
                open={!!selectedPaper}
                onOpenChange={() => setSelectedPaper(null)}
            >
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col gap-3">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPaper?.courseCode} - {selectedPaper?.year}
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
    );
}

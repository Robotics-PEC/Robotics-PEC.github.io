"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/supabase/supabase";
import {
    QuestionPaper,
    fetchAllPapers,
} from "@/lib/supabase/actions/pyq.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export default function PyqPapersEditor() {
    const [papers, setPapers] = useState<QuestionPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        loadPapers();
    }, []);

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

    if (loading) {
        return <Skeleton className="h-60 w-full" />;
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Type</TableHead>
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
        </div>
    );
}

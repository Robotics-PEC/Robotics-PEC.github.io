import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import DinoSubmitOverlay from "./DinoSubmitOverlay";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

enum DocumentStatusCheck {
    CHECKING,
    OK,
    FAILED,
}

const PdfPreview = ({ url }: { url: string }) => {
    const [status, setStatus] = useState<DocumentStatusCheck>(
        DocumentStatusCheck.CHECKING,
    );
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>();
    const [pages, setPages] = useState(0);

    const setRef = useCallback((el: HTMLDivElement | null) => {
        if (!el) return;
        setWidth(el.clientWidth);
        const ro = new ResizeObserver(() => setWidth(el.clientWidth));
        ro.observe(el);
    }, []);

    useEffect(() => {
        let cancelled = false;
        setStatus(DocumentStatusCheck.CHECKING);
        fetch(url, { method: "HEAD" })
            .then(
                (r) =>
                    !cancelled &&
                    setStatus(
                        r.ok
                            ? DocumentStatusCheck.OK
                            : DocumentStatusCheck.FAILED,
                    ),
            )
            .catch(() => !cancelled && setStatus(DocumentStatusCheck.FAILED));
        return () => {
            cancelled = true;
        };
    }, [url]);

    if (status === DocumentStatusCheck.FAILED)
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-red-500">
                Failed to load PDF.
            </div>
        );
    if (status === DocumentStatusCheck.CHECKING)
        return <DinoSubmitOverlay submitting={true} onClose={() => {}} />;
    // then render your existing <div ref={ref}><Document ...> as is

    return (
        <div ref={setRef} className="w-full flex-1 min-h-0 overflow-auto">
            <Document
                file={url}
                onLoadSuccess={({ numPages }) => setPages(numPages)}
                onLoadError={(e) => console.error("PDF load error:", e)}
                loading={
                    <DinoSubmitOverlay submitting={true} onClose={() => {}} />
                }
                error={<p>Failed to load PDF.</p>}
            >
                {width &&
                    Array.from({ length: pages }, (_, i) => (
                        <Page key={i} pageNumber={i + 1} width={width} />
                    ))}
            </Document>
        </div>
    );
};

export default PdfPreview;

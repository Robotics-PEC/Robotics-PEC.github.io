import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

type Props = { url: string; singlePage?: boolean };

const PaperViewer = ({ url, singlePage = false }: Props) => {
    const [numPages, setNumPages] = useState(0);
    const pages = singlePage ? 1 : numPages;

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden flex justify-center bg-gray-100">
            <Document
                file={url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse text-gray-400">
                            Loading PDF...
                        </div>
                    </div>
                }
            >
                {Array.from({ length: pages }, (_, i) => (
                    <div key={i} className="mb-4 bg-white shadow-lg">
                        <Page
                            pageNumber={i + 1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            scale={1.5}
                            className="max-w-full"
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
};

export default PaperViewer;

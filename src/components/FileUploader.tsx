import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploaderProps {
    onFileAccepted: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onFileAccepted,
}) => {
    const [file, setFile] = React.useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const selected = acceptedFiles[0];
                setFile(selected);
                onFileAccepted(selected);
                toast.success("File accepted");
            }
        },
        [onFileAccepted],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
            <input {...getInputProps()} />
            {file ? (
                <p>Selected: {file.name}</p>
            ) : isDragActive ? (
                <p>Drop the file here ...</p>
            ) : (
                <p>Drag 'n' drop a file here, or click to select file</p>
            )}
        </div>
    );
};

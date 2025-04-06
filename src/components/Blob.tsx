import React, { SetStateAction, useRef, useState } from 'react'
import { toast } from "sonner";
import { Button } from './ui/button';
import { FormTeamType, FormProjectType, FormActivityType, FormEventType, ImageObjectType, HeroType, ImageType, FormResourceType } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { FileImage, Upload, X } from 'lucide-react';
import { ImageData } from '@/types';

interface BlobProps {
    id?: string;
    onChange?: ((value: SetStateAction<FormProjectType>) => void) | ((value: SetStateAction<FormTeamType>) => void) | ((value: SetStateAction<FormActivityType>) => void) | ((value: SetStateAction<FormEventType>) => void) | ((value: SetStateAction<ImageObjectType>) => void) | ((value: SetStateAction<HeroType>) => void) | ((value: SetStateAction<string>) => void) | ((value: SetStateAction<FormResourceType>) => void);
    setFileName?: (value: SetStateAction<string>) => void;
    uploadCallback?: () => void;
    setData?: (value: SetStateAction<string>) => void;
};

const Blob = ({ id, onChange, setFileName, uploadCallback, setData }: BlobProps) => {
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.match('image.*')) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                if (setFileName) {
                    setFileName(file.name);
                }
                if (onChange && id) {
                    onChange((prev: any) => ({ ...prev, [id]: event.target?.result as string }));
                }

                if (setData) {
                    setData(event.target?.result as string);
                }

                setImageData({
                    name: file.name,
                    base64: event.target?.result as string
                });

                toast.success(`Image "${file.name}" loaded successfully`);
            }
        };
        reader.onerror = () => {
            toast.error("Error reading file");
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImageData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleBrowseClick = () => {
        console.log("doing something");
        console.log(imageData);
        fileInputRef.current?.click();
    };

    const handleCallbacks = () => {
        uploadCallback ? uploadCallback() : handleBrowseClick();
        clearImage();
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            {!imageData ? (
                <Card
                    className={`border-2 border-dashed ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                        } transition-colors duration-200`}
                >
                    <CardContent className="p-6">
                        <div
                            className="flex flex-col items-center justify-center min-h-[300px] cursor-pointer"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleBrowseClick}
                        >
                            <Upload size={48} className="text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
                            <p className="text-muted-foreground text-sm text-center mb-4">
                                Drag & drop an image here, or click to browse
                            </p>
                            <Button variant="secondary">Browse Files</Button>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileImage size={20} />
                                Image Blob Viewer
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={clearImage}>
                                <X size={18} />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium">File Name:</p>
                            <p className="text-sm bg-muted p-2 rounded">{imageData.name}</p>
                        </div>

                        <div className="overflow-hidden rounded-md border bg-white flex justify-center">
                            <img
                                src={imageData.base64}
                                alt={imageData.name}
                                className="object-contain max-h-[300px] w-auto"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end p-4">
                        <Button onClick={handleCallbacks}>
                            Upload New Image
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Blob;
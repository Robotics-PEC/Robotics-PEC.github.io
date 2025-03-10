import React, { SetStateAction, useRef, useState } from 'react'
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Project } from '@/types';

const Blob = ({ id, onChange, setFileName }: { id: string, onChange: (value: SetStateAction<Project>) => void, setFileName: (value: SetStateAction<string>) => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check if the file is an image
        if (!file.type.match('image.*')) {
            toast({
                title: "Invalid file type",
                description: "Please select an image file",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target?.result as string;
            onChange(prev => ({ ...prev, [id]: result }));
            setFileName(file.name);
            setIsLoading(false);
            toast({
                title: "Success!",
                description: "Image successfully converted to base64",
            });
        };

        reader.onerror = () => {
            setIsLoading(false);
            toast({
                title: "Error",
                description: "Failed to read the image file",
                variant: "destructive",
            });
        };

        reader.readAsDataURL(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <Button
                onClick={handleButtonClick}
                className="w-full mb-4"
                disabled={isLoading}
            >
                {isLoading ? "Converting..." : "Select Image"}
            </Button>
        </div>
    )
}

export default Blob;
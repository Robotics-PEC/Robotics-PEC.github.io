import { SetStateAction } from "react";

export interface ImageData {
    name: string;
    base64: string;
};

export interface ProjectType {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    category: string;
    technologies: string[];
    image: string;
};

export interface EventType {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: number;
};

export interface ActivityType {
    id: string;
    title: string;
    description: string;
    date: string;
    participants: number;
};

export interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    image: string;
};

export interface PublicUrlType {
    name: string;
    url: string;
};

interface FormTeamType {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    image: string;
};

export interface FormProjectType {
    id: string;
    title: string;
    description: string;
    image: string;
    longDescription: string;
    category: string;
    technologies: string;
};

export interface FormFieldProps {
    htmlFor: string;
    title: string;
    id: string;
    onChange: ((value: SetStateAction<FormProjectType>) => void) | ((value: SetStateAction<FormTeamType>) => void);
    placeholder: string;
    value: string;
    type: "BLOB" | "TEXT" | "IMAGE" | "MARKDOWN"
    setFileName?: (value: SetStateAction<string>) => void;
    imageData?: { name: string, base64: string };
};


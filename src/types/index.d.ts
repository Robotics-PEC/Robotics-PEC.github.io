import { SetStateAction } from "react";

export interface ProjectType {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    category: string;
    technologies: string[];
    image: string;
};

export interface EventType {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: number;
};

export interface ActivityType {
    id: numeber;
    title: string;
    description: string;
    date: string;
    participants: number;
};

export interface TeamMember {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    image: string;
};

export interface PublicUrlType {
    name: string;
    url: string;
};

export interface Project {
    id: number | null;
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
    onChange: (value: SetStateAction<Project>) => void;
    placeholder: string;
    value: string;
    type: "BLOB" | "TEXT" | "IMAGE" | "MARKDOWN"
    setFileName?: (value: SetStateAction<string>) => void;
}
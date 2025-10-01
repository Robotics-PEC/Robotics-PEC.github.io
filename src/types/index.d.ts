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

export interface CategoryTeamMember {
    category: string;
    team: TeamMember[];
}

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
    category: string;
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

export interface FormResourceType {
    id: string;
    name: string;
    url: string;
};

export interface FormActivityType {
    id: string;
    title: string;
    longDescription: string;
    shortDescription: string;
    date: string | undefined;
    participants: string;
};

export interface FormEventType {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: string;
};

export interface BlogUserType {
    sid: string;
    name: string;
    branch: string;
    bio: string;
    content: string;
    image: string;
};

export interface FormFieldProps {
    htmlFor: string;
    title: string;
    id: string;
    onChange: ((value: SetStateAction<FormProjectType>) => void) | ((value: SetStateAction<FormTeamType>) => void) | ((value: SetStateAction<FormActivityType>) => void) | ((value: SetStateAction<FormEventType>) => void) | ((value: SetStateAction<HeroType>) => void) | ((value: SetStateAction<string>) => void) | ((value: SetStateAction<FormResourceType>) => void) | ((value: any) => void);
    placeholder: string;
    value: string | Date | undefined;
    type: "BLOB" | "TEXT" | "IMAGE" | "MARKDOWN" | "DATE" | "TIME" | "CATEGORY";
    setFileName?: (value: SetStateAction<string>) => void;
    imageData?: { name: string, base64: string };
    date?: Date | undefined;
    setDate?: (date: Date | undefined) => void;
};

export interface HeroType {
    heading: string;
    description: string;
};

export interface ImageObjectType {
    image1: string;
    image2: string;
    image3: string;
};

export interface ImageType {
    name: "";
    src: ""
};

export interface RepoType {
    name: string;
    url: string;
};

export interface TeamData {
    leader: any[],
    website: any[],
    mechanical: any[],
    electrical: any[],
    software: any[],
    length: number,
    emptyArrays: number;
    [key: string]: any;
};

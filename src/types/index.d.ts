export interface ProjectType {
    id: number;
    title: string;
    description: string;
    image: string;
    longDescription: string;
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
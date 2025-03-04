import { ActivityType, EventType, ProjectType } from "@/types";

export const projects: ProjectType[] = [
    {
        id: 1,
        title: "CanSat",
        description: "CanSat by AAS is a mini satellite competition for educational purposes",
        image: "/projects/cansat.jpg"
    },
    {
        id: 2,
        title: "Robo Wars",
        description: "Robo Wars is a combat competition where robots fight for victory.",
        image: "/projects/robowars.jpg"
    },
    {
        id: 3,
        title: "Robotic Arm",
        description: "A mechanical arm mimicking human motion for automation and precision tasks.",
        image: "/projects/roboticarm.jpg"
    }
];

export const upcomingEvents: EventType[] = [
];

export const activities: ActivityType[] = [
    {
        id: 1,
        title: "Getting started with Git and Docker",
        description: "A introductory workshop on basics of Git and Docker with a little of C programming",
        date: "05/09/2024",
        participants: 60
    },
    {
        id: 2,
        title: "Introduction to CAD",
        description: "A introductory workshop on basics of CAD",
        date: "22/10/2024",
        participants: 55
    },
    {
        id: 3,
        title: "Python Programming for Machine Learning",
        description: "Introduction to Machine Learning using Python",
        date: "28/12/2024",
        participants: 60
    },
];
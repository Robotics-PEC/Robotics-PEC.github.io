import { ActivityType, EventType } from "@/types";

export const upcomingEvents: EventType[] = [
    {
        id: 1,
        title: "Building from Scratch",
        description: "A hands-on event to help participants take the first step toward creating something amazing. Whether you have an idea or just want to build, this event will guide you in getting started.",
        date: "2025-03-06",
        time: "17:00",
        location: "L26-27, New Academic Block",
        capacity: 100,
    }
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

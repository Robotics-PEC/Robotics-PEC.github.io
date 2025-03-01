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
    {
        id: 1,
        title: "Test Event",
        description: "This is a test event",
        date: "10/10/2010",
        time: "10:00 AM",
        location: "L-20",
        capacity: 1000
    }
];

export const activities: ActivityType[] = [
    {
        id: 1,
        title: "Robotics Workshop 2024",
        description: "Hands-on workshop on building autonomous robots",
        date: "March 15, 2024",
        participants: 50
    },
    {
        id: 2,
        title: "AI in Robotics Seminar",
        description: "Expert talk on integrating AI with robotics",
        date: "April 2, 2024",
        participants: 75
    },
    {
        id: 3,
        title: "Robotics Competition",
        description: "Annual inter-university robotics competition",
        date: "May 10, 2024",
        participants: 100
    }
];
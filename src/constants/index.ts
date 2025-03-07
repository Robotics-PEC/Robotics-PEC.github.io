import { ActivityType, EventType, ProjectType, TeamMember } from "@/types";

export const projects: ProjectType[] = [
    {
        id: 1,
        title: "CanSat",
        description: "CanSat by AAS is a mini satellite competition for educational purposes",
        image: "/projects/cansat.jpg",
        longDescription: "The CanSat competition by the American Astronautical Society (AAS) is an annual student design-build-launch competition that challenges teams to develop a small satellite system within a soda can-sized container. Participants must design a payload capable of executing a specific mission, including telemetry transmission, deployment mechanisms, and sensor data collection during descent. The competition simulates a real satellite mission, incorporating constraints on size, weight, and functionality. It fosters skills in engineering, programming, and teamwork while providing hands-on aerospace experience. CanSat is an excellent platform for students to gain practical knowledge in space technology and systems engineering.",
        category: "Aerospace",
        technologies: ["Telemetry", "Sensors", "Embedded Systems"]
    },
    {
        id: 2,
        title: "Robo Wars",
        description: "Robo Wars is a combat competition where robots fight for victory.",
        image: "/projects/robowars.jpg",
        longDescription: "Robo Wars is a thrilling combat robotics competition where teams design, build, and battle remote-controlled robots in an enclosed arena. The objective is to disable opponents using weapons, strategy, and durability while adhering to weight and safety regulations. These battles test engineering skills, innovation, and teamwork as participants develop robots with powerful weaponry like spinners, flippers, and hammers. Popular worldwide, Robo Wars fosters STEM learning by encouraging mechanical design, electronics, and programming. Events range from university contests to global championships, captivating audiences with intense robot duels. The competition showcases cutting-edge technology and pushes the boundaries of robotic combat engineering.",
        category: "Combat Robotics",
        technologies: ["Mechanical Design", "Electronics", "Remote Control"]
    },
    {
        id: 3,
        title: "Robotic Arm",
        description: "A mechanical arm mimicking human motion for automation and precision tasks.",
        image: "/projects/roboticarm.jpg",
        longDescription: "A robotic arm is a programmable mechanical device designed to mimic the movements of a human arm. It consists of interconnected segments, joints, and actuators that enable precise motion and manipulation of objects. Controlled via computers, sensors, or AI, robotic arms are widely used in industries such as manufacturing, healthcare, and space exploration. They perform tasks like welding, assembly, surgery, and material handling with high accuracy and efficiency. Advanced models incorporate machine learning and vision systems for autonomous operation. Robotic arms enhance productivity, reduce human effort in hazardous environments, and play a crucial role in automation and modern robotics.",
        category: "Automation",
        technologies: ["AI", "Control Systems", "Sensors"]
    }
];

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

export const teamMembers: TeamMember[] = [
    {
        id: 1,
        firstName: "Lalit",
        lastName: "Kumar",
        role: "Secretary",
        image: "/team/lalitsir.png"
    },
    {
        id: 2,
        firstName: "Shashank",
        lastName: "Agarwal",
        role: "Joint Secretary",
        image: "/team/shashanksir.jpg"
    },

];
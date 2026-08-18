export type TeamMemberDetails = {
  role: string;
  description: string;
  location?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;

  };
};

// Controls the exact order cards render in on the Team page.
// Add a name here to place it — anyone not listed falls to the end,
// sorted alphabetically.
export const teamOrder: string[] = [
  "Kartavya Bang",
  "Shreyas Vij",
  "Dhairya Sood",
  "Manav Kohli",
  "Ansh Agnihotry",
];

export const teamDetails: Record<string, TeamMemberDetails> = {
  "Kartavya Bang": {
    role: "Faculty Advisor",
    description:
      "Guides the team with his experience, mentorship and vision while helping us build innovative robotics projects.",
    location: "ELECTRONICS AND COMMUNICATION",
    socials: {
      linkedin: "https://www.linkedin.com/in/kartavya-bang-0b5ba9288/",
      github: "http://github.com/BangKartavya",

    },
  },

  "Shreyas Vij": {
    role: "Technical Lead",
    description: "Works on everything expect robotics",
    location: "ELECTRONICS AND COMMUNICATION",
    socials: {
      linkedin: "https://www.linkedin.com/in/shreyas-vij-07b541328/",
      github: "https://github.com/ShreyasVij",

    },
  },

  "Dhairya Sood": {
    role: "Add role here",
    description:
      "Works on robotics and ROS. Reliable hotspot provider. Password- 1234567889",
    location: "ELECTRONICS AND COMMUNICATION",
    socials: {
      linkedin: "https://www.linkedin.com/in/dhairya-sood/",
      github: "https://github.com/DhairyaSood",

    },
  },

  "Manav Kohli": {
    role: "Add role here",
    description:
      "Works on robotics and this site. His jokes may not be funny, but they may have funny consequences.",
    location: "ELECTRICAL",
    socials: {
      linkedin: "https://www.linkedin.com/in/manav-kohli/",
      github: "https://github.com/Mysterious-Wizard",

    },
  },

  "Ansh Agnihotry": {
    role: "Add role here",
    description:
      "Works on robotics, embedded systems. Trying to guess his password? Just start with Hitler",
    location: "PRODUCTION",
    socials: {
      linkedin: "https://www.linkedin.com/in/ansh-agnihotry-b12145204/",
      github: "https://github.com/anshagnihotry258",

    },
  },
};
export type TeamMemberDetails = {
  role: string;
  description: string;
  location?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
};

export const teamDetails: Record<string, TeamMemberDetails> = {
  "Kartavya ": {
    role: "Faculty Advisor",
    description:
      "Guides the team with his experience, mentorship and vision while helping us build innovative robotics projects.",
    location: "ELECTRONICS AND COMMUNICATION",
    socials: {
      linkedin: "#",
    },
  },

  "Shreyas Vij": {
    role: "Technical Lead",
    description:
      "Works on everything expect robotics ",
    location: "ELECTRONICS AND COMMUNICATION",
    socials: {
      linkedin: "https://www.linkedin.com/in/shreyas-vij-07b541328/",
    },
  },
    "Dhairya Sood": {
    role: "Add role here",
    description: "Works on robotics and ROS. Reliable hotspot provider. Password- 1234567889",
    location: "ELECTRONICS AND COMMUNICATION",
    socials: {
      linkedin: "https://www.linkedin.com/in/dhairya-sood/",
    },
  },


  "Manav Kohli": {
    role: "Add role here",
    description: "Works on robotics and this site. Joined ACM. Made one joke. Became a former member. ",
    location: "ELECTRICAL",
    socials: {
      linkedin: "https://www.linkedin.com/in/manav-kohli/",
    },
  },

  "Ansh Agnihotry": {
    role: "Add role here",
    description: "Works on robotics, embedded systems. Trying to guess his password? Just start with Hitler",
    location: "PRODUCTION",
    socials: {
      linkedin: "https://www.linkedin.com/in/ansh-agnihotry-b12145204/",
    },
  },

};
import Hero from "@/components/Hero";
import Team from "@/components/Team";
import PageHead from "@/components/PageHead";
import PageLayout from "@/components/PageLayout";

import { useState, useEffect } from "react";
import { ProjectType, TeamMember } from "@/types";
import { getProjects } from "@/lib/supabase/actions/project.actions";
import { getTeamMembers } from "@/lib/supabase/actions/team.actions";
import { Loader } from "@/components/Loader";
import { ProjectSection } from "@/pages/project/index";

const Index = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);


  const handleClick = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {

    const fetch = async () => {
      const teamData = await getTeamMembers();
      const projectsData = await getProjects();
      setTeamMembers(teamData);
      setProjects(projectsData);
      setLoading(false);
    };

    fetch();
  }, []);

  return (
    <>
      {
        loading ? (
          <div className="flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen">
            <Loader size="lg" variant="spinner" />
            <span className="mt-4 font-medium">Loading...</span>
          </div>
        ) :
          <PageLayout>

            <PageHead
              title="Robotics Society | Punjab Engineering College"
              description="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."
            />

            {/* Hero Section */}
            <Hero handleClick={handleClick} />

            {/* Projects Section */}
            <ProjectSection projects={projects} />

            {/* Team Section */}
            <Team teamMembers={teamMembers} />
          </PageLayout>

      }
    </>
  );
};

export default Index;
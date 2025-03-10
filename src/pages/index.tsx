import Hero from "@/components/Hero";
import Team from "@/components/Team";
import PageHead from "@/components/layout/PageHead";
import PageLayout from "@/components/layout/PageLayout";

import { useState, useEffect } from "react";
import { ProjectType, TeamMember } from "@/types";
import { getProjects } from "@/lib/supabase/actions/project.actions";
import { getTeamMembers } from "@/lib/supabase/actions/team.actions";
import { Loader } from "@/components/layout/Loader";
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
    <Loader isLoading={loading}>
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
    </Loader>
  );
};

export default Index;
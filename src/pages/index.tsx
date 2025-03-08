import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { ProjectType, TeamMember } from "@/types";
import { getProjects } from "@/lib/supabase/actions/project.actions";
import { getTeamMembers } from "@/lib/supabase/actions/team.actions";
import { Loader } from "@/components/Loader";

import Hero from "@/components/Hero";
import Team from "@/components/Team";
import ProjectSection from "@/components/ProjectSection";

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
          <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
            <Head>
              <title>Robotics Society | Punjab Engineering College</title>
              <link rel="icon" href="/favicon.png" />
              <meta name="description" content="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team." />
              <meta name="keywords" content="PEC Robotics, Punjab Engineering College, Robotics Society, Innovation, Automation, Engineering Projects" />
              <meta name="author" content="PEC Robotics Society" />
              <meta property="og:title" content="PEC Robotics Society - Punjab Engineering College" />
              <meta property="og:description" content="Discover groundbreaking robotics projects and cutting-edge automation innovations at PEC Robotics Society." />
              <meta property="og:image" content="/images/robotics-banner.jpg" />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://roboticspec.com" />
              <link rel="canonical" href="https://roboticspec.com" />
            </Head>
            <Header />
            <main className="flex-grow">
              {/* Hero Section */}
              <Hero handleClick={handleClick} />

              {/* Projects Section */}
              <ProjectSection projects={projects} />

              {/* Team Section */}
              <Team teamMembers={teamMembers} />

            </main>
            <Footer />
          </div >

      }
    </>
  );
};

export default Index;
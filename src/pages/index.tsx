import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
              <section className="py-24" id="projects">
                <div className="container mx-auto px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                  >
                    <div className="text-center mb-16">
                      <h2 className="text-4xl font-bold mb-4">Our Projects</h2>
                      <p className="text-gray-600">Innovative solutions for tomorrow's challenges</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <ProjectCard projects={projects} />
                    </div>
                  </motion.div>
                </div>
              </section>

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
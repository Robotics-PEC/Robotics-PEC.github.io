import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Bot, Users, Mail } from "lucide-react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { ProjectType, TeamMember } from "@/types";
import Image from "next/image";
import { getTeamMembers } from "@/lib/supabase/actions/team.actions";
import { getProjects } from "@/lib/supabase/actions/project.actions";
import { Loader } from "@/components/Loader";

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
              <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-dark-gray">
                      PEC Robotics Society
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                      Pushing the boundaries of innovation through robotics and automation
                    </p>
                    <Button
                      className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105"
                      onClick={handleClick}
                    >
                      Explore Our Projects <ChevronRight className="ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </section>

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
              <section className="py-24" id="team">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our Team</h2>
                    <p className="text-gray-600">Meet the minds behind the innovation</p>
                  </div>
                  {
                    teamMembers.length >= 4 ?
                      (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                          {teamMembers?.map((member: TeamMember, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4 }}
                              className="glass-card p-6 text-center"
                            >
                              <div className="relative w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4">
                                <Image
                                  src={member.image}
                                  alt={member.firstName}
                                  fill
                                  className="object-contain rounded-[50px]"
                                />
                              </div>
                              <p className="text-gray-600">Name : {member.firstName} {member.lastName}</p>
                              <p className="text-gray-600">Role : {member.role}</p>
                            </motion.div>
                          ))}
                        </div>
                      )
                      :
                      (
                        <div className="flex justify-center gap-8">
                          {teamMembers?.map((member: TeamMember, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4 }}
                              className="glass-card p-6 text-center"
                            >
                              <div className="relative w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4">
                                <Image
                                  src={member.image}
                                  alt={member.firstName}
                                  fill
                                  className="object-contain rounded-[50px]"
                                />
                              </div>
                              <p className="text-gray-600">Name : {member.firstName} {member.lastName}</p>
                              <p className="text-gray-600">Role : {member.role}</p>
                            </motion.div>
                          ))}
                        </div>
                      )
                  }
                </div>
              </section>

            </main>
            <Footer />
          </div >

      }
    </>
  );
};

export default Index;
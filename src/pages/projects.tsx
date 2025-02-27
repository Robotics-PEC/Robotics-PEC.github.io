
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Projects = () => {
  const [bookmarkedProjects, setBookmarkedProjects] = useState<number[]>([]);

  const projects = [
    {
      id: 1,
      title: "Autonomous Robot",
      description: "Self-navigating robot with advanced AI capabilities",
      image: "robot1.jpg"
    },
    {
      id: 2,
      title: "Drone System",
      description: "Custom-built drone with precision control",
      image: "drone.jpg"
    },
    {
      id: 3,
      title: "Smart Arm",
      description: "Robotic arm with machine learning integration",
      image: "arm.jpg"
    }
  ];

  const toggleBookmark = (id: number) => {
    setBookmarkedProjects(prev =>
      prev.includes(id)
        ? prev.filter(projectId => projectId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
      <Head>
        <title>Robotics Society | Punjab Engineering College</title>
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
      <main className="flex-grow py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
            <p className="text-gray-600">Discover our innovative robotics projects</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-card overflow-hidden">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(project.id)}
                      >
                        {bookmarkedProjects.includes(project.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-blue-500" />
                        ) : (
                          <BookmarkPlus className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;

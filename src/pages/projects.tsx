
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { projects } from "@/constants";
import ProjectCard from "@/components/ProjectCard";

const Projects = () => {


  return (
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
      <main className="flex-grow py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
            <p className="text-gray-600">Discover our innovative robotics projects</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;

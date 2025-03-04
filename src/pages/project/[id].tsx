import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { projects } from '@/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProjectPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const project = projects.find((p) => p.id === Number(id));

    const handleClick = () => {
        router.push("/#projects");
    };

    const prev = () => {
        let prevId = Number(id) - 1;
        if (prevId === 0) {
            prevId = projects.length;
        }
        router.push(`/project/${prevId}`);
    };

    const next = () => {
        let nextId = Number(id) + 1;
        if (nextId > projects.length) {
            nextId = 1;
        }
        router.push(`/project/${nextId}`);
    };

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
            {project ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-24 pb-16"
                    >
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col items-center mb-12">
                                <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-gray-100 text-gray-800">
                                    {project.category}
                                </span>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-center max-w-3xl mb-5">
                                    {project.title}
                                </h1>
                                <p className="text-xl text-gray-600 text-center max-w-2xl">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 mt-6">
                                    {project.technologies?.map((tech, index) => (
                                        <span key={index} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="relative rounded-xl overflow-hidden aspect-video mb-16 subtle-shadow">
                                <Image src={project.image} alt={project.title} fill className="object-cover" />
                            </div>
                            <div className="max-w-3xl mx-auto mb-16">
                                <h2 className="text-2xl font-medium mb-6">About this project</h2>
                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    {project.longDescription}
                                </p>
                            </div>
                            <div className="flex justify-between items-center max-w-5xl mx-auto mt-20">
                                <Button onClick={prev} className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105">
                                    <ChevronLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                                    <span>Previous</span>
                                </Button>
                                <Link href="/projects">
                                    <Button variant="outline" className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105">
                                        View all projects
                                    </Button>
                                </Link>
                                <Button onClick={next} className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105">
                                    <span>Next</span>
                                    <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            ) : (
                <div className="text-center mb-16 py-10">
                    <h1 className="text-4xl font-bold mb-4">Incorrect Project ID</h1>
                    <Button className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105" onClick={handleClick}>
                        Explore Our Projects <ChevronRight className="ml-2" />
                    </Button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default ProjectPage;
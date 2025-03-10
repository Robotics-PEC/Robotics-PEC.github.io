"use client";

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ProjectType } from '@/types';
import { getProjectById, getProjects } from '@/lib/supabase/actions/project.actions';
import { Loader } from '@/components/Loader';
import { set } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import PageHead from '@/components/PageHead';
import PageLayout from '@/components/PageLayout';

const ProjectPage = () => {
    const router = useRouter();
    const id = Number(router.query.id);
    const isMobile: boolean = useIsMobile();
    const [project, setProject] = useState<ProjectType>();
    const [projectsLength, setProjectsLength] = useState(0);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        const fetch = async () => {
            if (router.isReady) {
                const data = await getProjectById(id);
                const length = (await getProjects()).length;
                data.technologies = data.technologies.split(",");
                setProject(data);
                setProjectsLength(length);
                setLoading(false);
            }
        }
        fetch();
    }, [router.isReady, router.query]);

    const handleClick = () => {
        router.push("/#projects");
    };

    const prev = () => {
        let prevId = id - 1;
        if (prevId === 0) {
            prevId = projectsLength;
        }
        router.push(`/project/${prevId}`);
    };

    const next = () => {
        let nextId = id + 1;
        if (nextId > projectsLength) {
            nextId = 1;
        }
        router.push(`/project/${nextId}`);
    };

    return (
        <>
            {
                loading ? (
                    <div className="flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen">
                        <Loader size="lg" variant="spinner" />
                        <span className="mt-4 font-medium">Loading...</span>
                    </div>
                ) : (
                    <PageLayout>
                        <PageHead
                            title='title>Robotics Society | Punjab Engineering College'
                            description='PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team.'
                        />
                        {
                            project ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="pt-20 pb-10 px-4 sm:px-6"
                                    >
                                        <div className="container mx-auto">
                                            <div className="flex flex-col items-center mb-8">
                                                <span className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                                                    {project.category}
                                                </span>
                                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center max-w-3xl mb-3">
                                                    {project.title}
                                                </h1>
                                                <p className="text-base sm:text-lg text-gray-600 text-center max-w-2xl">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                                    {project.technologies?.map((tech, index) => (
                                                        <span key={index} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative rounded-xl overflow-hidden aspect-video mb-12 shadow-lg">
                                                <Image src={project.image} alt={project.title} fill className="object-cover" />
                                            </div>
                                            <div className="max-w-3xl mx-auto mb-12 px-4 sm:px-0">
                                                <h2 className="text-xl sm:text-2xl font-medium mb-4">About this project</h2>
                                                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                                    {project.longDescription}
                                                </p>
                                            </div>
                                            <div className="flex flex-nowrap justify-center sm:justify-between items-center max-w-5xl mx-auto gap-2 mt-12 overflow-hidden">
                                                <Button
                                                    onClick={prev}
                                                    className="w-full sm:w-auto max-w-[110px] px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base  text-white flex items-center justify-center whitespace-nowrap"
                                                >
                                                    <ChevronLeft size={12} className="mr-1 sm:mr-2" />
                                                    <span>Previous</span>
                                                </Button>

                                                <Button
                                                    onClick={() => router.push("/projects")}
                                                    className="w-full sm:w-auto max-w-[140px] px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base  text-white flex items-center justify-center whitespace-nowrap"
                                                >
                                                    View all
                                                </Button>

                                                <Button
                                                    onClick={next}
                                                    className="w-full sm:w-auto max-w-[110px] px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base  text-white flex items-center justify-center whitespace-nowrap"
                                                >
                                                    <span>Next</span>
                                                    <ChevronRight size={12} className="ml-1 sm:ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="text-center mb-12 py-10">
                                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Incorrect Project ID</h1>
                                    <Button className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full  text-white transition-all duration-300 ease-in-out hover:scale-105" onClick={handleClick}>
                                        Explore Our Projects <ChevronRight className="ml-2" />
                                    </Button>
                                </div>
                            )
                        }
                    </PageLayout>
                )
            }
        </>
    );
};

export default ProjectPage;

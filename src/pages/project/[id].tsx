import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ProjectType } from '@/types';
import { getProjectById, getProjects } from '@/lib/supabase/actions/project.actions';
import { Loader } from '@/components/layout/Loader';
import PageHead from '@/components/layout/PageHead';
import PageLayout from '@/components/layout/PageLayout';
import ReactMarkdown from "react-markdown";
import { htmlToMarkdown } from '@/lib/utils';

const ProjectPage = () => {
    const router = useRouter();
    const id = router.query.id as string;
    const [project, setProject] = useState<ProjectType>();
    const [projectsLength, setProjectsLength] = useState(0);
    const [totalProjects, setTotalProjects] = useState<ProjectType[]>([]);
    let index = 0;
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        const fetch = async () => {
            if (router.isReady) {
                const data = await getProjectById(id);
                const totalProjectsData = await getProjects();
                const length = (totalProjectsData).length;
                data.technologies = data.technologies.split(",");
                setProject(data);
                setProjectsLength(length);
                setTotalProjects(totalProjectsData);
                setLoading(false);
            }
        }
        fetch();
    }, [router.isReady, router.query]);



    for (let i = 0; i < projectsLength; i++) {
        if (totalProjects[i].id == project?.id) {
            index = i;
            break;
        }
    }

    const handleClick = () => {
        router.push("/#projects");
    };

    const prev = () => {
        let prevId = index - 1;
        if (prevId === 0) {
            prevId = projectsLength - 1;
        }
        router.push(`/project/${totalProjects[prevId].id}`);
    };

    const next = () => {
        let nextId = index + 1;
        if (nextId >= projectsLength) {
            nextId = 0;
        }
        router.push(`/project/${totalProjects[nextId].id}`);
    };

    return (
        <Loader isLoading={loading}>
            <PageLayout>
                <PageHead
                    title="Robotics Society | Punjab Engineering College"
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
                                        <p className="sm:text-lg prose">
                                            <ReactMarkdown>{htmlToMarkdown(project.longDescription)}</ReactMarkdown>
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
        </Loader>
    );
};

export default ProjectPage;

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { projects } from '@/constants';
import { ChevronRight } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react'

const ProjectPage = () => {

    const router = useRouter();
    const { id } = router.query;
    const project = projects[Number(id) - 1];

    const handleClick = () => {
        router.push("/#projects");
    }

    const prev = () => {
        let prevId = Number(id) - 1;

        if (prevId == 0) {
            prevId = projects.length;
        }
        router.push(`/project/${prevId}`);
    }

    const next = () => {
        let nextId = Number(id) + 1;

        if (nextId > projects.length) {
            nextId = 1;
        }

        router.push(`/project/${nextId}`);
    }

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
            {project ?
                <main className="flex-grow py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                            <p className="text-gray-600">{project.description}</p>
                        </div>
                    </div>
                    <div className="relative aspect-video bg-gray-100 px-10 py-10">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="text-center mt-10 mb-16">
                        <p className="text-2xl text-gray-600">{project.longDescription}</p>
                    </div>
                </main>
                : (
                    <div className="text-center mb-16 py-10">
                        <h1 className="text-4xl font-bold mb-4">Incorrect Project ID</h1>
                        <Button
                            className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105"
                            onClick={handleClick}
                        >
                            Explore Our Projects <ChevronRight className="ml-2" />
                        </Button>
                    </div>
                )
            }
            <div className="flex flex-row justify-between">
                <Button onClick={prev} className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105">
                    Prev
                </Button>
                <Button onClick={next} className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105">
                    Next
                </Button>
            </div>
            <Footer />
        </div >
    )
}

export default ProjectPage;
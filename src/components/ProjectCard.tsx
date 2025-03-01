import { projects } from '@/constants'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Card } from './ui/card'
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import Image from 'next/image'
import { Button } from './ui/button'

const ProjectCard = () => {
    const [bookmarkedProjects, setBookmarkedProjects] = useState<number[]>([]);

    const toggleBookmark = (id: number) => {
        setBookmarkedProjects(prev =>
            prev.includes(id)
                ? prev.filter(projectId => projectId !== id)
                : [...prev, id]
        );
    };
    return (
        projects.map((project) => (
            <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="glass-card overflow-hidden">
                    <div className="relative aspect-video bg-gray-100">
                        <Image

                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-contain"
                        />
                    </div>
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
        ))
    )
}

export default ProjectCard
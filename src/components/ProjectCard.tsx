import { motion } from 'framer-motion'
import { Card } from './ui/card'
import Image from 'next/image'
import Link from 'next/link';
import { ProjectType } from '@/types';

const ProjectCard = ({ projects }: { projects: ProjectType[] }) => {
    return (
        projects.map((project) => (
            <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >

                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                >
                    <Link href={`/project/${project.id}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
                                </div>
                                <p className="text-gray-600">{project.description}</p>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            </motion.div >
        ))
    )
}

export default ProjectCard
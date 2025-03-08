import ProjectCard from "./ProjectCard";
import { ProjectType } from "@/types";

const ProjectSection: React.FC<{ projects: ProjectType[] }> = ({ projects }) => {
    return (
        <section className="py-24" id="projects">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
                    <p className="text-gray-600">Discover our innovative robotics projects</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ProjectCard projects={projects} />
                </div>
            </div>
        </section>
    );
}

export default ProjectSection;
import { useEffect, useState } from "react";
import { ProjectType } from "@/types";
import { getProjects } from "@/lib/supabase/actions/project.actions";
import { Loader } from "@/components/Loader";
import PageHead from "@/components/PageHead";
import PageLayout from "@/components/PageLayout";
import PageSection from "@/components/PageSection";
import ProjectCard from "@/components/ProjectCard";

const ProjectSection: React.FC<{ projects: ProjectType[] }> = ({ projects }) => {
  return (
    <section className="py-24" id="projects">
      <PageSection
        title="Our Projects"
        subtitle="Discover our innovative robotics projects"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard projects={projects} />
        </div>
      </PageSection>
    </section>
  );
}


const Projects = () => {

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetch();
  }, []);


  return (
    <>
      {
        loading ? (
          <div className="flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen" >
            <Loader size="lg" variant="spinner" />
            <span className="mt-4 font-medium">Loading...</span>
          </div>
        ) : (
          <PageLayout>
            <PageHead
              title="Robotics Society | Punjab Engineering"
              description="Projects made by Robotics Society, Punjab Engineering College"
            />
            <ProjectSection projects={projects} />
          </PageLayout>
        )
      }
    </>
  );
};

export default Projects;
export { ProjectSection };

import { useEffect, useState } from "react";
import { ProjectType } from "@/types";
import { getProjects } from "@/lib/supabase/actions/project.actions";
import { Loader } from "@/components/layout/Loader";
import PageHead from "@/components/layout/PageHead";
import PageLayout from "@/components/layout/PageLayout";
import PageSection from "@/components/layout/PageSection";
import ProjectCard from "@/pages/project/components/ProjectCard";

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
    <Loader isLoading={loading}>
      <PageLayout>
        <PageHead
          title="Robotics Society | Punjab Engineering"
          description="Projects made by Robotics Society, Punjab Engineering College"
        />
        <ProjectSection projects={projects} />
      </PageLayout>
    </Loader>
  );
};

export default Projects;
export { ProjectSection };

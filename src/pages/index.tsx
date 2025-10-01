import Hero from "@/components/Hero";
import Team from "@/components/Team";
import PageHead from "@/components/layout/PageHead";
import PageLayout from "@/components/layout/PageLayout";

import { useState, useEffect } from "react";
import { ProjectType, TeamData } from "@/types";
import { getProjects } from "@/lib/supabase/actions/project.actions";
import { getTeamMembersByCategory } from "@/lib/supabase/actions/team.actions";
import { Loader } from "@/components/layout/Loader";
import { ProjectSection } from "@/pages/project/index";
import { teamCategoryOptions } from "@/lib/utils";

const Index = () => {
    const defaultData: TeamData = {
        leader: [],
        website: [],
        mechanical: [],
        electrical: [],
        software: [],
        length: 0,
        emptyArrays: 5
    };

    const [teamMembers, setTeamMembers] = useState<TeamData>(defaultData);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);


    const handleClick = () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        const teamData: TeamData = {
            leader: [],
            website: [],
            mechanical: [],
            electrical: [],
            software: [],
            length: 0,
            emptyArrays: 5
        };
        const fetch = async () => {
            for (let i = 0; i < teamCategoryOptions.length; i++) {
                const data = await getTeamMembersByCategory(teamCategoryOptions[i].value);
                if (data.length != 0) {
                    teamData.emptyArrays--;
                }
                teamData[teamCategoryOptions[i].value] = teamData[teamCategoryOptions[i].value].concat(data);
                teamData.length += data.length;
            }


            const projectsData = await getProjects();
            setTeamMembers(teamData);
            setProjects(projectsData);
            setLoading(false);
        };

        fetch();
    }, []);

    return (
        <Loader isLoading={loading}>

            <PageHead
                title="Robotics Society | Punjab Engineering College"
                description="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."
            />

            {/* Hero Section */}
            <Hero handleClick={handleClick} />

            {/* Projects Section */}
            <ProjectSection projects={projects} />

            {/* Team Section */}
            <Team teamMembers={teamMembers} />
        </Loader>
    );
};

export default Index;

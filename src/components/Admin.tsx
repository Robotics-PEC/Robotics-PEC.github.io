import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Home, FileText, Calendar, Users, ExternalLink, Book } from "lucide-react";
import HeroEditor from "@/pages/admin/components/HeroEditor";
import ProjectsEditor from "@/pages/admin/components/ProjectsEditor";
import ActivitiesEditor from "@/pages/admin/components/ActivitiesEditor";
import EventsEditor from "@/pages/admin/components/EventsEditor";
import TeamEditor from "@/pages/admin/components/TeamEditor";
import PageHead from "./layout/PageHead";
import PageSection from "./layout/PageSection";
import ResourceEditor from "@/pages/admin/components/ResourceEditor";
import BlogsEditor from "@/pages/admin/components/BlogsEditor";
import RolesEditor from "@/pages/admin/components/Role";
import FeatureFlags from "@/pages/admin/components/FeatureFlags";

export enum TabValues {
    HERO="hero",
    PROJECTS="projects",
    ACTIVITIES="activities",
    EVENTS="events",
    TEAM="team",
    BLOGS = "blogs",
    RESOURCES="resources",
    ROLES="roles",
    FEATURE_FLAGS="feature_flags"

}

const tabComponentMap: Record<TabValues,React.ReactNode> = {
    [TabValues.HERO]: (
        <TabsContent value={TabValues.HERO} className="mt-0">
            <HeroEditor />
        </TabsContent>
    ),
    [TabValues.PROJECTS]: (
        <TabsContent value={TabValues.PROJECTS} className="mt-0">
            <ProjectsEditor />
        </TabsContent>
    ),
    [TabValues.ACTIVITIES]: (
        <TabsContent value={TabValues.ACTIVITIES} className="mt-0">
            <ActivitiesEditor />
        </TabsContent>
    ),
    [TabValues.EVENTS]: (
        <TabsContent value={TabValues.EVENTS} className="mt-0">
            <EventsEditor />
        </TabsContent>
    ),
    [TabValues.TEAM]: (
        <TabsContent value={TabValues.TEAM} className="mt-0">
            <TeamEditor />
        </TabsContent>
    ),
    [TabValues.BLOGS]: (
        <TabsContent value={TabValues.BLOGS} className="mt-0">
            <BlogsEditor />
        </TabsContent>
    ),
    [TabValues.RESOURCES]: (
        <TabsContent value={TabValues.RESOURCES} className="mt-0">
            <ResourceEditor />
        </TabsContent>
    ),
    [TabValues.ROLES]: (
        <TabsContent value={TabValues.ROLES} className="mt-0">
            <RolesEditor />
        </TabsContent>
    ),
    [TabValues.FEATURE_FLAGS]: (
        <TabsContent value={TabValues.FEATURE_FLAGS} className="mt-0">
            <FeatureFlags />
        </TabsContent>
    ),
}

const tabTriggerList: React.ReactNode[] = [
    (
        <TabsTrigger value={TabValues.HERO} className="flex items-center gap-2">
            <Home className="h-4 w-4" /> Hero Section
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.PROJECTS} className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Projects
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.ACTIVITIES} className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Activities
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.EVENTS} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Events
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.TEAM} className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Team
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.BLOGS} className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Blogs
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.RESOURCES} className="flex items-center gap-2">
            <Book className="h-4 w-4" /> Resources
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.ROLES} className="flex items-center gap-2">
            <Book className="h-4 w-4" /> Roles
        </TabsTrigger>
    ),
    (
        <TabsTrigger value={TabValues.FEATURE_FLAGS} className="flex items-center gap-2">
            <Book className="h-4 w-4" /> Feature Flags
        </TabsTrigger>
    ),
]

const titleMap: Record<TabValues, string> = {
    [TabValues.HERO]: "Hero Section Editor",
    [TabValues.PROJECTS]: "Projects Editor",
    [TabValues.ACTIVITIES]: "Activities Editor",
    [TabValues.EVENTS]: "Events Editor",
    [TabValues.TEAM]: "Team Members Editor",
    [TabValues.BLOGS]: "Blogs Editor",
    [TabValues.RESOURCES]: "Add Resources",
    [TabValues.ROLES]: "Define Roles",
    [TabValues.FEATURE_FLAGS]: "Feature Flags",
}

const descriptionMap: Record<TabValues, string> = {
    [TabValues.HERO]:"Edit the main heading, text and background images",
    [TabValues.PROJECTS]:"Add, edit or remove projects",
    [TabValues.ACTIVITIES]:"Manage robotics activities and workshops",
    [TabValues.EVENTS]:"Add or edit upcoming events and competitions",
    [TabValues.TEAM]:"Manage team members and their information",
    [TabValues.BLOGS]:"Manage blog posts",
    [TabValues.RESOURCES]:"Manage Resources and Links",
    [TabValues.ROLES]:"Manage Roles for different society members",
    [TabValues.FEATURE_FLAGS]: "Manage Enabling and Disabling Features",
}

const Admin = () => {
    const [activeTab, setActiveTab] = useState(TabValues.HERO);
    return (
        <>
            <PageHead
                title="Robotics Society | Punjab Engineering College"
                description='PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team.'
            />
            <section className="py-24" id="events">
                <PageSection
                    title='Admin Dashboard'
                    subtitle='Manage website content'
                >
                    <div className="min-h-screen bg-white p-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-6xl mx-auto"
                        >

                            <Tabs defaultValue={TabValues.HERO} value={activeTab} onValueChange={(value: unknown) => setActiveTab(value as TabValues)} className="w-full mb-12">
                                <div className="overflow-x-auto pb-2">
                                    <TabsList className="mb-8">
                                        {tabTriggerList}
                                    </TabsList>
                                </div>

                                <Card className="shadow-md">
                                    <CardHeader>
                                        <CardTitle>
                                            {titleMap[activeTab]}
                                        </CardTitle>
                                        <CardDescription>
                                            {descriptionMap[activeTab]}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {tabComponentMap[activeTab]}
                                    </CardContent>
                                </Card>
                            </Tabs>

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-4">Preview Pages</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-medium mb-2">Activities Page</h3>
                                            <p className="text-gray-600 text-sm mb-4">View all robotics activities and workshops.</p>
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href="/activities" target="_blank">
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Page
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-medium mb-2">Events Page</h3>
                                            <p className="text-gray-600 text-sm mb-4">View upcoming events and competitions.</p>
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href="/events" target="_blank">
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Page
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-medium mb-2">Team Page</h3>
                                            <p className="text-gray-600 text-sm mb-4">View all team members and their profiles.</p>
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href="/team" target="_blank">
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Page
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </PageSection>
            </section>
        </>
    );
};

export default Admin;

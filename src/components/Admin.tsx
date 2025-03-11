import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Home, FileText, Calendar, Users, ExternalLink } from "lucide-react";
import HeroEditor from "@/components/admin/HeroEditor";
import ProjectsEditor from "@/components/admin/ProjectsEditor";
import ActivitiesEditor from "@/components/admin/ActivitiesEditor";
import EventsEditor from "@/components/admin/EventsEditor";
import TeamEditor from "@/components/admin/TeamEditor";
import PageLayout from "./layout/PageLayout";
import PageHead from "./layout/PageHead";

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <PageLayout isAdmin={true}>
      <PageHead
        title="Robotics Society | Punjab Engineering College"
        description='PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team.'
      />
      <div className="min-h-screen bg-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage website content</p>
            </div>

          </div>

          <Tabs defaultValue="hero" value={activeTab} onValueChange={setActiveTab} className="w-full mb-12">
            <div className="overflow-x-auto pb-2">
              <TabsList className="mb-8">
                <TabsTrigger value="hero" className="flex items-center gap-2">
                  <Home className="h-4 w-4" /> Hero Section
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Projects
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Activities
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Events
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Team
                </TabsTrigger>
              </TabsList>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>
                  {activeTab === "hero" && "Hero Section Editor"}
                  {activeTab === "projects" && "Projects Editor"}
                  {activeTab === "activities" && "Activities Editor"}
                  {activeTab === "events" && "Events Editor"}
                  {activeTab === "team" && "Team Members Editor"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "hero" && "Edit the main heading, text and background images"}
                  {activeTab === "projects" && "Add, edit or remove projects"}
                  {activeTab === "activities" && "Manage robotics activities and workshops"}
                  {activeTab === "events" && "Add or edit upcoming events and competitions"}
                  {activeTab === "team" && "Manage team members and their information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="hero" className="mt-0">
                  <HeroEditor />
                </TabsContent>

                <TabsContent value="projects" className="mt-0">
                  <ProjectsEditor />
                </TabsContent>

                <TabsContent value="activities" className="mt-0">
                  <ActivitiesEditor />
                </TabsContent>

                <TabsContent value="events" className="mt-0">
                  <EventsEditor />
                </TabsContent>

                <TabsContent value="team" className="mt-0">
                  <TeamEditor />
                </TabsContent>
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
    </PageLayout >
  );
};

export default Admin;

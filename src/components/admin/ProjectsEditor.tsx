import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import MarkdownEditor from "./MarkdownEditor";
import ReactMarkdown from "react-markdown";
import { deleteProject, getProjects, updateProject, uploadProject } from "@/lib/supabase/actions/project.actions";
import { Project } from "@/types";
import { Loader } from "../layout/Loader";
import FormField from "../FormField";
import { previousDay } from "date-fns";

// Default project data structure


const ProjectsEditor = () => {
  const defaultData = {
    id: "",
    title: "",
    description: "",
    image: "",
    longDescription: "",
    category: "",
    technologies: ""
  };
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState("");
  const [newProject, setNewProject] = useState<Project>(defaultData);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load projects from localStorage if exists
  useEffect(() => {
    const fetch = async () => {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetch();

    const savedProjects = localStorage.getItem("projectsData");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.error("Failed to parse saved projects data:", error);
      }
    }
  }, []);

  const handleSaveAll = () => {
    localStorage.setItem("projectsData", JSON.stringify(projects));
    toast({
      title: "Changes saved",
      description: "Projects have been updated successfully.",
    });
  };

  const handleAddProject = async () => {
    if (!newProject.title ||
      !newProject.description ||
      !newProject.longDescription ||
      !newProject.image ||
      !newProject.category || !newProject.technologies) {
      toast({
        title: "Error",
        description: "All fields are Required",
        variant: "destructive",
      });
      return;
    }

    setProjects(prev => [...prev, { ...newProject }]);
    const { error } = await uploadProject(newProject, fileName);

    if (error) {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive"
      });
    }
    else {
      toast({
        title: "Success",
        description: "Project has been Uploaded"
      });

    }

    setNewProject(defaultData);
  };

  const handleUpdateProject = async () => {
    if (!editingId) return;
    setProjects(prev =>
      prev.map(project =>
        project.id === editingId ? newProject : project
      )
    );

    await updateProject(newProject, fileName);
    setEditingId(null);
  };

  const handleEditProject = (project: any) => {
    setNewProject(project);
    setEditingId(project.id);
  };

  const handleRemoveProject = async (project: Project) => {
    setProjects(prev => prev.filter(pr => pr.id !== project.id));
    await deleteProject(project);
  };

  return (
    <Loader isLoading={loading}>
      <div className="space-y-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Project" : "Add New Project"}
          </h3>
          <div className="space-y-4">
            <FormField
              title="Title"
              id="title"
              value={newProject.title}
              onChange={setNewProject}
              placeholder="Project Title"
              htmlFor="title"
              type="TEXT"
            />
            <FormField
              title="Description"
              id="description"
              value={newProject.description}
              onChange={setNewProject}
              placeholder="Short Description"
              htmlFor="description"
              type="TEXT"
            />
            <FormField
              title="Image"
              id="image"
              value={newProject.image}
              onChange={setNewProject}
              placeholder="Upload Image"
              htmlFor="image"
              type="IMAGE"
              setFileName={setFileName}
            />
            <FormField
              title="Detailed Desription"
              id="longDescription"
              value={newProject.longDescription}
              onChange={setNewProject}
              placeholder="Write detailed project description using Markdown"
              htmlFor="longDescription"
              type="MARKDOWN"
            />
            <FormField
              title="Category"
              id="category"
              value={newProject.category}
              onChange={setNewProject}
              placeholder="Automation"
              htmlFor="category"
              type="TEXT"
            />
            <FormField
              title="Technologies Used (Comma Seperated)"
              id="technologies"
              value={newProject.technologies}
              onChange={setNewProject}
              placeholder="AI,Mechanical Design"
              htmlFor="technologies"
              type="TEXT"
            />

            {editingId ? (
              <div className="flex gap-2">
                <Button onClick={handleUpdateProject} className="flex-1">
                  <Save className="h-4 w-4 mr-2" /> Update Project
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setEditingId(null);
                    setNewProject(defaultData);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={handleAddProject} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Project
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Projects</h3>

          {projects.length === 0 ? (
            <p className="text-gray-500 italic">No projects added yet.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {projects.map((project) => (
                <AccordionItem key={project.id} value={project.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full pr-4">
                      <span>{project.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 space-y-4">
                      <div className="flex gap-4">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{project.longDescription}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveProject(project)}
                        >
                          <Trash className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <Button onClick={handleSaveAll} className="w-full mt-4">
            <Save className="h-4 w-4 mr-2" /> Save All Changes
          </Button>
        </div>
      </div>
    </Loader>
  );
};

export default ProjectsEditor;

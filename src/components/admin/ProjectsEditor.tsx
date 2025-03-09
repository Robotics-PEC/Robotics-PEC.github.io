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

// Default project data structure
const defaultProjects = [
  {
    id: "1",
    title: "Autonomous Robot",
    description: "An autonomous robot capable of navigating complex environments.",
    imageUrl: "/projects/robot1.jpg",
    details: "This project focuses on developing robots that can navigate without human intervention."
  }
];

const ProjectsEditor = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState(defaultProjects);
  const [newProject, setNewProject] = useState({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    details: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load projects from localStorage if exists
  useEffect(() => {
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

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    const newId = Date.now().toString();
    setProjects(prev => [...prev, { ...newProject, id: newId }]);
    setNewProject({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      details: ""
    });
  };

  const handleUpdateProject = () => {
    if (!editingId) return;
    
    setProjects(prev => 
      prev.map(project => 
        project.id === editingId ? newProject : project
      )
    );
    setEditingId(null);
    setNewProject({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      details: ""
    });
  };

  const handleEditProject = (project: any) => {
    setNewProject(project);
    setEditingId(project.id);
  };

  const handleRemoveProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewProject({
        id: "",
        title: "",
        description: "",
        imageUrl: "",
        details: ""
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newProject.title}
              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Project title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief project description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={newProject.imageUrl}
              onChange={(e) => setNewProject(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Project image URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Detailed Description (Markdown)</Label>
            <MarkdownEditor
              value={newProject.details}
              onChange={(value) => setNewProject(prev => ({ ...prev, details: value }))}
              placeholder="Write detailed project description using Markdown"
              minHeight="200px"
            />
          </div>

          {editingId ? (
            <div className="flex gap-2">
              <Button onClick={handleUpdateProject} className="flex-1">
                <Save className="h-4 w-4 mr-2" /> Update Project
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setNewProject({
                    id: "",
                    title: "",
                    description: "",
                    imageUrl: "",
                    details: ""
                  });
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
                      {project.imageUrl && (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{project.details}</ReactMarkdown>
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
                        onClick={() => handleRemoveProject(project.id)}
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
  );
};

export default ProjectsEditor;

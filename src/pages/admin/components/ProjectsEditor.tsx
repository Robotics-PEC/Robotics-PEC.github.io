import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { deleteProject, getProjects, updateProject, uploadProject } from "@/lib/supabase/actions/project.actions";
import { FormProjectType } from "@/types";
import { Loader } from "../../../components/layout/Loader";
import { HTMLToMarkdown, urlToBase64 } from "@/lib/utils";
import {
    DynamicForm,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    SubmitConfigKey,
    type FormConfig
} from "@/lib/form-builder";

type ProjectFormValues = {
    title: string;
    description: string;
    image: string;
    longDescription: string;
    category: string;
    technologies: string;
};

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
    const [projects, setProjects] = useState<FormProjectType[]>([]);
    const [loading, setLoading] = useState(true);
    const [fileName, setFileName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await getProjects();
            setProjects(data);
            setLoading(false);
        };
        fetch();
    }, []);

    const handleSaveAll = () => {
        localStorage.setItem("projectsData", JSON.stringify(projects));
        toast({
            title: "Changes saved",
            description: "Projects have been updated successfully.",
        });
    };

    const handleAddProject = async (values: ProjectFormValues) => {
        const newProject = { ...defaultData, ...values };

        const { error } = await uploadProject(newProject, fileName);

        if (error) {
            toast({
                title: error.name,
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Project has been Uploaded"
            });
            setProjects(prev => [...prev, newProject]);
        }
    };

    const handleUpdateProject = async (values: ProjectFormValues) => {
        if (!editingId) return;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === editingId) {
                setFileName((projects[i].image.split("/").pop()!));
            }
        }

        const updatedProject = { ...defaultData, id: editingId, ...values };
        setProjects(prev =>
            prev.map(project =>
                project.id === editingId ? updatedProject : project
            )
        );

        const error = await updateProject(updatedProject, fileName);
        updatedProject.image = `https://bkbmdjdypixbskuvrkxi.supabase.co/storage/v1/object/public/media/projects/${fileName}`;
        setEditingId(null);

        if (error) {
            toast({
                title: error.name,
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Project has been Updated"
            });
        }
    };

    const handleEditProject = async (project: FormProjectType) => {
        setFileName((project.image.split("/").pop())!);
        project.image = await urlToBase64(project.image);
        setEditingId(project.id);
    };

    const handleRemoveProject = async (project: FormProjectType) => {
        setProjects(prev => prev.filter(pr => pr.id !== project.id));
        const response = await deleteProject(project);
        if (response.status == 204) {
            toast({
                title: "Project Deleted Successfully",
                description: `${project.title} was successfully deleted`
            });
        } else {
            toast({
                title: "Project Couldn't be deleted",
                description: `${project.title} unable to be deleted`
            });
        }
    };

    const projectFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "title",
                        [FieldConfigKey.LABEL]: "Title",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Project Title",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "description",
                        [FieldConfigKey.LABEL]: "Description",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Short Description",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "image",
                        [FieldConfigKey.LABEL]: "Image",
                        [FieldConfigKey.TYPE]: FieldType.IMAGE,
                        [FieldConfigKey.REQUIRED]: true,
                        onFileNameChange: setFileName,
                    },
                    {
                        [FieldConfigKey.NAME]: "longDescription",
                        [FieldConfigKey.LABEL]: "Detailed Description",
                        [FieldConfigKey.TYPE]: FieldType.MARKDOWN,
                        [FieldConfigKey.PLACEHOLDER]: "Write detailed project description using Markdown",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "category",
                        [FieldConfigKey.LABEL]: "Category",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Automation",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "technologies",
                        [FieldConfigKey.LABEL]: "Technologies Used (Comma Separated)",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "AI,Mechanical Design",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: editingId ? "Update Project" : "Add Project",
            [SubmitConfigKey.LOADING_LABEL]: editingId ? "Updating..." : "Adding...",
        },
    };

    const editingProject = editingId ? projects.find(p => p.id === editingId) : null;
    const defaultValues = editingProject ? {
        title: editingProject.title,
        description: editingProject.description,
        image: editingProject.image,
        longDescription: editingProject.longDescription,
        category: editingProject.category,
        technologies: editingProject.technologies,
    } : undefined;

    return (
        <Loader isLoading={loading}>
            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                        {editingId ? "Edit Project" : "Add New Project"}
                    </h3>
                    <DynamicForm
                        config={projectFormConfig}
                        onSubmit={editingId ? handleUpdateProject : handleAddProject}
                        defaultValues={defaultValues}
                        key={editingId || "new"}
                        footer={
                            editingId ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingId(null)}
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                            ) : null
                        }
                    />
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
                                                        <ReactMarkdown>{HTMLToMarkdown(project.longDescription)}</ReactMarkdown>
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

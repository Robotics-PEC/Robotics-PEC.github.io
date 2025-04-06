import FormField from '@/components/FormField';
import { Loader } from '@/components/layout/Loader';
import { Card } from '@/components/ui/card';
import { HTMLToMarkdown } from '@/lib/utils';
import { FormResourceType } from '@/types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Save, Plus, Edit, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { toast } from '@/hooks/use-toast';
import { deleteResource, getResourceData, uploadResource } from '@/lib/supabase/actions/resources.actions';

const ResourceEditor = () => {



    const defaultData = {
        id: "",
        name: "",
        url: ""
    }

    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newResource, setNewResource] = useState<FormResourceType>(defaultData);
    const [resources, setResources] = useState<FormResourceType[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await getResourceData();

            if (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive"
                });
                return;
            }
            setResources(data as FormResourceType[]);
            setLoading(false);
        };
        fetch();
    }, []);

    const handleUpdateProject = async () => {
        if (!editingId) return;

        setResources(prev =>
            prev.map(resource =>
                resource.id === editingId ? newResource : resource
            )
        );
    };

    const handleEditResource = async (resource: FormResourceType) => {
        setNewResource(resource);
        setEditingId(resource.id);
    };

    const handleRemoveProject = async (resource: FormResourceType) => {
        setResources(prev => prev.filter(pr => pr.id !== resource.id));
        const response = await deleteResource(resource);
        if (response.status == 204) {
            toast({
                title: "Project Deleted Successfully",
                description: `${resource.name} was successfully deleted`
            });
        }
        else {
            toast({
                title: "Project Couldn't be deleted",
                description: `${resource.name} unable to be deleted`
            });
        }
    };

    const handleSaveAll = () => {
        localStorage.setItem("resourceData", JSON.stringify(resources));
        toast({
            title: "Changes saved",
            description: "Projects have been updated successfully.",
        });
    };

    const handleAddProject = async () => {
        if (!newResource.name || !newResource.url) {
            toast({
                title: "Error",
                description: "All fields are Required",
                variant: "destructive",
            });
            return;
        }

        setResources(prev => [...prev, { ...newResource }]);
        const error = await uploadResource(newResource);

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
                description: "Resource has been Uploaded"
            });

        }

        setNewResource(defaultData);
    };



    return (
        <Loader isLoading={loading}>
            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                        {editingId ? "Edit Resource" : "Add New Resource"}
                    </h3>
                    <div className="space-y-4">
                        <FormField
                            title="Name"
                            id="name"
                            value={newResource.name}
                            onChange={setNewResource}
                            placeholder="Robotics Repository"
                            htmlFor="name"
                            type="TEXT"
                        />
                        <FormField
                            title="URL"
                            id="url"
                            value={newResource.url}
                            onChange={setNewResource}
                            placeholder="https://www.roboticspec.com"
                            htmlFor="url"
                            type="TEXT"
                        />

                        {editingId ? (
                            <div className="flex gap-2">
                                <Button onClick={handleUpdateProject} className="flex-1">
                                    <Save className="h-4 w-4 mr-2" /> Update Resource
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setEditingId(null);
                                        setNewResource(defaultData);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={handleAddProject} className="w-full">
                                <Plus className="h-4 w-4 mr-2" /> Add Resource
                            </Button>
                        )}
                    </div>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Current Resources</h3>

                    {resources.length === 0 ? (
                        <p className="text-gray-500 italic">No resources added yet.</p>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {resources.map((resource) => (
                                <AccordionItem key={resource.id} value={resource.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <span>{resource.name}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 space-y-4">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600 mb-2">{resource.url}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditResource(resource)}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleRemoveProject(resource)}
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
    )
}

export default ResourceEditor;
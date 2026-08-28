import { Loader } from '@/components/layout/Loader';
import { Card } from '@/components/ui/card';
import { FormResourceType } from '@/types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Save, Plus, Edit, Trash, Badge } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { deleteResource, getResourceData, updateResource, uploadResource } from '@/lib/supabase/actions/resources.actions';
import {
    DynamicForm,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    SubmitConfigKey,
    type FormConfig
} from '@/lib/form-builder';

const ResourceEditor = () => {
    const defaultData = {
        id: "",
        name: "",
        url: ""
    }

    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
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

    const handleAddResource = async (values: { name: string; url: string }) => {
        const newResource = { ...defaultData, ...values };

        const error = await uploadResource(newResource);

        if (error) {
            toast({
                title: error.name,
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Resource has been Uploaded"
            });
            setResources(prev => [...prev, newResource]);
        }
    };

    const handleUpdateResource = async (values: { name: string; url: string }) => {
        if (!editingId) return;

        const updatedResource = { ...defaultData, id: editingId, ...values };

        setResources(prev =>
            prev.map(resource =>
                resource.id === editingId ? updatedResource : resource
            )
        );

        const error = await updateResource(updatedResource);
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
                description: "Resource has been Updated"
            });
        }
    };

    const handleEditResource = (resource: FormResourceType) => {
        setEditingId(resource.id);
    };

    const handleRemoveResource = async (resource: FormResourceType) => {
        setResources(prev => prev.filter(pr => pr.id !== resource.id));
        const response = await deleteResource(resource);
        if (response.status == 204) {
            toast({
                title: "Resource Deleted Successfully",
                description: `${resource.name} was successfully deleted`
            });
        } else {
            toast({
                title: "Resource Couldn't be deleted",
                description: `${resource.name} unable to be deleted`
            });
        }
    };

    const handleSaveAll = () => {
        localStorage.setItem("resourceData", JSON.stringify(resources));
        toast({
            title: "Changes saved",
            description: "Resources have been updated successfully.",
        });
    };

    const resourceFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "name",
                        [FieldConfigKey.LABEL]: "Name",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Robotics Repository",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "url",
                        [FieldConfigKey.LABEL]: "URL",
                        [FieldConfigKey.TYPE]: FieldType.URL,
                        [FieldConfigKey.PLACEHOLDER]: "https://www.roboticspec.com",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: editingId ? "Update Resource" : "Add Resource",
            [SubmitConfigKey.LOADING_LABEL]: editingId ? "Updating..." : "Adding...",
        },
    };

    const editingResource = editingId ? resources.find(r => r.id === editingId) : null;

    return (
        <Loader isLoading={loading}>
            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                        {editingId ? "Edit Resource" : "Add New Resource"}
                    </h3>
                    <DynamicForm
                        config={resourceFormConfig}
                        onSubmit={editingId ? handleUpdateResource : handleAddResource}
                        defaultValues={
                            editingResource
                                ? { name: editingResource.name, url: editingResource.url }
                                : undefined
                        }
                        key={editingId || "new"} // Force re-render when switching between add/edit
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
                    <h3 className="text-lg font-medium">Current Resources</h3>

                    {resources.length === 0 ? (
                        <p className="text-gray-500 italic">No resources added yet.</p>
                    ) : (
                        <Accordion type="single" collapsible className="w-full space-y-6">
                            {resources.map((resource) => (
                                <AccordionItem key={resource.id} value={resource.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4 space-x-4">
                                            <Badge className="w-5 h-5" />
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
                                                    onClick={() => handleRemoveResource(resource)}
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

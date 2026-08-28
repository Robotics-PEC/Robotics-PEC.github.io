import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormActivityType } from "@/types";
import { deleteActivity, getActivites, updateActivity, uploadActivity } from "@/lib/supabase/actions/activities.actions";
import { format } from "date-fns";
import { Loader } from "@/components/layout/Loader";
import { markdownToHTML } from "@/lib/utils";
import { getMarkdownFile } from "@/lib/supabase/actions/storage.actions";
import {
    DynamicForm,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    SubmitConfigKey,
    type FormConfig
} from "@/lib/form-builder";

const emptyData: FormActivityType = {
    id: "",
    title: "",
    shortDescription: "",
    longDescription: "",
    date: undefined,
    participants: "",
};

type ActivityFormValues = {
    title: string;
    shortDescription: string;
    longDescription: string;
    date: Date;
    participants: string;
};

const ActivitiesEditor = () => {
    const { toast } = useToast();

    const [activities, setActivities] = useState<FormActivityType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getActivites();
            setActivities(data);
            setLoading(false);
        }
        fetch();
    }, []);

    const handleSaveAll = () => {
        localStorage.setItem("activitiesData", JSON.stringify(activities));
        toast({
            title: "Changes saved",
            description: "Activities have been updated successfully.",
        });
    };

    const handleAddActivity = async (values: ActivityFormValues) => {
        const newActivity: FormActivityType = {
            ...emptyData,
            ...values,
            date: format(values.date, "dd/MM/yyyy"),
        };

        const { error } = await uploadActivity(newActivity);

        if (error) {
            toast({
                title: error.name,
                description: error.message,
                variant: "destructive",
            });
            return;
        } else {
            toast({
                title: "Success",
                description: "Activity was successfully uploaded",
            });
            setActivities(prev => [...prev, newActivity]);
        }
    };

    const handleUpdateActivity = async (values: ActivityFormValues) => {
        if (!editingId) return;

        const updatedActivity: FormActivityType = {
            id: editingId,
            ...values,
            date: format(values.date, "dd/MM/yyyy"),
        };

        const error = await updateActivity(updatedActivity);

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            return;
        } else {
            toast({
                title: "Success",
                description: "Activity was successfully updated",
            });
            setActivities(prev =>
                prev.map(activity =>
                    activity.id === editingId ? updatedActivity : activity
                )
            );
        }

        setEditingId(null);
    };

    const handleEditActivity = async (activity: FormActivityType) => {
        const markdownData = await getMarkdownFile(`${activity.id}.md`, "activities");
        if (!markdownData) return;

        const htmlData = await markdownToHTML(markdownData);
        if (!htmlData) return;

        activity.longDescription = htmlData;

        const correctDateFormat = `${activity.date?.split("/")[2]}-${activity.date?.split("/")[1]}-${activity.date?.split("/")[0]}`;
        setEditingId(activity.id);
    };

    const handleRemoveActivity = async (id: string) => {
        const response = await deleteActivity(id);

        if (response.status === 204) {
            toast({
                title: "Success",
                description: "Activity was successfully deleted",
            });
            setActivities(prev => prev.filter(activity => activity.id !== id));
        } else {
            toast({
                title: String(response.status),
                description: response.error?.message,
                variant: "destructive"
            });
        }

        if (editingId === id) {
            setEditingId(null);
        }
    };

    const activityFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "title",
                        [FieldConfigKey.LABEL]: "Title",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Introduction to ROS",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "shortDescription",
                        [FieldConfigKey.LABEL]: "Short Description",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Hands-on workshop introducing fundamentals of Robot Operating System (ROS) development.",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "longDescription",
                        [FieldConfigKey.LABEL]: "Detailed Description",
                        [FieldConfigKey.TYPE]: FieldType.MARKDOWN,
                        [FieldConfigKey.PLACEHOLDER]: "Write the detailed description in markdown...",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
            {
                [SectionKey.COLUMNS]: 2,
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "date",
                        [FieldConfigKey.LABEL]: "Date",
                        [FieldConfigKey.TYPE]: FieldType.DATE,
                        [FieldConfigKey.PLACEHOLDER]: "Select date",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "participants",
                        [FieldConfigKey.LABEL]: "Participants",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "50",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: editingId ? "Update Activity" : "Add Activity",
            [SubmitConfigKey.LOADING_LABEL]: editingId ? "Updating..." : "Adding...",
        },
    };

    const editingActivity = editingId ? activities.find(a => a.id === editingId) : null;
    const defaultValues = editingActivity ? {
        title: editingActivity.title,
        shortDescription: editingActivity.shortDescription,
        longDescription: editingActivity.longDescription,
        date: editingActivity.date
            ? new Date(`${editingActivity.date.split("/")[2]}-${editingActivity.date.split("/")[1]}-${editingActivity.date.split("/")[0]}`)
            : undefined,
        participants: editingActivity.participants,
    } : undefined;

    return (
        <Loader isLoading={loading}>
            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                        {editingId ? "Edit Activity" : "Add New Activity"}
                    </h3>
                    <DynamicForm
                        config={activityFormConfig}
                        onSubmit={editingId ? handleUpdateActivity : handleAddActivity}
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
                    <h3 className="text-lg font-medium">Current Activities</h3>

                    {activities.length === 0 ? (
                        <p className="text-gray-500 italic">No activities added yet.</p>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {activities.map((activity) => (
                                <AccordionItem key={activity.id} value={activity.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <span>{activity.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 space-y-4">
                                            <p className="text-sm font-medium">Description:</p>
                                            <p className="text-sm text-gray-600 mb-2">{activity.shortDescription}</p>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium">Date:</p>
                                                    <p className="text-sm text-gray-600">{activity.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Participants:</p>
                                                    <p className="text-sm text-gray-600">{activity.participants}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditActivity(activity)}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleRemoveActivity(activity.id)}
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

export default ActivitiesEditor;

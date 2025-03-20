import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormActivityType } from "@/types";
import { deleteActivity, getActivites, updateActivity, uploadActivity } from "@/lib/supabase/actions/activities.actions";
import { format } from "date-fns";
import { Loader } from "@/components/layout/Loader";
import FormField from "@/components/FormField";
import { HTMLToMarkdown, markdownToHTML } from "@/lib/utils";
import { getMarkdownFile } from "@/lib/supabase/actions/storage.actions";

// Default activity data structure


const emptyData: FormActivityType = {
  id: "",
  title: "",
  shortDescription: "",
  longDescription: "",
  date: undefined,
  participants: "",
};

const ActivitiesEditor = () => {
  const { toast } = useToast();

  const [activities, setActivities] = useState<FormActivityType[]>([]);
  const [newActivity, setNewActivity] = useState<FormActivityType>(emptyData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Load activities from localStorage if exists
  useEffect(() => {
    const savedActivities = localStorage.getItem("activitiesData");
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error("Failed to parse saved activities data:", error);
      }
    }

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

  const handleAddActivity = async () => {
    if (!newActivity.title || !newActivity.shortDescription || !newActivity.participants || !newActivity.longDescription) {
      toast({
        title: "Error",
        description: "All the fields are required",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Date is required",
        variant: "destructive",
      });
      return;
    }

    newActivity.date = format(date!, "dd/MM/yyyy");
    const { error } = await uploadActivity(newActivity);

    if (error) {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    else {
      toast({
        title: "Success",
        description: "Activity was successfully uploaded",
      });
    };

    setActivities(prev => [...prev, newActivity]);
    setNewActivity(emptyData);
  };

  const handleUpdateActivity = async () => {
    if (!editingId) return;

    const error = await updateActivity(newActivity);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    else {
      toast({
        title: "Success",
        description: "Activity was successfully updated",
      });
    };

    setActivities(prev =>
      prev.map(activity =>

        activity.id === editingId ? newActivity : activity
      )
    );
    setEditingId(null);
    setNewActivity(emptyData);
  };


  const handleEditActivity = async (activity: FormActivityType) => {
    const markdownData = await getMarkdownFile(`${activity.id}.md`, "activities");
    if (!markdownData) return;

    const htmlData = await markdownToHTML(markdownData);
    if (!htmlData) return;

    activity.longDescription = htmlData;
    setNewActivity(activity);
    const correctDateFormat = `${activity.date?.split("/")[2]}-${activity.date?.split("/")[1]}-${activity.date?.split("/")[0]}`;
    setDate(new Date(correctDateFormat));
    setEditingId(activity.id);

  };

  const handleRemoveActivity = async (id: string) => {
    const response = await deleteActivity(id);

    if (response.status === 204) {
      toast({
        title: "Success",
        description: "Activity was successfully deleted",
      });
    }
    else {
      toast({
        title: String(response.status),
        description: response.error?.message,
        variant: "destructive"
      });
    }

    setActivities(prev => prev.filter(activity => activity.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewActivity(emptyData);
    }
  };

  return (
    <Loader isLoading={loading}>
      <div className="space-y-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Activity" : "Add New Activity"}
          </h3>
          <div className="space-y-4">
            <FormField
              id="title"
              value={newActivity.title}
              onChange={setNewActivity}
              placeholder="Introduction to ROS"
              htmlFor="title"
              type="TEXT"
              title="Title"
            />
            <FormField
              id="shortDescription"
              value={newActivity.shortDescription}
              onChange={setNewActivity}
              placeholder="Hands-on workshop introducing fundamentals of Robot Operating System (ROS) development."
              htmlFor="shortDescription"
              type="TEXT"
              title="Short Description"
            />
            <FormField
              id="longDescription"
              value={newActivity.longDescription}
              onChange={setNewActivity}
              placeholder="Hands-on workshop introducing fundamentals of Robot Operating System (ROS) development."
              htmlFor="longDescription"
              type="MARKDOWN"
              title="Detailed Description"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                htmlFor="date"
                title="Date"
                id="date"
                value={newActivity.date}
                onChange={setNewActivity}
                placeholder={`${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}
                type="DATE"
                date={date}
                setDate={setDate}
              />

              <FormField
                id="participants"
                value={newActivity.participants}
                onChange={setNewActivity}
                placeholder="50"
                htmlFor="participants"
                type="TEXT"
                title="Participants"
              />
            </div>

            {editingId ? (
              <div className="flex gap-2">
                <Button onClick={handleUpdateActivity} className="flex-1">
                  <Save className="h-4 w-4 mr-2" /> Update Activity
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    setEditingId(null);
                    setNewActivity(emptyData);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={handleAddActivity} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Activity
              </Button>
            )}
          </div>
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
                      <p className="text-sm font-medium">Full Description:</p>
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

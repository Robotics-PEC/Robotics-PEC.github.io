import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
// Default activity data structure

interface Activity {
  id: string
  title: string
  shortDescription: string
  description: string
  duration: string
  frequency: string
  participants: string
  tags: string[]
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    title: "Robotics Workshop",
    shortDescription: "Learn robotics basics in a hands-on environment",
    description: "A comprehensive workshop covering the fundamentals of robotics including mechanics, electronics, and programming.",
    duration: "4 hours",
    frequency: "Monthly",
    participants: "20-30 students",
    tags: ["Workshop", "Beginners", "Hands-on"]
  }
];

const ActivitiesEditor = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [newActivity, setNewActivity] = useState<Activity>({
    id: "",
    title: "",
    shortDescription: "",
    description: "",
    duration: "",
    frequency: "",
    participants: "",
    tags: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

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
  }, []);

  const handleSaveAll = () => {
    localStorage.setItem("activitiesData", JSON.stringify(activities));
    toast({
      title: "Changes saved",
      description: "Activities have been updated successfully.",
    });
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.shortDescription) {
      toast({
        title: "Error",
        description: "Title and short description are required",
        variant: "destructive",
      });
      return;
    }

    const newId = Date.now().toString();
    setActivities(prev => [...prev, { ...newActivity, id: newId }]);
    setNewActivity({
      id: "",
      title: "",
      shortDescription: "",
      description: "",
      duration: "",
      frequency: "",
      participants: "",
      tags: []
    });
  };

  const handleUpdateActivity = () => {
    if (!editingId) return;

    setActivities(prev =>
      prev.map(activity =>
        activity.id === editingId ? newActivity : activity
      )
    );
    setEditingId(null);
    setNewActivity({
      id: "",
      title: "",
      shortDescription: "",
      description: "",
      duration: "",
      frequency: "",
      participants: "",
      tags: []
    });
  };

  const handleEditActivity = (activity: Activity) => {
    setNewActivity(activity);
    setEditingId(activity.id);
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewActivity({
        id: "",
        title: "",
        shortDescription: "",
        description: "",
        duration: "",
        frequency: "",
        participants: "",
        tags: []
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewActivity(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setNewActivity(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Activity" : "Add New Activity"}
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newActivity.title}
              onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Activity title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={newActivity.shortDescription}
              onChange={(e) => setNewActivity(prev => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="Brief activity description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              value={newActivity.description}
              onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed activity description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={newActivity.duration}
                onChange={(e) => setNewActivity(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 2 hours"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={newActivity.frequency}
                onChange={(e) => setNewActivity(prev => ({ ...prev, frequency: e.target.value }))}
                placeholder="e.g., Weekly, Monthly"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                value={newActivity.participants}
                onChange={(e) => setNewActivity(prev => ({ ...prev, participants: e.target.value }))}
                placeholder="e.g., 15-20 students"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>Add</Button>
            </div>
            {newActivity.tags && newActivity.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newActivity.tags.map((tag, index) => (
                  <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {editingId ? (
            <div className="flex gap-2">
              <Button onClick={handleUpdateActivity} className="flex-1">
                <Save className="h-4 w-4 mr-2" /> Update Activity
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setNewActivity({
                    id: "",
                    title: "",
                    shortDescription: "",
                    description: "",
                    duration: "",
                    frequency: "",
                    participants: "",
                    tags: []
                  });
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
                    <p className="text-sm font-medium">Short Description:</p>
                    <p className="text-sm text-gray-600 mb-2">{activity.shortDescription}</p>

                    <p className="text-sm font-medium">Full Description:</p>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Duration:</p>
                        <p className="text-sm text-gray-600">{activity.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Frequency:</p>
                        <p className="text-sm text-gray-600">{activity.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Participants:</p>
                        <p className="text-sm text-gray-600">{activity.participants}</p>
                      </div>
                    </div>

                    {activity.tags && activity.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Tags:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {activity.tags.map((tag, index) => (
                            <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
  );
};

export default ActivitiesEditor;

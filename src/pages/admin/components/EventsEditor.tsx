import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import MarkdownEditor from "./MarkdownEditor";
import ReactMarkdown from "react-markdown";

// Default events data structure
const defaultEvents = [
  {
    id: "1",
    title: "Annual Robotics Competition",
    shortDescription: "Showcase your robotics skills in our yearly competition",
    description: "Join us for our flagship event where teams compete to build the most innovative and efficient robots to complete a series of challenging tasks.",
    date: "2023-12-15",
    time: "10:00 AM - 5:00 PM",
    location: "PEC Main Auditorium",
    capacity: "200",
    imageUrl: "/projects/robot1.jpg",
    registrationUrl: "https://example.com/register",
    tags: ["Competition", "Annual Event", "Prizes"]
  }
];

interface EventType {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  imageUrl: string;
  registrationUrl: string;
  tags: string[];
}

const EventsEditor = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventType[]>(defaultEvents);
  const [newEvent, setNewEvent] = useState<EventType>({
    id: "",
    title: "",
    shortDescription: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    imageUrl: "",
    registrationUrl: "",
    tags: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  // Load events from localStorage if exists
  useEffect(() => {
    const savedEvents = localStorage.getItem("eventsData");
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error("Failed to parse saved events data:", error);
      }
    }
  }, []);

  const handleSaveAll = () => {
    localStorage.setItem("eventsData", JSON.stringify(events));
    toast({
      title: "Changes saved",
      description: "Events have been updated successfully.",
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: "Error",
        description: "Title and date are required",
        variant: "destructive",
      });
      return;
    }

    const newId = Date.now().toString();
    setEvents(prev => [...prev, { ...newEvent, id: newId }]);
    setNewEvent({
      id: "",
      title: "",
      shortDescription: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      imageUrl: "",
      registrationUrl: "",
      tags: []
    });
  };

  const handleUpdateEvent = () => {
    if (!editingId) return;

    setEvents(prev =>
      prev.map(event =>
        event.id === editingId ? newEvent : event
      )
    );
    setEditingId(null);
    setNewEvent({
      id: "",
      title: "",
      shortDescription: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      imageUrl: "",
      registrationUrl: "",
      tags: []
    });
  };

  const handleEditEvent = (event: EventType) => {
    setNewEvent(event);
    setEditingId(event.id);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewEvent({
        id: "",
        title: "",
        shortDescription: "",
        description: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
        imageUrl: "",
        registrationUrl: "",
        tags: []
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewEvent(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Event" : "Add New Event"}
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Event title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={newEvent.shortDescription}
              onChange={(e) => setNewEvent(prev => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="Brief event description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description (Markdown)</Label>
            <MarkdownEditor
              value={newEvent.description}
              onChange={(value) => setNewEvent(prev => ({ ...prev, description: value }))}
              placeholder="Write detailed event description using Markdown"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                placeholder="e.g., 10:00 AM - 2:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Event location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="Maximum number of participants"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={newEvent.imageUrl}
              onChange={(e) => setNewEvent(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="URL to event image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationUrl">Registration URL</Label>
            <Input
              id="registrationUrl"
              value={newEvent.registrationUrl}
              onChange={(e) => setNewEvent(prev => ({ ...prev, registrationUrl: e.target.value }))}
              placeholder="URL for registration"
            />
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
            {newEvent.tags && newEvent.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newEvent.tags.map((tag, index) => (
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
              <Button onClick={handleUpdateEvent} className="flex-1">
                <Save className="h-4 w-4 mr-2" /> Update Event
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setNewEvent({
                    id: "",
                    title: "",
                    shortDescription: "",
                    description: "",
                    date: "",
                    time: "",
                    location: "",
                    capacity: "",
                    imageUrl: "",
                    registrationUrl: "",
                    tags: []
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={handleAddEvent} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Events</h3>

        {events.length === 0 ? (
          <p className="text-gray-500 italic">No events added yet.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {events.map((event) => (
              <AccordionItem key={event.id} value={event.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{event.title}</span>
                    </div>
                    <span className="text-sm text-gray-500 mr-4">{event.date}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-4">
                    <div className="flex gap-4">
                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">Short Description:</p>
                        <p className="text-sm text-gray-600 mb-2">{event.shortDescription}</p>

                        <p className="text-sm font-medium">Full Description:</p>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{event.description}</ReactMarkdown>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Date:</p>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time:</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location:</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Capacity:</p>
                        <p className="text-sm text-gray-600">{event.capacity}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Registration URL:</p>
                        <p className="text-sm text-gray-600 truncate">
                          {event.registrationUrl ? (
                            <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {event.registrationUrl}
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Tags:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {event.tags.map((tag, index) => (
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
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveEvent(event.id)}
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

export default EventsEditor;

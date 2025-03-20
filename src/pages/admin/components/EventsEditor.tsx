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
import { FormEventType } from "@/types";
import { Loader } from "@/components/layout/Loader";
import { deleteEvent, getEvents, updateEvent, uploadEvent } from "@/lib/supabase/actions/events.actions";
import FormField from "@/components/FormField";
import { isEndTimeAfterStartTime, TimeValue } from "@/lib/utils";
import TimeField from "@/components/TimeField";
import { formatDate } from "date-fns";

// Default events data structure

const emptyData: FormEventType = {
  id: "",
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  capacity: "",
};

const EventsEditor = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<FormEventType[]>([]);
  const [newEvent, setNewEvent] = useState<FormEventType>(emptyData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<TimeValue | null>(null);
  const [endTime, setEndTime] = useState<TimeValue | null>(null);
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  // Clear validation error when times are valid
  useEffect(() => {
    if (startTime && endTime) {
      const isValid = isEndTimeAfterStartTime(startTime, endTime);
      if (isValid) {
        setValidationError(undefined);
      } else {
        setValidationError("End time must be after start time");
      }
    }
  }, [startTime, endTime]);
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

    const fetch = async () => {
      const data = await getEvents();
      setEvents(data!);
      setLoading(false);
    }
    fetch();
  }, []);

  const handleSaveAll = () => {
    localStorage.setItem("eventsData", JSON.stringify(events));
    toast({
      title: "Changes saved",
      description: "Events have been updated successfully.",
    });
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !startTime || !endTime) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    const stTime = `${(startTime.hours < 10) ? "0" + startTime.hours : startTime.hours}:${(startTime.minutes < 10) ? "0" + startTime.minutes : startTime.minutes} ${startTime.period}`
    const enTime = `${(endTime.hours < 10) ? "0" + endTime.hours : endTime.hours}:${(endTime.minutes < 10) ? "0" + endTime.minutes : endTime.minutes} ${endTime.period}`


    const error = await uploadEvent({ ...newEvent, time: `${stTime}-${enTime}`, date: formatDate(date!, "dd/MM/yyyy") });

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
        description: "Event Added Successfully",
      });
    }

    setEvents(prev => [...prev, { ...newEvent }]);
    setNewEvent(emptyData);
  };

  const handleUpdateEvent = async () => {
    if (!editingId) return;

    if (!startTime || !endTime) {
      console.log("No start or endtime");
      return;
    }

    const stTime = `${(startTime.hours < 10) ? "0" + startTime.hours : startTime.hours}:${(startTime.minutes < 10) ? "0" + startTime.minutes : startTime.minutes} ${startTime.period}`
    const enTime = `${(endTime.hours < 10) ? "0" + endTime.hours : endTime.hours}:${(endTime.minutes < 10) ? "0" + endTime.minutes : endTime.minutes} ${endTime.period}`

    const error = await updateEvent({ ...newEvent, time: `${stTime}-${enTime}`, date: formatDate(date!, "dd/MM/yyyy") });

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
        description: "Event Updated Successfully",
      });
    }

    setEvents(prev =>
      prev.map(event =>
        event.id === editingId ? newEvent : event
      )
    );
    setEditingId(null);
    setNewEvent(emptyData);
  };

  const handleEditEvent = (event: FormEventType) => {
    setNewEvent(event);
    setEditingId(event.id);


    const startHours = Number(event.time.split(":")[0]);
    const startMinutes = Number(event.time.split(":")[1].slice(0, 2));
    const startPeriod = event.time.split(" ")[1].slice(0, 2);

    const endHours = Number(event.time.split("-")[1].split(":")[0]);
    const endMinutes = Number(event.time.split("-")[1].split(":")[1].slice(0, 2));
    const endPeriod = event.time.split(" ")[2];

    setStartTime({ hours: startHours, minutes: startMinutes, period: startPeriod as ("AM" | "PM") });
    setEndTime({ hours: endHours, minutes: endMinutes, period: endPeriod as ("AM" | "PM") });

    const correctDateFormat = `${event.date?.split("/")[2]}-${event.date?.split("/")[1]}-${event.date?.split("/")[0]}`;
    setDate(new Date(correctDateFormat));


  };

  const handleRemoveEvent = async (id: string) => {

    const response = await deleteEvent(id);

    if (response.status == 204) {
      toast({
        title: "Success",
        description: "Event was deleted successfully",
      });
    }
    else {
      toast({
        title: String(response.status),
        description: response.error?.message,
        variant: "destructive",
      });
      return;
    }

    setEvents(prev => prev.filter(event => event.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewEvent(emptyData);
    }
  };

  return (
    <Loader isLoading={loading}>
      <div className="space-y-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Event" : "Add New Event"}
          </h3>



          <div className="space-y-4">
            <FormField
              htmlFor="htmlFor"
              id="title"
              value={newEvent.title}
              onChange={setNewEvent}
              placeholder="Event Title"
              type="TEXT"
              title="Title"
            />
            <FormField
              htmlFor="description"
              id="description"
              value={newEvent.description}
              onChange={setNewEvent}
              placeholder="Detailed Description (Markdown)"
              type="MARKDOWN"
              title="Description"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                htmlFor="date"
                title="Date"
                id="date"
                value={newEvent.date}
                onChange={setNewEvent}
                placeholder={`${new Date().getDate()} /${new Date().getMonth()}/${new Date().getFullYear()} `}
                type="DATE"
                date={date}
                setDate={setDate}
              />

              <div className="space-y-2">
                <TimeField
                  startTime={startTime}
                  endTime={endTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  error={validationError}
                  className="mb-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                htmlFor="location"
                title="Locaton"
                id="location"
                value={newEvent.location}
                onChange={setNewEvent}
                placeholder="NAB L-27"
                type="TEXT"
              />
              <FormField
                htmlFor="capacity"
                title="Capacity"
                id="capacity"
                value={newEvent.capacity}
                onChange={setNewEvent}
                placeholder="100"
                type="TEXT"
              />
            </div>


            {editingId ? (
              <div className="flex gap-2">
                <Button onClick={handleUpdateEvent} className="flex-1">
                  <Save className="h-4 w-4 mr-2" /> Update Event
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setEditingId(null);
                    setNewEvent(emptyData);
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
                        <div className="flex-1">
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
    </Loader>
  );
};

export default EventsEditor;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { FormEventType } from "@/types";
import { Loader } from "@/components/layout/Loader";
import { deleteEvent, getEvents, updateEvent, uploadEvent } from "@/lib/supabase/actions/events.actions";
import { isEndTimeAfterStartTime, TimeValue } from "@/lib/utils";
import TimeField from "@/components/TimeField";
import { formatDate } from "date-fns";
import {
    DynamicForm,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    SubmitConfigKey,
    type FormConfig
} from "@/lib/form-builder";

const emptyData: FormEventType = {
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
};

type EventFormValues = {
    title: string;
    description: string;
    date: Date;
    location: string;
    capacity: string;
};

const EventsEditor = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState<FormEventType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState<TimeValue | null>(null);
    const [endTime, setEndTime] = useState<TimeValue | null>(null);
    const [validationError, setValidationError] = useState<string | undefined>(undefined);

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

    useEffect(() => {
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

    const handleAddEvent = async (values: EventFormValues) => {
        if (!startTime || !endTime) {
            toast({
                title: "Error",
                description: "Please set start and end times",
                variant: "destructive",
            });
            return;
        }

        const stTime = `${(startTime.hours < 10) ? "0" + startTime.hours : startTime.hours}:${(startTime.minutes < 10) ? "0" + startTime.minutes : startTime.minutes} ${startTime.period}`;
        const enTime = `${(endTime.hours < 10) ? "0" + endTime.hours : endTime.hours}:${(endTime.minutes < 10) ? "0" + endTime.minutes : endTime.minutes} ${endTime.period}`;

        const newEvent = {
            ...emptyData,
            ...values,
            time: `${stTime}-${enTime}`,
            date: formatDate(values.date, "dd/MM/yyyy")
        };

        const error = await uploadEvent(newEvent);

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
                description: "Event Added Successfully",
            });
            setEvents(prev => [...prev, newEvent]);
        }

        setStartTime(null);
        setEndTime(null);
    };

    const handleUpdateEvent = async (values: EventFormValues) => {
        if (!editingId) return;

        if (!startTime || !endTime) {
            toast({
                title: "Error",
                description: "Please set start and end times",
                variant: "destructive",
            });
            return;
        }

        const stTime = `${(startTime.hours < 10) ? "0" + startTime.hours : startTime.hours}:${(startTime.minutes < 10) ? "0" + startTime.minutes : startTime.minutes} ${startTime.period}`;
        const enTime = `${(endTime.hours < 10) ? "0" + endTime.hours : endTime.hours}:${(endTime.minutes < 10) ? "0" + endTime.minutes : endTime.minutes} ${endTime.period}`;

        const updatedEvent = {
            id: editingId,
            ...values,
            time: `${stTime}-${enTime}`,
            date: formatDate(values.date, "dd/MM/yyyy")
        };

        const error = await updateEvent(updatedEvent);

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
                description: "Event Updated Successfully",
            });
        }

        setEvents(prev =>
            prev.map(event =>
                event.id === editingId ? updatedEvent : event
            )
        );
        setEditingId(null);
        setStartTime(null);
        setEndTime(null);
    };

    const handleEditEvent = (event: FormEventType) => {
        setEditingId(event.id);

        const startHours = Number(event.time.split(":")[0]);
        const startMinutes = Number(event.time.split(":")[1].slice(0, 2));
        const startPeriod = event.time.split(" ")[1].slice(0, 2);

        const endHours = Number(event.time.split("-")[1].split(":")[0]);
        const endMinutes = Number(event.time.split("-")[1].split(":")[1].slice(0, 2));
        const endPeriod = event.time.split(" ")[2];

        setStartTime({ hours: startHours, minutes: startMinutes, period: startPeriod as ("AM" | "PM") });
        setEndTime({ hours: endHours, minutes: endMinutes, period: endPeriod as ("AM" | "PM") });
    };

    const handleRemoveEvent = async (id: string) => {
        const response = await deleteEvent(id);

        if (response.status == 204) {
            toast({
                title: "Success",
                description: "Event was deleted successfully",
            });
        } else {
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
            setStartTime(null);
            setEndTime(null);
        }
    };

    const eventFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "title",
                        [FieldConfigKey.LABEL]: "Title",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Event Title",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "description",
                        [FieldConfigKey.LABEL]: "Description",
                        [FieldConfigKey.TYPE]: FieldType.MARKDOWN,
                        [FieldConfigKey.PLACEHOLDER]: "Detailed Description (Markdown)",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "date",
                        [FieldConfigKey.LABEL]: "Date",
                        [FieldConfigKey.TYPE]: FieldType.DATE,
                        [FieldConfigKey.PLACEHOLDER]: "Select date",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
            {
                [SectionKey.COLUMNS]: 2,
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "location",
                        [FieldConfigKey.LABEL]: "Location",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "NAB L-27",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "capacity",
                        [FieldConfigKey.LABEL]: "Capacity",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "100",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: editingId ? "Update Event" : "Add Event",
            [SubmitConfigKey.LOADING_LABEL]: editingId ? "Updating..." : "Adding...",
        },
    };

    const editingEvent = editingId ? events.find(e => e.id === editingId) : null;
    const defaultValues = editingEvent ? {
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date
            ? new Date(`${editingEvent.date.split("/")[2]}-${editingEvent.date.split("/")[1]}-${editingEvent.date.split("/")[0]}`)
            : undefined,
        location: editingEvent.location,
        capacity: editingEvent.capacity,
    } : undefined;

    return (
        <Loader isLoading={loading}>
            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                        {editingId ? "Edit Event" : "Add New Event"}
                    </h3>

                    <DynamicForm
                        config={eventFormConfig}
                        onSubmit={editingId ? handleUpdateEvent : handleAddEvent}
                        defaultValues={defaultValues}
                        key={editingId || "new"}
                        footer={
                            <>
                                <div className="space-y-2 mb-4">
                                    <TimeField
                                        startTime={startTime}
                                        endTime={endTime}
                                        onStartTimeChange={setStartTime}
                                        onEndTimeChange={setEndTime}
                                        error={validationError}
                                    />
                                </div>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingId(null);
                                            setStartTime(null);
                                            setEndTime(null);
                                        }}
                                        className="w-full"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </>
                        }
                    />
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
                                                    <p className="text-sm font-medium">Description:</p>
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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getEvents, updateEvent } from "@/lib/supabase/actions/events.actions";
import { FormEventType } from "@/types";
import { FormBuilder } from "./FormBuilder";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormConfig } from "@/lib/form-builder";

export const EventsFormEditor = () => {
    const [events, setEvents] = useState<FormEventType[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const { toast } = useToast();

    useEffect(() => {
        const fetch = async () => {
            const data = await getEvents();
            setEvents(data || []);
        };
        fetch();
    }, []);

    const selectedEvent = events.find(e => e.id === selectedEventId);

    const handleSaveConfig = async (config: FormConfig) => {
        if (!selectedEvent) return;

        const updatedEvent = { ...selectedEvent, formConfigJson: config };
        const error = await updateEvent(updatedEvent);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Form config saved" });
        }
    };

    return (
        <div className="space-y-4">
            <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                    {events.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedEvent && (
                <FormBuilder
                    key={selectedEvent.id}
                    initialConfig={selectedEvent.formConfigJson}
                    onSave={handleSaveConfig}
                />
            )}
        </div>
    );
};

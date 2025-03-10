import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as Clock, MapPin, Users, PlusCircle } from "lucide-react";
import { EventType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import clsx from "clsx";

interface EventCalendarProps {
    events: EventType[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { toast } = useToast();

    // Format events for calendar display
    const eventDates = events?.reduce((acc: Record<string, EventType[]>, event) => {
        const dateKey = event?.date;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {}) || [];

    // Get events for selected date
    const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
    const eventsOnSelectedDate = eventDates[selectedDateStr] || [];

    // Add to Google Calendar
    const addToGoogleCalendar = (event: EventType) => {
        const startTime = new Date(`${event?.date}T${event?.time}`);
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event?.title)}&details=${encodeURIComponent(event?.description)}&location=${encodeURIComponent(event?.location)}&dates=${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

        window.open(googleCalendarUrl, '_blank');
        toast({
            title: "Event Added to Google Calendar",
            description: `${event?.title} has been added to your calendar`,
        });
    };

    // Add to Apple Calendar
    const addToAppleCalendar = (event: EventType) => {
        const startTime = new Date(`${event?.date}T${event?.time}`);
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `SUMMARY:${event?.title}`,
            `DESCRIPTION:${event?.description}`,
            `LOCATION:${event?.location}`,
            `DTSTART:${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            `DTEND:${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${event?.title}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Event Added to Apple Calendar",
            description: `${event?.title} has been downloaded as an ICS file`,
        });
    };

    // Function to highlight dates with events
    const isDayWithEvent = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return !!eventDates[dateStr];
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="p-4 bg-white shadow-md rounded-lg w-full">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="h-full w-full flex"
                        classNames={{
                            months:
                                "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                            month: "space-y-4 w-full flex flex-col",
                            table: "w-full h-full border-collapse space-y-1",
                            head_row: "",
                            row: "w-full mt-2",
                        }}

                        modifiers={{
                            hasEvent: (date) => isDayWithEvent(date)
                        }}
                        modifiersStyles={{
                            selected: {
                                backgroundColor: "#2563eb"
                            },
                            hasEvent: {
                                backgroundColor: "#e0f2fe",
                                borderRadius: "0.375rem",
                                fontWeight: "bold",
                            }
                        }}
                    />
                    <div className="mt-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-sm bg-blue-100 mr-2"></div>
                            <span>Events scheduled</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                    </h2>

                    {eventsOnSelectedDate.length > 0 ? (
                        <div className="space-y-4">
                            {eventsOnSelectedDate.map((event) => (
                                <motion.div
                                    key={event?.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <h3 className="text-lg font-medium mb-2">{event?.title}</h3>
                                    <p className="text-gray-600 mb-3">{event?.description}</p>
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span>{event?.time}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{event?.location}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Users className="h-4 w-4 mr-2" />
                                            <span>Capacity: {event?.capacity}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-row max-sm:gap-6 md:flex md:space-x-2 lg:flex lg:space-x-2">
                                        <Button
                                            size="sm"
                                            className=" text-white"
                                            onClick={() => addToGoogleCalendar(event)}
                                        >
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Google Calendar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-gray-700 hover:bg-gray-800 text-white"
                                            onClick={() => addToAppleCalendar(event)}
                                        >
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Apple Calendar
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {selectedDate ? "No events scheduled for this date" : "Select a date to view events"}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default EventCalendar;
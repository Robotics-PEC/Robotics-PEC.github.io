import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { EventType } from "../types/index";
import { upcomingEvents } from "@/constants";


const Events = () => {
    const { toast } = useToast();

    const addToCalendar = (event: EventType) => {
        const startTime = new Date(`${event.date}T${event.time}`);
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

        window.open(googleCalendarUrl, '_blank');
        toast({
            title: "Event Added to Calendar",
            description: `${event.title} has been added to your calendar`,
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
            <Head>
                <title>Robotics Society | Punjab Engineering College</title>
                <meta name="description" content="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team." />
                <meta name="keywords" content="PEC Robotics, Punjab Engineering College, Robotics Society, Innovation, Automation, Engineering Projects" />
                <meta name="author" content="PEC Robotics Society" />
                <meta property="og:title" content="PEC Robotics Society - Punjab Engineering College" />
                <meta property="og:description" content="Discover groundbreaking robotics projects and cutting-edge automation innovations at PEC Robotics Society." />
                <meta property="og:image" content="/images/robotics-banner.jpg" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://roboticspec.com" />
                <link rel="canonical" href="https://roboticspec.com" />
            </Head>
            <Header />
            <main className="flex-grow py-24">
                <div className="container mx-auto px-4">
                    {upcomingEvents.length > 0 ?
                        <>
                            <div className="text-center mb-16">
                                <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
                                <p className="text-gray-600">Join us at our upcoming robotics events</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcomingEvents.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Card className="glass-card">
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                                                <p className="text-gray-600 mb-4">{event.description}</p>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Users className="h-4 w-4 mr-2" />
                                                        <span>Capacity: {event.capacity}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                                    onClick={() => addToCalendar(event)}
                                                >
                                                    Add to Calendar
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </> : (
                            <div className="text-center mb-16">
                                <h1 className="text-4xl font-bold mb-4">No upcoming events as of now!</h1>
                            </div>


                        )
                    }
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Events;
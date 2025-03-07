import Head from "next/head";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import EventCalendar from "@/components/EventCalendar";
import { upcomingEvents } from "@/constants";


const Events = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
            <Head>
                <title>Robotics Society | Punjab Engineering College</title>
                <link rel="icon" href="/favicon.png" />
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
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-medium mb-4">Upcoming Events</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join us at our upcoming events and be part of our community.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-16"
                    >
                        <EventCalendar events={upcomingEvents} />
                    </motion.div>

                    {upcomingEvents.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h2 className="text-2xl font-medium mb-6 text-center">List View</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcomingEvents.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Events;
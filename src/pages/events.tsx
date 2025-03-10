import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, MapPin } from "lucide-react";
import EventCalendar from "@/components/EventCalendar";
import { upcomingEvents } from "@/constants";

import PageLayout from "@/components/PageLayout";
import PageSection from "@/components/PageSection";
import PageHead from "@/components/PageHead";

const Events = () => {
    return (
        <PageLayout>
            {/* Meta tags for SEO Optimisations */}
            <PageHead
                title="Robotics Society | Punjab Engineering College"
                description="Upcoming Events at PEC Robotics Society. Join us at our upcoming events and be part of our community."
            />
            <section className="py-24" id="events">
                <PageSection
                    title="Upcoming Events"
                    subtitle="Join us at our upcoming events and be part of our community."
                >
                    <EventCalendar events={upcomingEvents} />
                </PageSection>

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
            </section>
        </PageLayout >
    );
};

export default Events;
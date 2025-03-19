import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, MapPin } from "lucide-react";
import EventCalendar from "@/pages/events/components/EventCalendar";
import PageLayout from "@/components/layout/PageLayout";
import PageSection from "@/components/layout/PageSection";
import PageHead from "@/components/layout/PageHead";
import { useEffect, useState } from "react";
import { getEvents } from "@/lib/supabase/actions/events.actions";
import { Loader } from "@/components/layout/Loader";
import { HTMLToMarkdown } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const Events = () => {

    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [loading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetch = async () => {
            const data = await getEvents();
            setUpcomingEvents(data!);
            setIsLoading(false);
        }

        fetch();
    });

    return (
        <Loader isLoading={loading}>
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

                        {upcomingEvents.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-center mt-10">List View</h2>
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
                                                    <div className="sm:text-lg prose">
                                                        <ReactMarkdown>
                                                            {HTMLToMarkdown(event.description)}
                                                        </ReactMarkdown>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-2" />
                                                            <span>{event.date}</span>
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
                    </PageSection>
                </section>
            </PageLayout >
        </Loader>
    );
};

export default Events;
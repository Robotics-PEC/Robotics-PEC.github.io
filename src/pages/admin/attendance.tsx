import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { client } from '@/lib/supabase/supabase';
import PageHead from '@/components/layout/PageHead';
import NotFound from '@/pages/404';
import { Loader } from "@/components/layout/Loader";
import { getEvents } from "@/lib/supabase/actions/events.actions";
import AttendanceManager from "./components/AttendanceManager";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "lucide-react";
import { FormEventType } from "@/types";

const AdminAttendancePage = () => {
    const [validUser, setValidUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<FormEventType[]>([]);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await client.auth.getSession();
            if (session) {
                setValidUser(true);
                const data = await getEvents();
                setEvents(data || []);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        const { data: subscription } = client.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                setValidUser(false);
                router.replace("/login");
            }
        });
        checkSession();

        return () => {
            subscription.subscription.unsubscribe();
        };
    }, [router]);

    if(loading) return <Loader isLoading={true}><></></Loader>

    return (
        <div className="container mx-auto py-12 px-4">
            <PageHead
                title="Attendance Management"
                description="Manage event attendance"
            />
            {validUser ? (
                <>
                    <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
                    <Accordion type="single" collapsible className="w-full">
                        {events.map((event) => (
                            <AccordionItem key={event.id} value={event.id}>
                                <AccordionTrigger>
                                    <div className="flex justify-between items-center w-full pr-4">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{event.title}</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-4">
                                        <AttendanceManager eventId={event.id} eventTitle={event.title} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </>
            ) : (<NotFound />)}
        </div>
    );
};

export default AdminAttendancePage;

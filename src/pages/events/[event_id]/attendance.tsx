import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";

const AttendancePage = () => {
    const router = useRouter();
    const { event_id } = router.query;
    const { toast } = useToast();

    const [event, setEvent] = useState<any>(null);
    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        if (!event_id) return;

        const fetchData = async () => {
            const { data: { user } } = await client.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data: eventData, error: eventError } = await client
                .from("events")
                .select("*")
                .eq("id", event_id)
                .single();

            const { data: regData, error: regError } = await client
                .from("registrations")
                .select("*")
                .eq("eventId", event_id)
                .eq("userId", user.id)
                .single();

            if (eventError || regError) {
                toast({ title: "Error", description: "Event/Registration not found", variant: "destructive" });
                router.push("/events");
                return;
            }

            setEvent(eventData);
            setRegistration(regData);
            setLoading(false);
        };
        fetchData();
    }, [event_id, router, toast]);

    const markAttendance = async () => {
        if (!event || !registration) return;

        setMarking(true);
        // Assuming RPC implementation exists
        const { error } = await client.rpc("mark_self_present", {
            p_event_id: event_id,
            p_user_id: registration.userId
        });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Attendance marked successfully" });
            setRegistration({ ...registration, attendedAt: new Date().toISOString() });
        }
        setMarking(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <PageHead
                title={`Mark Attendance - ${event.title}`}
                description={`Mark your attendance for ${event.title}`}
            />
            <section className="py-24 max-w-xl mx-auto px-4">
                <Card className="p-6">
                    <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
                    {registration.attendedAt ? (
                        <p className="text-green-600 font-semibold">
                            Attendance marked at: {new Date(registration.attendedAt).toLocaleString()}
                        </p>
                    ) : event.attendanceOpen ? (
                        <Button
                            onClick={markAttendance}
                            disabled={marking}
                            className="w-full"
                        >
                            {marking ? "Marking..." : "Mark Presence"}
                        </Button>
                    ) : (
                        <p className="text-red-500">Attendance is not currently open.</p>
                    )}
                </Card>
            </section>
        </>
    );
};

export default AttendancePage;

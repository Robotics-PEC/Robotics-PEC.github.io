import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getEventById } from "@/lib/supabase/actions/events.actions";
import { getRegistrations } from "@/lib/supabase/actions/registrations.actions";
import { getProfileFromUserId } from "@/lib/supabase/actions/profiles.actions";
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
        if (!event_id || typeof event_id !== 'string') return;

        const fetchData = async () => {
            const { data: { user } } = await client.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data: profile, error: profileError } = await getProfileFromUserId(user.id);

            if (profileError || !profile) {
                toast({ title: "Error", description: "Profile not found", variant: "destructive" });
                router.push("/events");
                return;
            }

            const { data: eventData, error: eventError } = await getEventById(event_id);
            const { data: regData, error: regError } = await getRegistrations(event_id);

            // Filter for current user's registration
            const userRegistration = regData?.find(r => r.userId === profile.id);

            if (eventError || !eventData || !userRegistration) {
                toast({ title: "Error", description: "Event/Registration not found", variant: "destructive" });
                router.push("/events");
                return;
            }

            setEvent(eventData);
            setRegistration(userRegistration);
            setLoading(false);
        };
        fetchData();
    }, [event_id, router, toast]);

    const markAttendance = async () => {
        if (!event || !registration || typeof event_id !== 'string') return;

        setMarking(true);
        // Using RPC as mentioned in handoff, but keeping it inside component as per existing style
        // If there's an action for this, it should be used here.
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

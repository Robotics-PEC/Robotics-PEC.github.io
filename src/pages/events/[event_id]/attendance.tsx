import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getEventById } from "@/lib/supabase/actions/events.actions";
import { getRegistrations } from "@/lib/supabase/actions/registrations.actions";
import { getProfileFromUserId } from "@/lib/supabase/actions/profiles.actions";
import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { DynamicForm } from "@/lib/form-builder";
import { submitAttendance } from "@/lib/supabase/actions/attendance.actions";
import { Loader } from "@/components/layout/Loader";

const AttendancePage = () => {
    const router = useRouter();
    const { event_id } = router.query;
    const { toast } = useToast();

    const [event, setEvent] = useState<any>(null);
    const [registration, setRegistration] = useState<any>(null);
    const [code, setCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    const validateAttendanceCode = async () => {
        if (!registration?.userId) return;
        setIsValidating(true);
        const { data: { session } } = await client.auth.getSession();
        const response = await fetch('/api/validate-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
                eventId: event_id,
                code,
                userId: registration.userId
            }),
        });
        const { isValid, error } = await response.json();
        if (isValid) {
            setIsVerified(true);
            toast({ title: "Success", description: "Code verified!" });
        } else {
            toast({ title: "Error", description: error || "Invalid code", variant: "destructive" });
        }
        setIsValidating(false);
    };

    const handleFormSubmit = async (values: any) => {
        if (!registration?.userId) return;
        setIsValidating(true);
        const { error } = await submitAttendance(event_id as string, registration.userId, values);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Attendance marked successfully!" });
            setRegistration({ ...registration, attendedAt: new Date().toISOString() });
        }
        setIsValidating(false);
    };

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

    if (loading) return <Loader isLoading={true}><></></Loader>;

    return (
        <Loader isLoading={false}>
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
                        !isVerified ? (
                            <div className="space-y-4 items-center justify-center">
                                <InputOTP maxLength={6} value={code} onChange={setCode} containerClassName="justify-center">
                                    <InputOTPGroup className="space-x-2">
                                        <InputOTPSlot index={0} className="h-14 w-14 rounded-md border-2 border-black" />
                                        <InputOTPSlot index={1} className="h-14 w-14 rounded-md border-2 border-black" />
                                        <InputOTPSlot index={2} className="h-14 w-14 rounded-md border-2 border-black" />
                                        <InputOTPSlot index={3} className="h-14 w-14 rounded-md border-2 border-black" />
                                        <InputOTPSlot index={4} className="h-14 w-14 rounded-md border-2 border-black" />
                                        <InputOTPSlot index={5} className="h-14 w-14 rounded-md border-2 border-black" />
                                    </InputOTPGroup>
                                </InputOTP>
                                <Button onClick={validateAttendanceCode} disabled={isValidating || code.length < 6} className="w-full">
                                    {isValidating ? "Validating..." : "Verify Code"}
                                </Button>
                            </div>
                        ) : (
                            <DynamicForm
                                config={event.attendanceFormConfigJson}
                                onSubmit={handleFormSubmit}
                            />
                        )
                    ) : (
                        <p className="text-red-500">Attendance is not currently open.</p>
                    )}
                </Card>
            </section>
        </Loader>
    );
};

export default AttendancePage;

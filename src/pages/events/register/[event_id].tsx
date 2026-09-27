import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHead from "@/components/layout/PageHead";
import DinoSubmitOverlay from "@/components/DinoSubmitOverlay";
import { useToast } from "@/hooks/use-toast";
import { getEventById } from "@/lib/supabase/actions/events.actions";
import { registerForEvent, checkRegistration } from "@/lib/supabase/actions/registrations.actions";
import { getCurrentUser } from "@/lib/supabase/actions/auth.actions";
import { fileToBase64 } from "@/lib/utils";
import { DynamicForm } from "@/lib/form-builder/DynamicForm";

const RegisterEvent = () => {
    const router = useRouter();
    const { event_id } = router.query;
    const { toast } = useToast();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!event_id) return;

        const fetchEvent = async () => {
            const { data, error } = await getEventById(event_id as string);
            if (error || !data) {
                toast({ title: "Error", description: "Event not found", variant: "destructive" });
                router.push("/events");
                setLoading(false);
                return;
            }
            setEvent(data);

            const { data: { session } } = await getCurrentUser();
            setUser(session?.user || null);

            if (session) {
                const { data: registered } = await checkRegistration(event_id as string);
                if (registered) setIsRegistered(true);
            }

            setLoading(false);
        };
        fetchEvent();
    }, [event_id, router, toast]);

    const handleRegister = async (values: any) => {
        setIsSubmitting(true);
        setSubmitError(false);

        let screenshotBase64 = null;
        if (values.paymentScreenshot) {
            screenshotBase64 = await fileToBase64(values.paymentScreenshot);
        }
        const { paymentScreenshot, ...formValues } = values;

        const { error } = await registerForEvent(event_id as string, formValues, screenshotBase64 || "");

        if (error) {
            toast({ title: "Error", description: error, variant: "destructive" });
            setSubmitError(true);
        } else {
            toast({ title: "Success", description: "Registration submitted successfully" });
            setIsRegistered(true);
        }
        setIsSubmitting(false);
    };

    return (
        <>
            {(loading || isSubmitting) && (
                <DinoSubmitOverlay
                    submitting={loading || isSubmitting}
                    onClose={() => setIsSubmitting(false)}
                    hasError={submitError}
                    title={loading ? "Loading event..." : "Submitting registration..."}
                    description={loading ? "Please wait while we load..." : "Processing your details."}
                />
            )}

            {!loading && (
                <>
                    <PageHead
                        title={`Register for ${event.title}`}
                        description={`Register for ${event.title} at Robotics Society of PEC.`}
                    />
                    <section className="py-24 max-w-2xl mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6">
                                <h1 className="text-2xl font-bold mb-4">{event.title} Registration</h1>
                                {!user ? (
                                    <div className="text-center py-10 bg-yellow-50 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold text-yellow-800">Login Required</h2>
                                        <p className="text-yellow-700 mt-2 mb-4">Please log in to register for this event.</p>
                                        <Button 
                                            onClick={() => {
                                                const returnUrl = `/events/register/${event_id}`;
                                                router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
                                            }}
                                        >
                                            Login
                                        </Button>
                                    </div>
                                ) : isRegistered ? (
                                    <div className="text-center py-10 bg-green-50 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold text-green-800">You have successfully registered!</h2>
                                        <p className="text-green-700 mt-2">See you there.</p>
                                    </div>
                                ) : event.formConfigJson?.sections ? (
                                    <DynamicForm
                                        config={event.formConfigJson}
                                        onSubmit={handleRegister}
                                    />
                                ) : (
                                    <p className="text-gray-500">Registration for this event is not open yet.</p>
                                )}
                            </Card>
                        </motion.div>
                    </section>
                </>
            )}
        </>
    );
};

export default RegisterEvent;

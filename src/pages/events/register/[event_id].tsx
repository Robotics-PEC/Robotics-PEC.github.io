import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import PageHead from "@/components/layout/PageHead";
import DinoSubmitOverlay from "@/components/DinoSubmitOverlay";
import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/supabase/supabase";
import { registerForEvent } from "@/lib/supabase/actions/registrations.actions";
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

    useEffect(() => {
        console.log({event_id});
        if (!event_id) return;

        const fetchEvent = async () => {
            const { data, error } = await client
                .from("events")
                .select("*")
                .eq("id", event_id)
                .single();

            if (error || !data) {
                toast({ title: "Error", description: "Event not found", variant: "destructive" });
                router.push("/events");
                return;
            }
            setEvent(data);
            setLoading(false);
        };
        fetchEvent();
    }, [event_id, router, toast]);

    const handleRegister = async (values: any) => {
        const screenshotFile = values.paymentScreenshot;
        if (!screenshotFile) {
            toast({ title: "Error", description: "Payment screenshot is required", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        setSubmitError(false);

        const screenshotBase64 = await fileToBase64(screenshotFile);
        const { paymentScreenshot, ...formValues } = values;

        const { error } = await registerForEvent(event_id as string, formValues, screenshotBase64);

        if (error) {
            toast({ title: "Error", description: error, variant: "destructive" });
            setSubmitError(true);
        } else {
            toast({ title: "Success", description: "Registration submitted successfully" });
            router.push("/events");
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
                                {event.formConfigJson?.sections ? (
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

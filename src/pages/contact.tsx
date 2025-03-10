import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, ValidationError } from "@formspree/react";
import { useToast } from "@/components/ui/use-toast";

import PageSection from "@/components/layout/PageSection";
import PageLayout from "@/components/layout/PageLayout";
import PageHead from "@/components/layout/PageHead";

const Contact = () => {
    const { toast } = useToast();
    const [state, handleSubmit] = useForm("meoebydn");

    useEffect(() => {
        if (state.succeeded) {
            toast({
                title: "Message Sent",
                description: "Thank you for reaching out! We will get back to you soon.",
            });

        }
    }, [state.succeeded, toast]);

    return (
        <PageLayout>
            {/* Meta tags for SEO Optimisations */}
            <PageHead
                title="Robotics Society | Punjab Engineering College"
                description="Contact the Robotics Society at Punjab Engineering College. Get in touch with our team for collaborations, sponsorships, or any queries."
            />
            <section className="py-24" id="contact">
                <PageSection
                    title="Contact Us"
                    subtitle="Get in touch with our team"
                >
                    <div className="grid grid-cols-1 gap-12 lg:max-w-[50%] mx-auto justify-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="glass-card p-8">
                                <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                                {state.succeeded ? (
                                    <p className="text-green-600 text-lg">Thank you for your message! We’ll get back to you soon.</p>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <Input placeholder="Your Name" name="name" required className="bg-white" />
                                        <Input type="email" placeholder="Your Email" name="email" required className="bg-white" />
                                        <ValidationError prefix="Email" field="email" errors={state.errors} />
                                        <Input placeholder="Subject" name="subject" required className="bg-white" />
                                        <Textarea placeholder="Your Message" name="message" required className="min-h-[150px] bg-white" />
                                        <ValidationError prefix="Message" field="message" errors={state.errors} />
                                        <Button type="submit" className="w-full  text-white" disabled={state.submitting}>
                                            {state.submitting ? "Sending..." : "Send Message"}
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </PageSection>
            </section>
        </PageLayout>
    );
};

export default Contact;

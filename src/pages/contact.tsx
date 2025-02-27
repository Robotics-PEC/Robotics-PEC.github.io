import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
            <Head>
                <title>Robotics Society | Punjab Engineering College</title>
                <meta name="description" content="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team." />
            </Head>
            <Header />
            <main className="flex-grow py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                        <p className="text-gray-600">Get in touch with our team</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
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
                                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={state.submitting}>
                                            {state.submitting ? "Sending..." : "Send Message"}
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                            <Card className="glass-card p-8">
                                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <h3 className="font-medium">Email</h3>
                                            <p className="text-gray-600">robotics@pec.edu.in</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <MapPin className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <h3 className="font-medium">Address</h3>
                                            <p className="text-gray-600">Punjab Engineering College, Sector 12, Chandigarh</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;

import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent",
            description: "Thank you for your message. We'll get back to you soon!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
            <Head>
                <title>Robotics Society | Punjab Engineering College</title>
                <meta name="description" content="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team." />
                <meta name="keywords" content="PEC Robotics, Punjab Engineering College, Robotics Society, Innovation, Automation, Engineering Projects" />
                <meta name="author" content="PEC Robotics Society" />
                <meta property="og:title" content="PEC Robotics Society - Punjab Engineering College" />
                <meta property="og:description" content="Discover groundbreaking robotics projects and cutting-edge automation innovations at PEC Robotics Society." />
                <meta property="og:image" content="/images/robotics-banner.jpg" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://roboticspec.com" />
                <link rel="canonical" href="https://roboticspec.com" />
            </Head>
            <Header />
            <main className="flex-grow py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                        <p className="text-gray-600">Get in touch with our team</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="glass-card p-8">
                                <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Input
                                            placeholder="Your Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="email"
                                            placeholder="Your Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            placeholder="Subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Your Message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="min-h-[150px] bg-white"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Send Message
                                    </Button>
                                </form>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <Card className="glass-card p-8">
                                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <h3 className="font-medium">Email</h3>
                                            <p className="text-gray-600">contact@roboticspec.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Phone className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <h3 className="font-medium">Phone</h3>
                                            <p className="text-gray-600">+91 123 456 7890</p>
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
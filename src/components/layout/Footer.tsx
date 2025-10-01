"use client";

import Link from "next/link";
import {
    Github,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Clock,
    BookOpen,
    Users,
    Calendar,
    ChevronRight,
    Book
} from "lucide-react";


const FooterSection: React.FC<{ title: string, description?: string, children: React.ReactNode }> = ({ title, description, children }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>)
            }
            <ul className="space-y-2">
                {children}
            </ul>
        </div>);
}

const About = () => {
    const socialLinks = [
        { href: "https://github.com/Robotics-PEC", icon: Github },
        { href: "https://www.linkedin.com/company/pec-robotics-society/", icon: Linkedin },
        { href: "https://www.instagram.com/robotics.society/", icon: Instagram },
        { href: "mailto:robotics@pec.edu.in", icon: Mail }
    ];
    return (
        <FooterSection
            title="Robotics Society"
            description="Pushing the boundaries of innovation through robotics and automation at Punjab Engineering College, Chandigarh."
        >
            <div className="flex space-x-4">
                {socialLinks.map(({ href, icon: Icon }, index) => (
                    <a
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Icon className="h-5 w-5" />
                    </a>
                ))}
            </div>
        </FooterSection>
    );
}

const QuickLinks = () => {
    const quickLinks = [
        { href: "/projects", label: "Projects" },
        { href: "/activities", label: "Activities" },
        { href: "/events", label: "Events" },
        { href: "/contact", label: "Contact" },
        { href: "/Docify", label: "Docify" },
        { href: "/pyq", label: "Previous Year Questions" }
    ];
    return (
        <div>
            <FooterSection
                title="Quick Links"
            >
                {quickLinks.map(({ href, label }, index) => (
                    <li key={index}>
                        <Link
                            href={href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                        >
                            <ChevronRight className="h-4 w-4 mr-1" />
                            {label}
                        </Link>
                    </li>
                ))}
            </FooterSection>
        </div>
    );
}

const Resources = () => {
    const resources = [
        { href: "/activities", label: "Workshops", icon: BookOpen },
        { href: "/#team", label: "Our Team", icon: Users },
        { href: "/events", label: "Upcoming Events", icon: Calendar },
        { href: "/resources", label: "Addition Resources", icon: Book }
    ];

    return (
        <div>
            <FooterSection
                title="Resources"
            >
                {resources.map(({ href, label, icon: Icon }, index) => (
                    <li key={index}>
                        <Link
                            href={href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            {label}
                        </Link>
                    </li>
                ))}
            </FooterSection>
        </div>
    );
}

const ContactInfo = () => {
    const contactInfo = [
        {
            icon: MapPin,
            text: "Punjab Engineering College, Sector 12, Chandigarh, 160012",
            isMultiline: true,
        },
        {
            icon: Mail,
            text: "robotics@pec.edu.in",
        },
        {
            icon: Clock,
            text: "Mon - Fri: 9:00 AM - 5:00 PM",
        },
    ];

    return (
        <div>
            <FooterSection
                title="Contact Info"
            >
                {contactInfo.map(({ icon: Icon, text, isMultiline }, index) => (
                    <li key={index} className={`flex items-${isMultiline ? "start" : "center"} space-x-3`}>
                        <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">{text}</span>
                    </li>
                ))}
            </FooterSection>
        </div>
    );
}

const Copyright = () => {
    return (
        <div className="mt-8 border-t pt-8">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} PEC Robotics Society. All rights reserved.
                </p>
                <div className="mt-2 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:text-foreground mr-4">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}

const Footer = () => {

    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* About Section */}
                    <About />

                    {/* Quick Links Section */}
                    <QuickLinks />

                    {/* Resources Section */}
                    <Resources />

                    {/* Contact Info Section */}
                    <ContactInfo />
                </div>

                {/* Copyright */}
                <Copyright />
            </div>
        </footer>
    );
};

export default Footer;

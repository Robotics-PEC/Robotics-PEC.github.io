"use client";

import Link from "next/link";
import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Clock, BookOpen, Users, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PEC Robotics</h3>
            <p className="text-sm text-muted-foreground">
              Pushing the boundaries of innovation through robotics and automation at Punjab Engineering College, Chandigarh.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Robotics-PEC" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/pec-robotics-society/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/robotics.society/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:robotics@pec.edu.in" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/Docify" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Docify
                </Link>
              </li>
              <li>
                <Link href="/pyq" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Previous Year Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/activities" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Punjab Engineering College, Sector 12, Chandigarh, 160012
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+91 123-456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">robotics@pec.edu.in</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        {/* <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with our latest projects and events
            </p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-10 px-3 text-sm rounded-md border border-input bg-background"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div> */}

        {/* Copyright */}
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
      </div>
    </footer>
  );
};

export default Footer;

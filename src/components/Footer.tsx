import { Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">PEC Robotics</h3>
            <p className="text-sm text-muted-foreground">
              Pushing the boundaries of innovation through robotics and automation.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Robotics-PEC" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:robotics@pec.edu.in" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-sm text-muted-foreground hover:text-foreground">
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/Docify" className="text-sm text-muted-foreground hover:text-foreground">
                  Docify
                </Link>
              </li>
              <li>
                <Link href="/pyq" className="text-sm text-muted-foreground hover:text-foreground">
                  Previous Year Questions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} PEC Robotics Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

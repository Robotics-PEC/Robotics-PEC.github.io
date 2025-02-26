
import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BookmarkPlus, BookmarkCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Activities = () => {
  const [bookmarkedActivities, setBookmarkedActivities] = useState<number[]>([]);

  const activities = [
    {
      id: 1,
      title: "Robotics Workshop 2024",
      description: "Hands-on workshop on building autonomous robots",
      date: "March 15, 2024",
      participants: 50
    },
    {
      id: 2,
      title: "AI in Robotics Seminar",
      description: "Expert talk on integrating AI with robotics",
      date: "April 2, 2024",
      participants: 75
    },
    {
      id: 3,
      title: "Robotics Competition",
      description: "Annual inter-university robotics competition",
      date: "May 10, 2024",
      participants: 100
    }
  ];

  const toggleBookmark = (id: number) => {
    setBookmarkedActivities(prev => 
      prev.includes(id) 
        ? prev.filter(activityId => activityId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Robotics Society | Punjab Engineering College</title>
        <meta name="description" content="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team." />
        <meta name="keywords" content="PEC Robotics, Punjab Engineering College, Robotics Society, Innovation, Automation, Engineering Projects" />
        <meta name="author" content="PEC Robotics Society" />
        <meta property="og:title" content="PEC Robotics Society - Punjab Engineering College" />
        <meta property="og:description" content="Discover groundbreaking robotics projects and cutting-edge automation innovations at PEC Robotics Society." />
        <meta property="og:image" content="/images/robotics-banner.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pecrobotics.com" />
        <link rel="canonical" href="https://pecrobotics.com" />
      </Head>
      <Header />
      <main className="flex-grow py-24 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Our Activities</h1>
            <p className="text-gray-600">Join us in our robotics journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-card">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{activity.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(activity.id)}
                      >
                        {bookmarkedActivities.includes(activity.id) ? (
                          <BookmarkCheck className="h-5 w-5" />
                        ) : (
                          <BookmarkPlus className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{activity.participants} participants</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Activities;

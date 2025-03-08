
import { motion } from "framer-motion";
import Head from "next/head";
import { Card } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getActivites } from "@/lib/supabase/actions/activities.actions";
import { Loader } from "@/components/Loader";
import { ActivityType } from "@/types";

const Activities = () => {

  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getActivites();
      setActivities(data);
      setLoading(false);
    };

    fetch();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen" >
          <Loader size="lg" variant="spinner" />
          <span className="mt-4 font-medium">Loading...</span>
        </div>
      ) : (

        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
          <Head>
            <link rel="icon" href="/favicon.png" />
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
              {activities.length > 0 ?
                <>
                  <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Our Activities</h1>
                    <p className="text-gray-600">Join us in our robotics journey</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {activities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          whileHover={{ y: -5 }}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold">{activity.title}</h3>
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
                  </motion.div>
                </>
                :
                <div className="text-center mb-16">
                  <h1 className="text-4xl font-bold mb-4">No Activities as of now!</h1>
                </div>

              }
            </div>

          </main >
          <Footer />
        </div >
      )}
    </>
  );
};

export default Activities;

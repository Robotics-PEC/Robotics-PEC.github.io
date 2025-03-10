
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getActivites } from "@/lib/supabase/actions/activities.actions";
import { Loader } from "@/components/layout/Loader";
import { ActivityType } from "@/types";

import PageHead from "@/components/layout/PageHead";
import PageLayout from "@/components/layout/PageLayout";
import PageSection from "@/components/layout/PageSection";

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
    <Loader isLoading={loading}>
      <PageLayout>
        <PageHead
          title="Robotics Society | Punjab Engineering College"
          description="Join us in our robotics journey. Explore our activities and be part of our community."
        />
        <section className="py-24" id="events">
          <PageSection
            title="Our Activities"
            subtitle="Join us in our robotics journey"
          >
            {activities.length > 0 ?
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
              :
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">No Activities as of now!</h1>
              </div>
            }
          </PageSection>
        </ section >
      </PageLayout >
    </Loader>
  );
};

export default Activities;

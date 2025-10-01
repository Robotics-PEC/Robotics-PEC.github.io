
import React, { useEffect, useState } from 'react'
import ResourceCard from './components/ResourceCard';
import { FormResourceType } from '@/types';
import PageHead from '@/components/layout/PageHead';
import { getResourceData } from '@/lib/supabase/actions/resources.actions';
import { toast } from '@/hooks/use-toast';
import { Loader } from '@/components/layout/Loader';
import PageSection from '@/components/layout/PageSection';


const ResourcePage = () => {

    const [data, setData] = useState<FormResourceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await getResourceData();

            if (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive"
                });
                return;
            }
            if (!data) {
                toast({
                    title: "Error",
                    description: "Could not fetch data",
                    variant: "destructive"
                });
                return;
            }
            setData(data);
            setLoading(false);
        };
        fetch();
    }, []);

    return (
        <Loader isLoading={loading}>
            <PageHead
                title="Robotics Society | Punjab Engineering College"
                description="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."
            />
            <section className="py-24" id="events">
                <PageSection
                    title="Resources"
                    subtitle="Feel Free to look at the resources"
                >
                    {data.length > 0 && data.map((resource: FormResourceType) => (
                        <ResourceCard resource={resource} key={resource.name} />
                    ))}
                </PageSection>
            </section>
        </Loader>
    )
}

export default ResourcePage;

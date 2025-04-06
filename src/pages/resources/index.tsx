import PageLayout from '@/components/layout/PageLayout'
import React, { useEffect, useState } from 'react'
import ResourceCard from './components/ResourceCard';
import { RepoType } from '@/types';
import PageHead from '@/components/layout/PageHead';
import { getResourceData } from '@/lib/supabase/actions/resources.actions';
import { toast } from '@/hooks/use-toast';
import { Loader } from '@/components/layout/Loader';


const ResourcePage = () => {

    const [data, setData] = useState<any[]>([]);
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
        <PageLayout>
            <Loader isLoading={loading}>
                <PageHead
                    title="Robotics Society | Punjab Engineering College"
                    description="PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."
                />
                <div className="my-10 px-10 py-10">
                    {data && data.map((repo) => (
                        <ResourceCard repo={repo} key={repo.name} />
                    ))}
                </div>
            </Loader>
        </PageLayout>
    )
}

export default ResourcePage;
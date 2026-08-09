import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageHead from '@/components/layout/PageHead';
import ApplicantList from '@/components/panelist/ApplicantList';

const DashboardPage = () => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const session = sessionStorage.getItem("panelist_session");
        if (!session) {
            router.push('/panelist');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) return null;

    return (
        <>
            <PageHead title="Interview Dashboard | PEC Robotics" />
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto flex gap-6 h-[80vh]">
                    
                    {/* Left 70% Area */}
                    <div className="w-[70%] h-full">
                        <ApplicantList />
                    </div>

                    {/* Right 30% Area - Placeholder for Panel Sidebar */}
                    <div className="w-[30%] h-full bg-white rounded-lg border p-6 flex flex-col items-center justify-center text-center text-gray-500 border-dashed border-2">
                        <p className="font-semibold text-lg text-gray-600 mb-2">Panel Status Sidebar</p>
                        <p className="text-sm">Placeholder for the PanelSidebar component.</p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default DashboardPage;

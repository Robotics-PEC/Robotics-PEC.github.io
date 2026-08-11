import ApplicantList from "@/components/panelist/ApplicantList";
import PanelSidebar from "@/components/panelist/PanelSidebar";
import NotFound from "@/pages/404";
import { useAuthRole } from "@/lib/useAuthRole";
import PageHead from "@/components/layout/PageHead";
import { useEffect } from "react";
import { useRouter } from "next/router";

const PanelistDashboard = () => {
    const { role, loading, userId } = useAuthRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !userId) {
            router.replace("/login");
        }
    }, [loading, userId, router]);

    if (loading || !userId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!role || (role.slug !== "admin" && role.slug !== "panelist")) {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Panelist Dashboard
                </h1>

                <div className="flex gap-6 h-[80vh]">
                    <div className="w-[70%] h-full">
                        <ApplicantList />
                    </div>

                    <div className="w-[30%] h-full">
                        <PanelSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelistDashboard;
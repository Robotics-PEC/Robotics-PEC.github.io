import ApplicantList from "@/components/panelist/ApplicantList";
import PanelSidebar from "@/components/panelist/PanelSidebar";
import { useEffect, useState } from "react";

const PanelistDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const session = sessionStorage.getItem("panelist_session");

        if (!session) {
            window.location.href = "/panelist";
            return;
        }

        setIsAuthenticated(true);
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
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
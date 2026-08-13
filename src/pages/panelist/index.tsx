import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthRole } from "@/lib/useAuthRole";
import NotFound from "@/pages/404";

const PanelistIndex = () => {
    const { role, loading, userId } = useAuthRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!userId) {
                router.replace("/login");
            } else if (role && (role.slug === "panelist" || role.slug === "admin")) {
                router.replace("/panelist/dashboard");
            }
        }
    }, [loading, userId, role, router]);

    if (loading || !userId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (role && (role.slug === "panelist" || role.slug === "admin")) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Redirecting to dashboard...</p>
            </div>
        );
    }

    return <NotFound />;
};

export default PanelistIndex;

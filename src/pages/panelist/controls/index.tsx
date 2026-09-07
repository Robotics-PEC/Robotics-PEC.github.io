import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthRole } from "@/lib/useAuthRole";
import NotFound from "@/pages/404";
import PageHead from "@/components/layout/PageHead";
import FeatureFlags from "@/pages/admin/components/FeatureFlags";
import ResultPublisher from "@/components/panelist/ResultPublisher";
import GameControls from "@/components/panelist/GameControls";

const PanelistControls = () => {
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

    if (!role || (role.slug !== "admin" && !role.slug.includes("panel"))) {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans px-4 py-8 sm:px-6 sm:py-12 selection:bg-gray-200 overflow-hidden relative">
            <PageHead title="Command Center | Dev Controls" />
            
            {/* Tech Grid Background */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 100% 50%, transparent 20%, rgba(0,0,0,0.1) 21%, rgba(0,0,0,0.1) 34%, transparent 35%, transparent),
                    radial-gradient(circle at 0% 50%, transparent 20%, rgba(0,0,0,0.1) 21%, rgba(0,0,0,0.1) 34%, transparent 35%, transparent)
                  `,
                  backgroundSize: "40px 40px"
                }}
            />
            <div 
                className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                style={{
                  backgroundImage: "linear-gradient(to right, #64748B 1px, transparent 1px), linear-gradient(to bottom, #64748B 1px, transparent 1px)",
                  backgroundSize: "40px 40px"
                }}
            />
            
            <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                <div className="border-b border-gray-200 pb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            Command Center
                        </h1>
                        <p className="text-gray-500 text-sm font-mono tracking-widest">
                            SYS.MODULE: GLOBAL_PLATFORM_STATE // ACCESS: ADMINISTRATOR
                        </p>
                    </div>
                    <div className="hidden sm:block text-right font-mono">
                        <p className="text-xs text-gray-400">SESSION ID</p>
                        <p className="text-sm font-bold tracking-widest text-gray-700">{userId.split("-")[0].toUpperCase()}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Panel wrapper */}
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm p-6 sm:p-8 relative rounded-xl">
                        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
                            <span className="bg-gray-900 text-white px-2 py-0.5 text-xs font-mono font-bold tracking-wider rounded-sm">SEC: 01</span>
                            <h2 className="text-sm text-gray-500 font-mono tracking-widest uppercase">Operations & Events</h2>
                        </div>
                        
                        <div>
                            <GameControls />
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm p-6 sm:p-8 relative rounded-xl">
                        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
                            <span className="bg-gray-900 text-white px-2 py-0.5 text-xs font-mono font-bold tracking-wider rounded-sm">SEC: 02</span>
                            <h2 className="text-sm text-gray-500 font-mono tracking-widest uppercase">Feature Flags & Overrides</h2>
                        </div>
                        
                        <div className="-mx-4 -my-4">
                            <FeatureFlags />
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm p-6 sm:p-8 relative rounded-xl">
                        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
                            <span className="bg-gray-900 text-white px-2 py-0.5 text-xs font-mono font-bold tracking-wider rounded-sm">SEC: 03</span>
                            <h2 className="text-sm text-gray-500 font-mono tracking-widest uppercase">Result Publishing Node</h2>
                        </div>
                        
                        <div>
                            <ResultPublisher />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelistControls;

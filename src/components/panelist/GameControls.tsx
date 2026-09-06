import { useState, useEffect } from "react";
import { client } from "@/lib/supabase/supabase";
import { useAuthRole } from "@/lib/useAuthRole";

const GameControls = () => {
    const { role } = useAuthRole();
    const isPanelist = role && (role.slug === "admin" || role.slug.includes("panel"));

    const [isGameEnabled, setIsGameEnabled] = useState<boolean | null>(null);
    const [isResultsPublished, setIsResultsPublished] = useState<boolean>(false);
    
    const [isToggling, setIsToggling] = useState(false);
    const [isTogglingResults, setIsTogglingResults] = useState(false);

    useEffect(() => {
        // Fetch current game state from backend
        const fetchState = async () => {
            try {
                const res = await fetch("/api/game/leaderboard");
                if (res.ok) {
                    const data = await res.json();
                    setIsGameEnabled(data.isGameEnabled);
                    setIsResultsPublished(data.isResultsPublished);
                }
            } catch (err) {
                console.error("Failed to fetch game state", err);
            }
        };
        fetchState();
    }, []);

    const handleToggleGame = async () => {
        setIsToggling(true);
        try {
            const { data: { session } } = await client.auth.getSession();
            
            const res = await fetch("/api/game/toggle", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token || ""}`
                },
                body: JSON.stringify({ enabled: !isGameEnabled })
            });
            if (res.ok) {
                setIsGameEnabled(!isGameEnabled);
            } else {
                console.error("Toggle failed with status:", res.status);
            }
        } catch (err) {
            console.error("Failed to toggle game", err);
        } finally {
            setIsToggling(false);
        }
    };

    const handleToggleResults = async () => {
        setIsTogglingResults(true);
        try {
            const { data: { session } } = await client.auth.getSession();
            
            const res = await fetch("/api/game/toggle", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token || ""}`
                },
                body: JSON.stringify({ action: "toggleResults", resultsPublished: !isResultsPublished })
            });
            if (res.ok) {
                setIsResultsPublished(!isResultsPublished);
            } else {
                console.error("Toggle results failed with status:", res.status);
            }
        } catch (err) {
            console.error("Failed to toggle results", err);
        } finally {
            setIsTogglingResults(false);
        }
    };

    if (!isPanelist) return null;

    if (isGameEnabled === null) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between h-20">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-3 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between h-20">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-3 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Game Controls</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage the Dino game state and leaderboard publishing.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Dino Game Status</p>
                        <p className="text-sm text-gray-500">{isGameEnabled ? 'Live & Accepting Scores' : 'Disabled / Suspended'}</p>
                    </div>
                    <button 
                        onClick={handleToggleGame}
                        disabled={isToggling}
                        className={`px-5 py-2 rounded-md font-semibold text-white transition-opacity text-sm ${isToggling ? 'opacity-50' : ''} ${isGameEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        {isGameEnabled ? "Disable Game" : "Enable Game"}
                    </button>
                </div>

                <div className="p-5 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Game Leaderboard</p>
                        <p className="text-sm text-gray-500">{isResultsPublished ? 'Visible to public' : 'Hidden'}</p>
                    </div>
                    <button 
                        onClick={handleToggleResults}
                        disabled={isTogglingResults}
                        className={`px-5 py-2 rounded-md font-semibold text-white transition-opacity text-sm ${isTogglingResults ? 'opacity-50' : ''} ${isResultsPublished ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {isResultsPublished ? "Hide Leaderboard" : "Publish Leaderboard"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameControls;

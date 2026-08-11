import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ApplicantType } from "@/types";
import { fetchApplicants, subscribeToApplicantUpdates, fetchApplicantWithResponses } from "@/lib/supabase/actions/applicants.actions";
import ApplicantCard from "./ApplicantCard";
import ApplicantFormView from "./ApplicantFormView";
import WalkInModal from "./WalkInModal";

const ApplicantList = () => {
    const [applicants, setApplicants] = useState<ApplicantType[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApplicant, setSelectedApplicant] = useState<ApplicantType | null>(null);
    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadApplicants = async () => {
        setIsLoading(true);
        const data = await fetchApplicants();
        setApplicants(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadApplicants();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToApplicantUpdates(
            (updatedApplicant) => {
                setApplicants((current) =>
                    current.map((app) => (app.id === updatedApplicant.id ? updatedApplicant : app))
                );
                
                setSelectedApplicant((current) => {
                    if (current && current.id === updatedApplicant.id) {
                        return updatedApplicant;
                    }
                    return current;
                });

                if (updatedApplicant.status === "rejected") {
                    const audio = new Audio("/sounds/faah.mp3");
                    audio.volume = 1.0;
                    audio.play().catch(e => console.log("Meme audio blocked/failed:", e));
                }
            },
            (newApplicant) => {
                setApplicants((current) => {
                    if (current.some(app => app.id === newApplicant.id)) return current;
                    return [newApplicant, ...current];
                });
            }
        );

        return unsubscribe;
    }, []);

    const handleWalkInSuccess = (newApplicant: ApplicantType) => {
        setApplicants(prev => [newApplicant, ...prev]);
        setSelectedApplicant(newApplicant);
    };

    const statusOrder: Record<string, number> = {
        'pending': 1,
        'accepted': 2,
        'rejected': 3
    };

    const handleSelectApplicant = async (applicant: ApplicantType) => {
        if (applicant.isWalkin || (applicant.branch && applicant.q1)) {
            setSelectedApplicant(applicant);
            return;
        }
        
        const fullApplicant = await fetchApplicantWithResponses(applicant.id);
        if (fullApplicant) {
            setSelectedApplicant(fullApplicant);
            setApplicants(current =>
                current.map(app => app.id === fullApplicant.id ? fullApplicant : app)
            );
        } else {
            setSelectedApplicant(applicant);
        }
    };

    const filteredApplicants = applicants
        .filter(app => 
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            app.sid.includes(searchQuery)
        )
        .sort((a, b) => {
            const orderA = statusOrder[a.status] || 99;
            const orderB = statusOrder[b.status] || 99;
            return orderA - orderB;
        });

    if (selectedApplicant) {
        return <ApplicantFormView 
            applicant={selectedApplicant} 
            onBack={() => setSelectedApplicant(null)}
            onStatusUpdate={(updatedApp) => {
                setApplicants(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
                setSelectedApplicant(updatedApp);
            }}
        />;
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border">
            <div className="p-4 border-b flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search by name or SID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button onClick={() => setShowWalkInModal(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Walk-In
                </Button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading applicants...</div>
                ) : filteredApplicants.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No applicants found.</div>
                ) : (
                    filteredApplicants.map(app => (
                        <ApplicantCard key={app.id} applicant={app} onClick={handleSelectApplicant} />
                    ))
                )}
            </div>

            <WalkInModal 
                isOpen={showWalkInModal} 
                onClose={() => setShowWalkInModal(false)} 
                onSuccess={handleWalkInSuccess} 
            />
        </div>
    );
};

export default ApplicantList;

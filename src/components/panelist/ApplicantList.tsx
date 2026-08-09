import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ApplicantType } from "@/types";
import { fetchApplicants } from "@/lib/supabase/actions/applicants.actions";
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

    const handleWalkInSuccess = (newApplicant: ApplicantType) => {
        setApplicants(prev => [newApplicant, ...prev]);
        setSelectedApplicant(newApplicant);
    };

    const statusOrder: Record<string, number> = {
        'pending': 1,
        'accepted': 2,
        'rejected': 3
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
        return <ApplicantFormView applicant={selectedApplicant} onBack={() => setSelectedApplicant(null)} />;
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
                        <ApplicantCard key={app.id} applicant={app} onClick={setSelectedApplicant} />
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

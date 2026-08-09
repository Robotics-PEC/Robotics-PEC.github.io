import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWalkIn } from "@/lib/supabase/actions/applicants.actions";
import { ApplicantType } from "@/types";
import { useToast } from "@/hooks/use-toast";

export interface WalkInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newApplicant: ApplicantType) => void;
}

const WalkInModal = ({ isOpen, onClose, onSuccess }: WalkInModalProps) => {
    const [name, setName] = useState("");
    const [sid, setSid] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !sid) {
            toast({
                title: "Error",
                description: "Name and SID are required.",
                variant: "destructive"
            });
            return;
        }

        if (sid.length !== 8) {
            toast({
                title: "Error",
                description: "SID must be exactly 8 characters.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        const newApplicant = await createWalkIn(name, sid, phone);
        setIsLoading(false);

        if (newApplicant) {
            toast({ title: "Success", description: "Walk-in applicant registered." });
            onSuccess(newApplicant);
            setName("");
            setSid("");
            setPhone("");
            onClose();
        } else {
            toast({ title: "Error", description: "Failed to create applicant.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register Walk-In Applicant</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sid">SID</Label>
                        <Input id="sid" value={sid} onChange={e => setSid(e.target.value.replace(/\D/g, ''))} placeholder="8-digit SID" maxLength={8} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Register"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WalkInModal;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addWalkInAttendance } from "@/lib/supabase/actions/attendance.actions";

export const AttendanceManager = ({ eventId, eventTitle }: { eventId: string; eventTitle: string }) => {
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [otpCode, setOtpCode] = useState("");

    useEffect(() => {
        const fetchCode = async () => {
            const response = await fetch('/api/get-attendance-code');
            const data = await response.json();
            if (data.code) {
                setOtpCode(data.code);
            }
        };

        fetchCode();
        const interval = setInterval(fetchCode, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAddWalkIn = async () => {
        if (!name || !studentId) {
            toast({ title: "Error", description: "Name and Student ID required", variant: "destructive" });
            return;
        }

        const error = await addWalkInAttendance(eventId, name, studentId);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Walk-in added" });
            setName("");
            setStudentId("");
        }
    };

    return (
        <Card className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Attendance: {eventTitle}</h4>
            {otpCode && (
                <div className="p-3 bg-slate-100 rounded-md text-center">
                    <p className="text-sm text-gray-500">Current Attendance Code:</p>
                    <p className="text-3xl font-mono font-bold tracking-widest">{otpCode}</p>
                </div>
            )}
            <div className="flex gap-2">
                <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                <Button onClick={handleAddWalkIn}>Add Walk-in</Button>
            </div>
            {/* TODO: Add Table view of real-time attendance */}
        </Card>
    );
};

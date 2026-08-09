import { panelistClient } from "../panelistClient";
import { ApplicantType } from "@/types";

export const fetchApplicants = async (): Promise<ApplicantType[]> => {
    const { data, error } = await panelistClient
        .from("applicants")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching applicants:", error);
        return [];
    }
    return data as ApplicantType[];
};

export const createWalkIn = async (name: string, sid: string, phone: string): Promise<ApplicantType | null> => {
    const { data, error } = await panelistClient
        .from("applicants")
        .insert([
            { name, sid, phone, is_walkin: true, status: 'pending' }
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating walk-in:", error);
        return null;
    }
    return data as ApplicantType;
};
export const updateApplicantDecision = async (
    applicantId: string,
    status: "accepted" | "rejected",
    remarks: string,
    reviewedBy: string
): Promise<boolean> => {
    const { error } = await panelistClient
        .from("applicants")
        .update({
            status,
            remarks,
            reviewed_by: reviewedBy,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicantId);

    if (error) {
        console.error("Error updating applicant decision:", error);
        return false;
    }

    return true;
};
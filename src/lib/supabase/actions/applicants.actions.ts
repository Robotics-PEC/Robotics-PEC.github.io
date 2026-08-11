import { panelistClient } from "../panelistClient";
import { ApplicantType } from "@/types";

export type CreateApplicantResult =
    | {
          success: true;
          applicant: ApplicantType;
      }
    | {
          success: false;
          reason: "duplicate" | "error";
      };

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

export const createWalkIn = async (
    name: string,
    sid: string,
    phone: string
): Promise<ApplicantType | null> => {
    const { data, error } = await panelistClient
        .from("applicants")
        .insert([
            {
                name,
                sid,
                phone,
                is_walkin: true,
                status: "pending",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating walk-in:", error);
        return null;
    }

    return data as ApplicantType;
};

export const createApplicant = async (
    name: string,
    sid: string,
    branch: string,
    q1: string,
    q2: string,
    q3: string,
    q4: string
): Promise<CreateApplicantResult> => {
    const { data, error } = await panelistClient
        .from("applicants")
        .insert([
            {
                name,
                sid,
                branch,
                q1,
                q2,
                q3,
                q4,
                is_walkin: false,
                status: "pending",
            },
        ])
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            console.error("Duplicate application:", error);

            return {
                success: false,
                reason: "duplicate",
            };
        }

        console.error("Error creating applicant:", error);
        console.error("Error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        });

        return {
            success: false,
            reason: "error",
        };
    }

    return {
        success: true,
        applicant: data as ApplicantType,
    };
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

export const subscribeToApplicantUpdates = (
    onUpdate: (applicant: ApplicantType) => void,
    onInsert: (applicant: ApplicantType) => void
) => {
    const channel = panelistClient
        .channel("applicants-status")
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "applicants",
            },
            (payload) => {
                onUpdate(payload.new as ApplicantType);
            }
        )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "applicants",
            },
            (payload) => {
                onInsert(payload.new as ApplicantType);
            }
        )
        .subscribe();

    return () => {
        panelistClient.removeChannel(channel);
    };
};
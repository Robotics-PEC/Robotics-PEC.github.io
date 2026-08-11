import { client } from "../supabase";
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
    const { data, error } = await client
        .from("applicants")
        .select("*, applicant_response(branch, q1, q2, q3, q4)")
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Error fetching applicants:", error);
        return [];
    }

    return (data as any[]).map((item) => {
        const response = item.applicant_response;
        const responseData = Array.isArray(response) ? response[0] : response;
        return {
            ...item,
            branch: responseData?.branch,
            q1: responseData?.q1,
            q2: responseData?.q2,
            q3: responseData?.q3,
            q4: responseData?.q4,
        };
    }) as ApplicantType[];
};

export const fetchApplicantWithResponses = async (id: string): Promise<ApplicantType | null> => {
    const { data, error } = await client
        .from("applicants")
        .select("*, applicant_response(branch, q1, q2, q3, q4)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching applicant with responses:", error);
        return null;
    }

    const response = (data as any).applicant_response;
    const responseData = Array.isArray(response) ? response[0] : response;

    return {
        ...data,
        branch: responseData?.branch,
        q1: responseData?.q1,
        q2: responseData?.q2,
        q3: responseData?.q3,
        q4: responseData?.q4,
    } as ApplicantType;
};

export const createWalkIn = async (
    name: string,
    sid: string,
    phone: string
): Promise<ApplicantType | null> => {
    const { data, error } = await client
        .from("applicants")
        .insert([
            {
                name,
                sid,
                phone,
                isWalkin: true,
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
    const { data: applicantData, error: applicantError } = await client
        .from("applicants")
        .insert([
            {
                name,
                sid,
                isWalkin: false,
                status: "pending",
            },
        ])
        .select()
        .single();

    if (applicantError) {
        if (applicantError.code === "23505") {
            console.error("Duplicate application:", applicantError);
            return {
                success: false,
                reason: "duplicate",
            };
        }

        console.error("Error creating applicant:", applicantError);
        console.error("Error details:", {
            message: applicantError.message,
            details: applicantError.details,
            hint: applicantError.hint,
            code: applicantError.code,
        });

        return {
            success: false,
            reason: "error",
        };
    }

    const { error: responseError } = await client
        .from("applicant_response")
        .insert([
            {
                applicantId: applicantData.id,
                branch,
                q1,
                q2,
                q3,
                q4,
            },
        ]);

    if (responseError) {
        console.error("Error creating applicant response:", responseError);
        await client.from("applicants").delete().eq("id", applicantData.id);
        
        return {
            success: false,
            reason: "error",
        };
    }

    return {
        success: true,
        applicant: {
            ...applicantData,
            branch,
            q1,
            q2,
            q3,
            q4,
        } as ApplicantType,
    };
};

export const updateApplicantDecision = async (
    applicantId: string,
    status: "accepted" | "rejected",
    remarks: string,
    reviewedBy: string
): Promise<boolean> => {
    const { error } = await client
        .from("applicants")
        .update({
            status,
            remarks,
            reviewedBy: reviewedBy,
            reviewedAt: new Date().toISOString(),
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
    const channel = client
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
        client.removeChannel(channel);
    };
};
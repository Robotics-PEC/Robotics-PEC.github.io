import { client } from "@/lib/supabase/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export interface QuestionPaper {
    id: string;
    courseCode: string;
    year: number;
    type: "midterm" | "endterm";
    filePath: string;
    uploaderId: string;
    isVerified: boolean;
    created_at: string;
}

export const fetchVerifiedPapers = async () => {
    const { data, error } = await client
        .from("questionPapers")
        .select("*")
        .eq("isVerified", true)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data as QuestionPaper[];
};

export const fetchAllPapers = async () => {
    const { data, error } = await client
        .from("question_papers_admin_view")
        .select("*");

    if (error) {
        throw new Error(error.message);
    }
    return data as QuestionPaper[];
};

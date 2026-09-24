import { client } from "../supabase";

export const getAttendanceForEvent = async (eventId: string) => {
    const { data, error } = await client
        .from("attendance")
        .select(`*, profiles("fullName", email)`)
        .eq("eventId", eventId);

    if (error) return { error: error.message };
    return { data };
};

export const addWalkInAttendance = async (eventId: string, name: string, studentId: string) => {
    const { error } = await client
        .from("attendance")
        .insert({
            eventId,
            recordType: 'walkin',
            name,
            studentId,
            markedBy: 'admin_override' // Assuming admin added it
        });
    return error;
};

// ... TODO: Add TOTP validation and self-mark actions

import { client } from "../supabase";
import { getProfileFromUserId } from "./profiles.actions";

enum AttendanceMarkType {
    SELF = 'self',
    ADMIN= 'admin_override'
}

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

export const submitAttendance = async (eventId: string, userId: string, responseJson: any) => {
    const { error } = await client
        .from("registrations")
        .update({
            attendanceResponseJson: responseJson,
            attendedAt: new Date().toISOString(),
            markedBy: AttendanceMarkType.SELF
        })
        .eq("eventId", eventId)
        .eq("userId", userId);

    return { error };
};

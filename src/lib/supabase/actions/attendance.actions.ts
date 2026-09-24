import { client } from "../supabase";
import { getProfileFromUserId } from "./profiles.actions";

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

export const submitAttendance = async (eventId: string, responseJson: any) => {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await getProfileFromUserId(user.id);
    if (!profile) return { error: "Profile not found" };

    const { error } = await client
        .from("attendance")
        .insert({
            eventId,
            userId: profile.id,
            recordType: 'registered_attendee',
            responseJson,
            markedBy: 'self'
        });

    return { error };
};

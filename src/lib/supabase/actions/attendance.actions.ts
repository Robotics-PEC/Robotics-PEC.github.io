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

export const submitAttendance = async (eventId: string, userId: string, responseJson: any, userGeoLocation?: { lat: number, lng: number }) => {
    if (userGeoLocation) {
        const { data: isNearby, error: rpcError } = await client.rpc('check_attendance_location', {
            p_event_id: eventId,
            p_user_lat: userGeoLocation.lat,
            p_user_lng: userGeoLocation.lng
        });
        if (rpcError || !isNearby) {
            return { error: { message: "Attendance could not be captured due to location mismatch or error. Please contact Admin for assistance" } };
        }
    }

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

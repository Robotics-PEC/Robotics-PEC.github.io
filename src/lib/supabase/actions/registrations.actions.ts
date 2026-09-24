import { client } from "../supabase";
import { getProfileFromUserId } from "./profiles.actions";

export const registerForEvent = async (eventId: string, responseJson: any, screenshotBase64: string) => {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile, error: profileError } = await getProfileFromUserId(user.id);

    if (profileError || !profile) return { error: "Profile not found" };

    // 1. Upload screenshot
    const filename = `registrations/${eventId}/${profile.id}-${Date.now()}.png`;
    const { error: uploadError } = await client.storage
        .from('event-screenshots')
        .upload(filename, Buffer.from(screenshotBase64, 'base64'), {
            contentType: 'image/png'
        });

    if (uploadError) return { error: uploadError.message };

    // 2. Insert registration
    const { error: dbError } = await client
        .from("registrations")
        .insert({
            "eventId": eventId,
            "userId": profile.id,
            "responseJson": responseJson,
            "screenshotPath": filename
        });

    if (dbError) return { error: dbError.message };

    return { data: "success" };
};

export const getRegistrations = async (eventId: string) => {
    const { data, error } = await client
        .from("registrations")
        .select(`*, profiles("fullName", email)`)
        .eq("eventId", eventId);

    if (error) return { error: error.message };

    return { data };
};

export const checkRegistration = async (eventId: string) => {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: false, error: null };

    const { data: profile, error: profileError } = await getProfileFromUserId(user.id);

    if (profileError || !profile) return { data: false, error: null };

    const { count, error } = await client
        .from("registrations")
        .select("*", { count: 'exact', head: true })
        .eq("eventId", eventId)
        .eq("userId", profile.id);

    return { data: (count ?? 0) > 0, error };
};

export const getRegistrationsForUser = async () => {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data: profile, error: profileError } = await getProfileFromUserId(user.id);

    if (profileError || !profile) return { data: [], error: null };

    const { data, error } = await client
        .from("registrations")
        .select("eventId")
        .eq("userId", profile.id);

    return { data: data?.map(r => r.eventId) || [], error };
};

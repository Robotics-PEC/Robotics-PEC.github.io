import { client } from "../supabase";

export const registerForEvent = async (eventId: string, responseJson: any, screenshotBase64: string) => {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // 1. Upload screenshot
    const filename = `registrations/${eventId}/${user.id}-${Date.now()}.png`;
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
            "userId": user.id,
            "responseJson": responseJson,
            "screenshotPath": filename
        });

    if (dbError) return { error: dbError.message };

    return { data: "success" };
};

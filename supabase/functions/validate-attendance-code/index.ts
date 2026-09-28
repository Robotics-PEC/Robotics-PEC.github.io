import { createClient } from "npm:@supabase/supabase-js@2";
import { TOTP } from "https://esm.sh/otpauth@9.3.1";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const { eventId, code } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    // Fetch event secret
    const { data: event, error: eventError } = await adminClient.from("events").select("attendanceSecret").eq("id", eventId).single();
    if (eventError || !event?.attendanceSecret) {
      throw new Error("Event not found or no secret configured");
    }
    // Validate TOTP
    let totp = new TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: event.attendanceSecret
    });
    // window: 1 allows current interval + 1 interval back (covers 15s grace period)
    const isValid = totp.validate({
      token: code,
      window: 1
    }) !== null;
    return new Response(JSON.stringify({
      isValid
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});

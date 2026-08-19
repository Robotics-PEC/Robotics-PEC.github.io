import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Verify Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // 2. Verify Role (Must be panelist or admin)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("userRoles(roles(slug))")
      .eq("userId", user.id)
      .maybeSingle();

    const profile = profileData as any;

    const roleData = Array.isArray(profile?.userRoles)
      ? profile.userRoles[0]?.roles
      : profile?.userRoles?.roles;
      
    const roleSlug = roleData?.slug;

    if (roleSlug !== "admin" && !roleSlug?.includes("panel")) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    // 3. Forward to Google Apps Script
    const { enabled } = req.body;
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        action: "toggleGame",
        enabled: enabled,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ error: "Failed to toggle game on backend" });
    }
  } catch (error) {
    console.error("Toggle error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

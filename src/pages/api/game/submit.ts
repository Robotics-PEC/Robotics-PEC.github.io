import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;
    
    // We get the secret and script URL from the .env
    const secret = process.env.GAME_SECRET;
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!secret || !scriptUrl) {
      console.error("Missing GAME_SECRET or GOOGLE_APPS_SCRIPT_URL");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Convert the payload to a string
    const payloadString = JSON.stringify(payload);

    // Create a SHA-256 HMAC signature
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payloadString)
      .digest("hex");

    // Fire-and-forget: we send the payload to Google Apps Script in the background
    // and immediately return a 200 OK so the user is never blocked.
    fetch(scriptUrl, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        payload: payload,
        signature: signature,
      }),
    }).catch(err => console.error("Background Apps Script POST failed:", err));

    return res.status(200).json({ success: true, message: "Score submitted asynchronously" });
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

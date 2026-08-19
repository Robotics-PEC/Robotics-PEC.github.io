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

    // We send the payload AND the signature to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      // Apps script doesn't need 'no-cors' from server side if following redirects manually or if Apps Script returns proper JSON redirect, but usually follow is default
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain", // Apps Script doPost often prefers text/plain
      },
      body: JSON.stringify({
        payload: payload,
        signature: signature,
      }),
    });

    const responseText = await response.text();
    console.log("Apps Script Response:", responseText);

    if (response.ok) {
      return res.status(200).json({ success: true, message: "Score submitted" });
    } else {
      return res.status(500).json({ error: "Failed to forward to Apps Script" });
    }
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

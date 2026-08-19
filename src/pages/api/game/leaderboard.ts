import type { NextApiRequest, NextApiResponse } from "next";

// Global variables persist across function invocations in serverless (mostly)
let cachedData: any = null;
let lastFetchTime: number = 0;
const CACHE_TTL_MS = 10000; // 10 seconds

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = Date.now();
    
    // Return cached data if it's fresh
    if (cachedData && (now - lastFetchTime < CACHE_TTL_MS)) {
      return res.status(200).json(cachedData);
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Fetch the leaderboard data from Google Apps Script
    const response = await fetch(scriptUrl, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update cache
      cachedData = data;
      lastFetchTime = Date.now();

      return res.status(200).json(data);
    } else {
      // If Apps Script fails but we have stale cache, serve the stale cache to avoid breaking the frontend
      if (cachedData) {
        return res.status(200).json(cachedData);
      }
      return res.status(500).json({ error: "Failed to fetch from Apps Script" });
    }
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    // Serve stale cache on hard errors (timeout, crash)
    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

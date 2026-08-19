import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
      
      // The magic of CDN Edge caching (Stale-While-Revalidate)
      // Serve cached content for 10s. If older than 10s, serve stale instantly and refetch in background
      res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
      
      return res.status(200).json(data);
    } else {
      return res.status(500).json({ error: "Failed to fetch from Apps Script" });
    }
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

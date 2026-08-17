import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!,
  process.env.NEXT_SUPABASE_SECRET_KEY_SANCTION!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const allowedOrigins = [
        "https://roboticspec.com",
        "https://www.roboticspec.com",
        "http://localhost:8000",
    ];
    
    const origin = req.headers.origin;

    if (!origin || !allowedOrigins.includes(origin)) {
        res.status(403).json({
            error: "Origin not allowed",
        });
        return;
    }

    res.setHeader(
        "Access-Control-Allow-Origin",
        origin || "http://localhost:8000"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, X-Filename"
    );

  // Handle browser CORS preflight
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  try {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    if (!buffer.length) {
      res.status(400).json({
        error: "Empty PDF",
      });
      return;
    }

    const fileName = req.headers["x-filename"]?.toString() || "document.pdf";

    const baseName = fileName.replace(/\.pdf$/i, "");
    const randomSuffix = crypto.randomUUID();

    const filePath = `sanctions/${baseName}_${randomSuffix}.pdf`;

    const { data, error } = await supabase.storage
      .from("sanctions")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage error:", error);

      res.status(500).json({
        error: "Failed to upload PDF",
      });
      return;
    }

    res.status(200).json({
      success: true,
      path: data.path,
    });
    return;
  } catch (error) {
    console.error("PDF upload error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
    return;
  }
}
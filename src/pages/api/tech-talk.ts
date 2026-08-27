import { NextApiRequest, NextApiResponse } from "next";

import { TechTalkDetails } from "@/types";
import { createClient } from "@supabase/supabase-js";
import { client } from "@/lib/supabase/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


const getSupabaseClient = (req: NextApiRequest) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Missing authorization token");
    }
  
    const token = authHeader.substring(7);
  
    return createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );
  };

export const getTechTalkDetails = async (showName: string) => {
  const { data, error } = await client
    .from("techTalk")
    .select("*")
    .eq("showName", showName)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch Tech Talk details:", error);
    throw new Error(`Failed to fetch Tech Talk details: ${error.message}`);
  }

  return data as TechTalkDetails | null;
};

export const updateTechTalkDetails = async (
  req: NextApiRequest,
  showName: string,
  updates: Partial<TechTalkDetails>,
) => {
  const { data, error } = await getSupabaseClient(req)
    .from("techTalk")
    .update(updates)
    .eq("showName", showName)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to update Tech Talk details:", error);
    throw new Error(`Failed to update Tech Talk details: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Tech Talk show "${showName}" was not found`);
  }

  return data as TechTalkDetails;
};

export const insertTechTalkDetails = async (
  req: NextApiRequest,
  details: TechTalkDetails,
) => {
  const { data, error } = await getSupabaseClient(req)
    .from("techTalk")
    .insert(details)
    .select()
    .single();

  if (error) {
    console.error("Failed to insert Tech Talk details:", error);
    throw new Error(`Failed to insert Tech Talk details: ${error.message}`);
  }

  return data as TechTalkDetails;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
  ) => {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }
  
    try {
      const { action, showName, details, updates } = req.body;
  
      if (!action) {
        return res.status(400).json({
          error: "Missing action",
        });
      }
  
      switch (action) {
        case "get": {
          if (!showName) {
            return res.status(400).json({
              error: "Missing showName",
            });
          }
  
          const data = await getTechTalkDetails(showName);
  
          if (!data) {
            return res.status(404).json({
              error: `Tech Talk show "${showName}" was not found`,
            });
          }
  
          return res.status(200).json(data);
        }
  
        case "update": {
          if (!showName) {
            return res.status(400).json({
              error: "Missing showName",
            });
          }
  
          if (!updates || typeof updates !== "object") {
            return res.status(400).json({
              error: "Missing updates",
            });
          }
  
          const data = await updateTechTalkDetails(req,showName, updates);
  
          return res.status(200).json(data);
        }
  
        case "insert": {
          if (!details || typeof details !== "object") {
            return res.status(400).json({
              error: "Missing details",
            });
          }
  
          const data = await insertTechTalkDetails(req,details);
  
          return res.status(201).json(data);
        }
  
        default:
          return res.status(400).json({
            error: `Invalid action "${action}"`,
          });
      }
    } catch (error) {
      console.error("Tech Talk API error:", error);
  
      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      });
    }
  };

export default handler;
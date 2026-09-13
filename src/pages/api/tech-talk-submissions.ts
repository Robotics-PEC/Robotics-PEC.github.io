import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { TechTalkSubmission } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const insertSubmission = async (
  details: { name: string; episodeNumber: number; link: string }
) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("techTalkSubmissions")
    .insert(details)
    .select()
    .single();

  if (error) {
    console.error("Failed to insert tech talk submission:", error);
    throw new Error(`Failed to insert submission: ${error.message}`);
  }

  return data as TechTalkSubmission;
};

export const listSubmissions = async (episodeNumber: number) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("techTalkSubmissions")
    .select("*")
    .eq("episodeNumber", episodeNumber)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch tech talk submissions:", error);
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }

  return data as TechTalkSubmission[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { action, submission, episodeNumber } = req.body;

    if (!action) {
      return res.status(400).json({
        error: "Missing action",
      });
    }

    switch (action) {
      case "insert": {
        if (!submission || !submission.name || !submission.link || submission.episodeNumber === undefined) {
          return res.status(400).json({
            error: "Missing required submission fields",
          });
        }

        const data = await insertSubmission(submission);
        return res.status(201).json(data);
      }

      case "list": {
        if (episodeNumber === undefined) {
          return res.status(400).json({
            error: "Missing episodeNumber",
          });
        }

        const data = await listSubmissions(Number(episodeNumber));
        return res.status(200).json(data);
      }

      default:
        return res.status(400).json({
          error: `Invalid action "${action}"`,
        });
    }
  } catch (error) {
    console.error("Tech Talk Submissions API error:", error);
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Internal server error",
    });
  }
};

export default handler;

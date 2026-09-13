import { getAuthHeaders } from "@/lib/utils";
import { TechTalkSubmission, TechTalkSubmissionInsert } from "@/types";

const API_URL = "/api/tech-talk-submissions";

export const createTechTalkSubmission = async (
  submission: TechTalkSubmissionInsert
): Promise<TechTalkSubmission> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "insert",
      submission,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to submit challenge entry");
  }

  return result as TechTalkSubmission;
};

export const getTechTalkSubmissions = async (
  episodeNumber: number
): Promise<TechTalkSubmission[]> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "list",
      episodeNumber,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to fetch submissions");
  }

  return result as TechTalkSubmission[];
};

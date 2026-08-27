import { getAuthHeaders } from "@/lib/utils";
import {
    TechTalkDetails,
    TechTalkDetailsInsert,
    TechTalkDetailsUpdate,
} from "@/types";
  
  const API_URL = "/api/tech-talk";
  
  export const getTechTalkDetails = async (
    showName: string,
  ): Promise<TechTalkDetails | null> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "get",
        showName,
      }),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.error ?? "Failed to fetch Tech Talk details");
    }
  
    return result as TechTalkDetails;
  };
  
  export const updateTechTalkDetails = async (
    showName: string,
    updates: TechTalkDetailsUpdate,
  ): Promise<TechTalkDetails> => {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "update",
        showName,
        updates,
      }),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.error ?? "Failed to update Tech Talk details");
    }
  
    return result as TechTalkDetails;
  };
  
  export const insertTechTalkDetails = async (
    details: TechTalkDetailsInsert,
  ): Promise<TechTalkDetails> => {
    const headers = await getAuthHeaders();

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "insert",
        details,
      }),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.error ?? "Failed to insert Tech Talk details");
    }
  
    return result as TechTalkDetails;
  };
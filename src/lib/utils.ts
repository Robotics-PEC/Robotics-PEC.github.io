import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { client } from "./supabase/supabase";

export interface TimeValue {
  hours: number;
  minutes: number;
  period: "AM" | "PM";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export const handleLogout = async () => {
  await client.auth.signOut();
  localStorage.clear();
};

export const base64ToBlob = (base64Data: string, contentType = 'image/png') => {
  const byteCharacters = atob(base64Data)
  const byteArrays = []

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512)
    const byteNumbers = new Array(slice.length)
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
};

export const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string); // base64 string with data:image/... prefix
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


export function format12Hour(time: TimeValue): string {
  const hours = time.hours === 0 ? 12 : time.hours;
  return `${hours}:${time.minutes.toString().padStart(2, "0")} ${time.period}`;
}

/**
 * Parses a string time input into a TimeValue object
 * Accepts formats like "9:30 AM", "9:30AM", "9:30 am", "9 AM", "9AM", etc.
 */
export function parseTime(input: string): TimeValue | null {
  // Normalize input by removing extra spaces and converting to uppercase
  const normalized = input.trim().toUpperCase().replace(/\s+/g, " ");

  // Try different regex patterns for flexibility
  const patterns = [
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/,  // 9:30 AM
    /^(\d{1,2}):(\d{2})(AM|PM)$/,     // 9:30AM
    /^(\d{1,2})\s*(AM|PM)$/,          // 9 AM
    /^(\d{1,2})(AM|PM)$/,             // 9AM
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      let hours = parseInt(match[1], 10);
      let minutes = match[2] ? parseInt(match[2], 10) : 0;
      const period = match[match.length - 1] as "AM" | "PM";

      // Validate hours and minutes
      if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
        return null;
      }

      // Handle 12 AM/PM conversion for internal storage
      if (hours === 12 && period === "AM") {
        hours = 0;
      } else if (period === "PM" && hours !== 12) {
        hours = hours;
      }

      return { hours, minutes, period };
    }
  }

  return null;
}

/**
 * Validates if a string is a valid time in 12-hour format
 */
export function isTimeValid(input: string): boolean {
  return parseTime(input) !== null;
}

/**
 * Converts hours in 24-hour format to 12-hour format with AM/PM
 */
export function convertTo12Hour(hour24: number): { hour: number; period: "AM" | "PM" } {
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour: hour12, period };
}

/**
 * Converts a 12-hour time with AM/PM to 24-hour format
 */
export function convertTo24Hour(hour12: number, period: "AM" | "PM"): number {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  } else {
    return hour12 === 12 ? 12 : hour12 + 12;
  }
}

/**
 * Converts a TimeValue to total minutes from midnight for comparison
 */
export function convertToTotalMinutes(time: TimeValue): number {
  let hours = time.hours;

  // Convert to 24 hour format
  if (time.period === "PM" && hours < 12) {
    hours += 12;
  } else if (time.period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + time.minutes;
}

/**
 * Checks if end time is after start time
 */
export function isEndTimeAfterStartTime(start: TimeValue, end: TimeValue): boolean {
  const startTotalMinutes = convertToTotalMinutes(start);
  const endTotalMinutes = convertToTotalMinutes(end);

  return endTotalMinutes > startTotalMinutes;
}

/**
 * Gets the next valid time after a given time by adding the specified interval
 */
export function getNextValidTime(startTime: TimeValue, interval: number = 1): TimeValue {
  // Add the interval to the start time
  let minutes = startTime.minutes + interval;
  let hours = startTime.hours;
  let period = startTime.period;

  // Handle minute overflow
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    // Handle hour overflow
    if (hours > 12) {
      hours = hours % 12;
      if (hours === 0) hours = 12;
      if (period === "AM") period = "PM";
      else period = "AM";
    }
  }

  return { hours, minutes, period };
}
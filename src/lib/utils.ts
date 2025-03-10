import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { client } from "./supabase/supabase";

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
}
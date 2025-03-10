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
}
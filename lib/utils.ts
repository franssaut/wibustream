import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEpisodeNumber(title: string): string {
  const match = title.match(/episode\s*(\d+)/i) || title.match(/ep\s*(\d+)/i);
  return match ? match[1] : "";
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);
  
  if (hrs > 0) {
    const remMins = mins % 60;
    return `${hrs.toString().padStart(2, "0")}:${remMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Helper untuk mendeteksi dan mengonversi link Google Drive menjadi link stream
 */
export function parseGoogleDriveUrl(url: string): {
  fileId: string | null;
  embedUrl: string | null;
  directUrl: string | null;
} {
  if (!url) return { fileId: null, embedUrl: null, directUrl: null };

  const idMatch =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = idMatch ? idMatch[1] : null;

  if (!fileId) return { fileId: null, embedUrl: null, directUrl: null };

  return {
    fileId,
    embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    directUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
  };
}

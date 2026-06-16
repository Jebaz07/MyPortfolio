import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeUrl(url: string | null | undefined): string {
  if (!url) return "";
  url = url.trim();
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("mailto:")) return url;
  if (url.startsWith("#")) return url;
  if (url.startsWith("/")) return url;
  return `https://${url}`;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slug from "slug";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return slug(text, { lower: true });
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slug from "slug";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Short nano id generator
 * Example: k3f, x92, 9fk
 */
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

/**
 * Word pools for meaningful fallback slugs
 */
const adjectives = [
  "brave",
  "silent",
  "rapid",
  "golden",
  "clever",
  "mystic",
  "steady",
  "money",
  "bright",
  "cosmic",
];

const nouns = [
  "monk",
  "rocket",
  "tiger",
  "river",
  "forge",
  "lotus",
  "falcon",
  "vault",
  "cloud",
  "spark",
];

/**
 * Clean and format slug base
 */
export function formatSlug(text: string, maxLength = 50): string {
  if (!text || typeof text !== "string") return "";

  const normalized = text.trim().normalize("NFKD");

  const base = slug(normalized, {
    lower: true,
    strict: true,
  });

  return base
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

/**
 * Generate meaningful fallback slug
 * Example: money-monk-k3fkz
 */
export function generateRandomSlug(): string {
  const adjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];

  const noun =
    nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective}-${noun}-${nanoid()}`;
}

/**
 * Always append unique suffix
 * Example: acme-corp-k3fkj
 */
export function appendUniqueSuffix(baseSlug: string): string {
  return `${baseSlug}-${nanoid()}`;
}

/**
 * Final smart slug builder
 *
 * RULE:
 * - If name is valid → formatted + random suffix
 * - If invalid → meaningful random slug
 */
export function buildSlug(text?: string): string {
  const formatted = formatSlug(text ?? "");

  if (!formatted) {
    return generateRandomSlug();
  }

  return appendUniqueSuffix(formatted);
}



export function buildWorkspaceWhere(
  input: { id?: string | null; slug?: string | null },
) {
  if (input.id) return { id: input.id };
  if (input.slug) return { slug: input.slug };

  throw new Error("Workspace id or slug required");
}
export const locales = ["mn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "mn";

export function isLocale(value: string | null): value is Locale {
  return value === "mn" || value === "en";
}

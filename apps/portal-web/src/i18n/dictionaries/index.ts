import { en } from "./en";
import { mn } from "./mn";

export const dictionaries = {
  mn,
  en,
};

export type TranslationKey = keyof typeof mn;

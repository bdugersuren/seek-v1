export interface CatalogAssessment {
  id: string;
  title: string;
  description: string;
  category: "knowledge" | "skill" | "attitude" | "digital" | "career" | "other";
  categoryLabel: string;
  accessType: "free" | "paid" | "timed" | "targeted" | "organisation";
  accessLabel: string;
  durationMinutes: number;
  questionCount: number;
  price: number;
  language: "mn" | "en";
  badge?:
    "new" | "popular" | "timed" | "targeted" | "certificate" | "organisation";
  imageTone: string;
  competencyTags: string[];
  organisation?: string;
  certificateAvailable: boolean;
  favorite?: boolean;
  scheduledStartsAt?: string;
  scheduledEndsAt?: string;
  waitingRoomOpensAt?: string;
  requiredEarlyJoinMinutes?: number;
  totalPoints?: number;
  passingPercent?: number;
}

export interface CatalogFilterOption {
  id: string;
  label: string;
  count?: number;
}

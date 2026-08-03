import type { ProfileCompletionStatus, ProfileMissingField } from "@seek/contracts";

export interface ProfileLike {
  displayName?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  preferredLanguage?: string | null;
  organisation?: string | null;
  birthDate?: Date | string | null;
  address?: string | null;
}

export function evaluateProfileCompletion(profile: ProfileLike): ProfileCompletionStatus {
  const missingFields: ProfileMissingField[] = [];
  const recommendedFields: string[] = [];

  // Required fields checking
  if (!profile.displayName || !profile.displayName.trim()) {
    missingFields.push("displayName");
  }
  if (!profile.phoneNumber || !profile.phoneNumber.trim()) {
    missingFields.push("phoneNumber");
  }
  if (!profile.country || !profile.country.trim()) {
    missingFields.push("country");
  }
  if (!profile.preferredLanguage || !profile.preferredLanguage.trim()) {
    missingFields.push("preferredLanguage");
  }

  // Recommended fields checking
  if (!profile.organisation || !profile.organisation.trim()) {
    recommendedFields.push("organisation");
  }
  if (!profile.birthDate) {
    recommendedFields.push("birthDate");
  }
  if (!profile.address || !profile.address.trim()) {
    recommendedFields.push("address");
  }

  const isComplete = missingFields.length === 0;
  const nextAction = isComplete ? "CONTINUE" : "COMPLETE_PROFILE";

  const blockingReasons: string[] = [];
  if (missingFields.includes("displayName")) {
    blockingReasons.push("Овог нэр бөглөгдөөгүй байна.");
  }
  if (missingFields.includes("phoneNumber")) {
    blockingReasons.push("Утасны дугаар бөглөгдөөгүй байна.");
  }
  if (missingFields.includes("country")) {
    blockingReasons.push("Улс бөглөгдөөгүй байна.");
  }
  if (missingFields.includes("preferredLanguage")) {
    blockingReasons.push("Сонгосон хэл бөглөгдөөгүй байна.");
  }

  return {
    isComplete,
    missingFields,
    recommendedFields,
    nextAction,
    blockingReasons: blockingReasons.length > 0 ? blockingReasons : undefined,
  };
}

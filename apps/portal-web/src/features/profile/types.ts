export type VerificationStatus =
  "verified" | "pending" | "not_requested" | "rejected";

export interface ProfileIdentity {
  fullName: string;
  registryNumber: string;
  email: string;
  phone: string;
  birthDate: string;
  nationalId: string;
  gender: string;
  citizenship: string;
  country: string;
  address: string;
  education: string;
  profession: string;
  workArea: string;
  preferredRole: string;
  registeredAt: string;
  lastUpdatedAt: string;
}

export interface VerificationItem {
  id: string;
  title: string;
  description: string;
  status: VerificationStatus;
}

export interface EmploymentHistoryItem {
  id: string;
  position: string;
  organisation: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "pending";
}

export interface AffiliationItem {
  id: string;
  organisation: string;
  unit: string;
  role: string;
  verifiedBy: string;
  status: "active" | "pending" | "expired";
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  expiryDate: string;
  visibility: "private" | "organisation" | "reviewer";
  status: VerificationStatus;
}

export interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActiveAt: string;
  current?: boolean;
}

export interface ProfileMockData {
  identity: ProfileIdentity;
  verificationLevel: number;
  verificationItems: VerificationItem[];
  employmentHistory: EmploymentHistoryItem[];
  affiliations: AffiliationItem[];
  documents: DocumentItem[];
  security: {
    mfaEnabled: boolean;
    passwordUpdatedAt: string;
    sessions: SecuritySession[];
  };
}

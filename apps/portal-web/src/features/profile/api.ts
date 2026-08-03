import type {
  AssessmentEnrollmentGateResponse,
  CandidateProfileResponse,
  ProfileCompletionStatus,
  UpdateCandidateProfileRequest,
  ProfileVerificationResponse,
  ProfileDocumentResponse,
} from "@seek/contracts";
import { authFetch } from "@/lib/auth-client";
import type { CatalogAssessment } from "@/features/catalog/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// 1. Get Candidate Profile (Replacing mock usage)
export async function getProfile(): Promise<CandidateProfileResponse> {
  return getCandidateProfile();
}

export async function getCandidateProfile(): Promise<CandidateProfileResponse> {
  return requestProfileJson<CandidateProfileResponse>("/v1/profile/me");
}

export async function updateCandidateProfile(
  payload: UpdateCandidateProfileRequest,
): Promise<CandidateProfileResponse> {
  return requestProfileJson<CandidateProfileResponse>("/v1/profile/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getProfileCompletion(): Promise<ProfileCompletionStatus> {
  return requestProfileJson<ProfileCompletionStatus>(
    "/v1/profile/me/completion",
  );
}

export async function checkAssessmentEnrollmentGate(
  assessment: Pick<CatalogAssessment, "id" | "price" | "accessType">,
): Promise<AssessmentEnrollmentGateResponse> {
  const params = new URLSearchParams({
    price: String(assessment.price),
    accessType: assessment.accessType,
  });

  return requestProfileJson<AssessmentEnrollmentGateResponse>(
    `/v1/profile/me/assessment-gate/${encodeURIComponent(
      assessment.id,
    )}?${params.toString()}`,
  );
}

// 2. Verification endpoints for Portal UI
export async function getVerifications(): Promise<ProfileVerificationResponse[]> {
  return requestProfileJson<ProfileVerificationResponse[]>("/v1/profile/me/verification");
}

export async function submitVerification(type: string): Promise<ProfileVerificationResponse> {
  return requestProfileJson<ProfileVerificationResponse>("/v1/profile/me/verification/submit", {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

// 3. Document metadata endpoints for Portal UI
export async function getDocuments(): Promise<ProfileDocumentResponse[]> {
  return requestProfileJson<ProfileDocumentResponse[]>("/v1/profile/me/documents");
}

export async function addDocument(payload: {
  type: string;
  name: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<ProfileDocumentResponse> {
  return requestProfileJson<ProfileDocumentResponse>("/v1/profile/me/documents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteDocument(documentId: string): Promise<void> {
  const headers = new Headers();
  await authFetch(`${API_BASE}/v1/profile/me/documents/${encodeURIComponent(documentId)}`, {
    method: "DELETE",
    headers,
  });
}

// Helper: HTTP requests wrapper
async function requestProfileJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await authFetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  
  if (res.status === 204) {
    return {} as T;
  }

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.message || "Profile request failed");
  }

  return payload as T;
}

import type {
  AssessmentEnrollmentGateResponse,
  CandidateProfileResponse,
  ProfileCompletionStatus,
  UpdateCandidateProfileRequest,
  ProfileVerificationResponse,
  ProfileDocumentResponse,
  ProfileVerificationType,
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
  assessment: Pick<CatalogAssessment, "id" | "price" | "accessType"> & {
    emailVerified?: boolean;
    enrolled?: boolean;
    assessmentOpen?: boolean;
    alreadyAttempted?: boolean;
    attemptId?: string;
  },
): Promise<AssessmentEnrollmentGateResponse> {
  const params = new URLSearchParams({
    price: String(assessment.price),
    accessType: assessment.accessType,
  });
  if (assessment.emailVerified !== undefined) params.set("emailVerified", String(assessment.emailVerified));
  if (assessment.enrolled !== undefined) params.set("enrolled", String(assessment.enrolled));
  if (assessment.assessmentOpen !== undefined) params.set("assessmentOpen", String(assessment.assessmentOpen));
  if (assessment.alreadyAttempted !== undefined) params.set("alreadyAttempted", String(assessment.alreadyAttempted));
  if (assessment.attemptId) params.set("attemptId", assessment.attemptId);

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

export async function submitVerification(
  type: ProfileVerificationType,
  registryNumber?: string,
): Promise<ProfileVerificationResponse> {
  return requestProfileJson<ProfileVerificationResponse>("/v1/profile/me/verification/submit", {
    method: "POST",
    body: JSON.stringify({ type, registryNumber }),
  });
}

export async function sendPhoneOtp(
  phoneNumber: string,
): Promise<{ success: boolean; message: string }> {
  return requestProfileJson<{ success: boolean; message: string }>(
    "/v1/profile/me/verification/phone/send-otp",
    {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    },
  );
}

export async function verifyPhoneOtp(
  code: string,
): Promise<{ success: boolean; message: string }> {
  return requestProfileJson<{ success: boolean; message: string }>(
    "/v1/profile/me/verification/phone/verify-otp",
    {
      method: "POST",
      body: JSON.stringify({ code }),
    },
  );
}

export async function getPresignedUploadUrl(
  name: string,
  type: ProfileVerificationType,
): Promise<{ uploadUrl: string; storageKey: string }> {
  return requestProfileJson<{ uploadUrl: string; storageKey: string }>(
    "/v1/file/presigned-upload",
    {
      method: "POST",
      body: JSON.stringify({ name, type }),
    },
  );
}

export async function uploadDocumentFile(
  file: File,
  type: ProfileVerificationType,
): Promise<{ storageKey: string; mimeType: string; sizeBytes: number }> {
  if (file.type !== "application/pdf") {
    throw new Error("Зөвхөн PDF файл хавсаргах боломжтой.");
  }
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
    throw new Error("Файл 1 byte-ээс их, 10 MB-аас бага байх ёстой.");
  }

  const { uploadUrl, storageKey } = await getPresignedUploadUrl(file.name, type);
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Файлыг хадгалах санд хуулахад алдаа гарлаа. Дахин оролдоно уу.");
  }

  return { storageKey, mimeType: file.type, sizeBytes: file.size };
}

// 3. Document metadata endpoints for Portal UI
export async function getDocuments(): Promise<ProfileDocumentResponse[]> {
  return requestProfileJson<ProfileDocumentResponse[]>("/v1/profile/me/documents");
}

export async function addDocument(payload: {
  type: ProfileVerificationType;
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

export async function getAdminVerifications(
  status?: string,
): Promise<ProfileVerificationResponse[]> {
  const params = status ? `?${new URLSearchParams({ status }).toString()}` : "";
  return requestProfileJson<ProfileVerificationResponse[]>(
    `/v1/profile/admin/verifications${params}`,
  );
}

export async function approveVerification(
  id: string,
): Promise<ProfileVerificationResponse> {
  return requestProfileJson<ProfileVerificationResponse>(
    `/v1/profile/admin/verifications/${encodeURIComponent(id)}/approve`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
}

export async function rejectVerification(
  id: string,
  rejectedReason: string,
): Promise<ProfileVerificationResponse> {
  return requestProfileJson<ProfileVerificationResponse>(
    `/v1/profile/admin/verifications/${encodeURIComponent(id)}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ rejectedReason }),
    },
  );
}

// Helper: HTTP requests wrapper
async function requestProfileJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
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

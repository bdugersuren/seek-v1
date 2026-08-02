import type {
  CreateAssessmentAttemptRequest,
  CreateAssessmentAttemptResponse,
} from "@seek/contracts";
import { authFetch } from "@/lib/auth-client";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "");

export async function createCatalogAttempt(
  request: CreateAssessmentAttemptRequest,
): Promise<CreateAssessmentAttemptResponse> {
  const response = await authFetch(`${apiBaseUrl}/v1/execution/attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to create assessment attempt");
  }

  return response.json();
}

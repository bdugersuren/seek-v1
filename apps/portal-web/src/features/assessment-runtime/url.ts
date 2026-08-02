const DEFAULT_ASSESSMENT_RUNTIME_BASE_URL = "http://localhost:8082";

export const assessmentRuntimeBaseUrl = (
  process.env.NEXT_PUBLIC_ASSESSMENT_WEB_URL ||
  DEFAULT_ASSESSMENT_RUNTIME_BASE_URL
).replace(/\/+$/, "");

export function createAssessmentRuntimeUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${assessmentRuntimeBaseUrl}${normalizedPath}`;
}

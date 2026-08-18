import { authFetch } from "@/lib/auth-client";
import type { CatalogAssessment } from "./types";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "");

export interface CatalogQuery {
  q?: string;
  category?: string;
  accessType?: string;
  language?: string;
  sort?: string;
}

export async function listCatalogAssessments(query: CatalogQuery = {}): Promise<CatalogAssessment[]> {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.accessType) params.set("accessType", query.accessType);
  if (query.language) params.set("language", query.language);
  if (query.sort) params.set("sort", query.sort);

  const response = await authFetch(`${apiBaseUrl}/v1/assessment/catalog?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch catalog assessments from database");
  }
  return response.json();
}

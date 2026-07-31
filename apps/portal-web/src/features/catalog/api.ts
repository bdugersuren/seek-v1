import { catalogAssessments } from "./mock-data";
import type { CatalogAssessment } from "./types";

export interface CatalogQuery {
  q?: string;
  category?: string;
  accessType?: string;
  language?: string;
  sort?: "newest" | "price_low" | "duration_short" | "popular";
}

export async function listCatalogAssessments(query: CatalogQuery = {}) {
  const searchText = query.q?.trim().toLowerCase() ?? "";

  let items: CatalogAssessment[] = catalogAssessments.filter((assessment) => {
    const matchesSearch =
      !searchText ||
      assessment.title.toLowerCase().includes(searchText) ||
      assessment.description.toLowerCase().includes(searchText) ||
      assessment.competencyTags.some((tag) =>
        tag.toLowerCase().includes(searchText),
      );
    const matchesCategory =
      !query.category ||
      query.category === "all" ||
      assessment.category === query.category;
    const matchesAccess =
      !query.accessType ||
      query.accessType === "all" ||
      assessment.accessType === query.accessType;
    const matchesLanguage =
      !query.language ||
      query.language === "all" ||
      assessment.language === query.language;

    return matchesSearch && matchesCategory && matchesAccess && matchesLanguage;
  });

  if (query.sort === "price_low") {
    items = [...items].sort((a, b) => a.price - b.price);
  }

  if (query.sort === "duration_short") {
    items = [...items].sort((a, b) => a.durationMinutes - b.durationMinutes);
  }

  return items;
}

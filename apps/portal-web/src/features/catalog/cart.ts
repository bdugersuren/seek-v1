import type { CatalogAssessment } from "./types";

export const CATALOG_CART_STORAGE_KEY = "seek.portal.catalogCart";
export const CATALOG_CART_UPDATED_EVENT = "seek.portal.catalogCartUpdated";

export function readCatalogCart() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(CATALOG_CART_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as CatalogAssessment[];
  } catch {
    window.localStorage.removeItem(CATALOG_CART_STORAGE_KEY);
    return [];
  }
}

export function saveCatalogCart(items: CatalogAssessment[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CATALOG_CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CATALOG_CART_UPDATED_EVENT));
}

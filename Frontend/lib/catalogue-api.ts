import type { CategoryProducts, EnquiryDetails, Product } from "../../Backend/contracts";
export type { CategoryProducts, EnquiryDetails, Product } from "../../Backend/contracts";

export class CatalogueError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    ...options,
    headers: { Accept: "application/json", ...options.headers },
  });
  if (!response.ok) {
    const body: { error?: string } | null = await response.json().catch(() => null);
    throw new CatalogueError(response.status, body?.error ?? "The catalogue is temporarily unavailable.");
  }
  return response.json();
}

export const getFeaturedProducts = (signal: AbortSignal) => request<Product[]>("products/featured", { signal });
export const getCategories = (signal: AbortSignal) => request<string[]>("categories", { signal });

export function getCategory(name: string, signal: AbortSignal) {
  return request<CategoryProducts>(`category?${new URLSearchParams({ name })}`, { signal });
}

export function searchProducts(q: string, signal: AbortSignal) {
  return request<Product[]>(`products?${new URLSearchParams({ q })}`, { signal });
}

export function getProduct(id: string, signal: AbortSignal) {
  return request<Product>(`products/${encodeURIComponent(id)}`, { signal });
}

export function submitEnquiry(details: EnquiryDetails) {
  return request<{ status: "accepted" }>("enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
}

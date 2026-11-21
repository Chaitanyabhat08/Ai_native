import type { Product } from "./contracts.ts";

export interface ProductRepository {
  list(): Promise<Product[]>;
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const { id, title, description, category, price, image, rating } = value as Product;
  return Number.isSafeInteger(id) && id > 0 &&
    typeof title === "string" && typeof description === "string" &&
    typeof category === "string" && Number.isFinite(price) && price >= 0 &&
    typeof image === "string" && image.startsWith("https://fakestoreapi.com/img/") &&
    !!rating && Number.isFinite(rating.rate) && rating.rate >= 0 && rating.rate <= 5 &&
    Number.isSafeInteger(rating.count) && rating.count >= 0;
}

export class FakeStoreRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    // The upstream URL is fixed. User input never controls the request destination.
    const response = await fetch("https://fakestoreapi.com/products", {
      signal: AbortSignal.timeout(5000),
      redirect: "error",
    });
    if (!response.ok) throw new Error(`Fake Store returned ${response.status}`);

    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(isProduct)) {
      throw new Error("Invalid Fake Store catalogue response");
    }

    // Project only public catalogue fields from the upstream response.
    return data.map(({ id, title, description, category, price, image, rating }) => ({
      id, title, description, category, price, image,
      rating: { rate: rating.rate, count: rating.count },
    }));
  }
}

export function rankProducts(products: Product[]): Product[] {
  // Review count and ID keep equal ratings deterministic across catalogue views.
  return products.toSorted((a, b) =>
    b.rating.rate - a.rating.rate || b.rating.count - a.rating.count || a.id - b.id,
  );
}

export function searchProducts(products: Product[], query: string): Product[] {
  const term = query.trim().toLowerCase();
  // if data broadens out we can move to ES or other search engine for better performance. 
  return products.filter(({ title, description }) =>
    title.toLowerCase().includes(term) || description.toLowerCase().includes(term),
  );
}

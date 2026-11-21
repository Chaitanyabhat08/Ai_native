"use client";

import { useCallback } from "react";
import { searchProducts } from "../lib/catalogue-api";
import CatalogueResource from "./catalogue-resource";
import ProductGrid from "./product-grid";

export default function SearchView({ term }: { term: string }) {
  const load = useCallback((signal: AbortSignal) => searchProducts(term, signal), [term]);

  return (
    <main className="catalogue">
      <h1>{term ? `Results for “${term}”` : "All products"}</h1>
      <CatalogueResource load={load}>
        {(products) => <ProductGrid products={products} empty="No products match this search." />}
      </CatalogueResource>
    </main>
  );
}

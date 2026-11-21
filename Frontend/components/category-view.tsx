"use client";

import { useCallback } from "react";
import CatalogueResource from "./catalogue-resource";
import ProductGrid from "./product-grid";
import { getCategory } from "../lib/catalogue-api";

export default function CategoryView({ name }: { name: string }) {
  const load = useCallback((signal: AbortSignal) => getCategory(name, signal), [name]);

  return (
    <main className="catalogue">
      <h1 className="category-title">{name}</h1>
      <CatalogueResource load={load}>
        {({ featured, remaining }) => (
          <>
            <section aria-labelledby="top-rated">
              <h2 id="top-rated">Top rated</h2>
              <ProductGrid products={featured} empty="No top-rated products." />
            </section>
            <section aria-labelledby="more-products">
              <h2 id="more-products">More in this category</h2>
              <ProductGrid products={remaining} empty="You’ve seen all products in this category." />
            </section>
          </>
        )}
      </CatalogueResource>
    </main>
  );
}

"use client";

import CatalogueResource from "./catalogue-resource";
import ProductGrid from "./product-grid";
import { getFeaturedProducts } from "../lib/catalogue-api";

export default function FeaturedProducts() {
  return (
    <CatalogueResource load={getFeaturedProducts}>
      {(products) => <ProductGrid products={products} empty="No featured products are available." />}
    </CatalogueResource>
  );
}

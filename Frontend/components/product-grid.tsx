import ProductCard from "./product-card";
import type { Product } from "../lib/catalogue-api";

export default function ProductGrid({ products, empty }: { products: Product[]; empty: string }) {
  if (!products.length) return <p className="empty">{empty}</p>;
  return <ul className="products">{products.map((product) => (
    <li key={product.id}><ProductCard product={product} /></li>
  ))}</ul>;
}

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../lib/catalogue-api";
import { formatPrice } from "../lib/price";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product">
      <Link className="product-link" href={`/products/${product.id}`}>
        <div className="product-image">
          <Image src={product.image} alt="" fill sizes="(max-width: 540px) 90vw, 235px" />
        </div>
        <p className="category">{product.category}</p>
        <h3>{product.title}</h3>
        <div className="product-meta">
          <strong>{formatPrice.format(product.price)}</strong>
          <span aria-label={`Rated ${product.rating.rate} out of 5, ${product.rating.count} reviews`}>
            {product.rating.rate.toFixed(1)} / 5 ({product.rating.count})
          </span>
        </div>
      </Link>
    </article>
  );
}

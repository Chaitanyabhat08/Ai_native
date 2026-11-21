"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { getProduct } from "../lib/catalogue-api";
import type { Product } from "../lib/catalogue-api";
import { formatPrice } from "../lib/price";
import CatalogueResource from "./catalogue-resource";
import EnquiryForm from "./enquiry-form";

function ProductDetails({ product }: { product: Product }) {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <>
      <article className="detail">
        <div className="detail-image">
          <Image src={product.image} alt={product.title} fill sizes="(max-width: 700px) 90vw, 420px" />
        </div>
        <div className="detail-copy">
          <p className="category">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="detail-price">{formatPrice.format(product.price)}</p>
          <p>{product.rating.rate.toFixed(1)} / 5 · {product.rating.count} reviews</p>
          <p>{product.description}</p>
          {!showEnquiry && <button className="button" onClick={() => setShowEnquiry(true)}>Enquire</button>}
        </div>
      </article>
      {showEnquiry && <EnquiryForm productId={product.id} />}
    </>
  );
}

export default function ProductView({ id }: { id: string }) {
  const load = useCallback((signal: AbortSignal) => getProduct(id, signal), [id]);

  return (
    <main className="catalogue">
      <CatalogueResource load={load}>{(product) => <ProductDetails product={product} />}</CatalogueResource>
    </main>
  );
}

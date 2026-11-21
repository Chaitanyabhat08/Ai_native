"use client";

import Link from "next/link";
import CatalogueResource from "./catalogue-resource";
import { getCategories } from "../lib/catalogue-api";

export default function CatalogueHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">Catalogue</Link>
        <form action="/search" role="search" className="search-form">
          <label className="visually-hidden" htmlFor="catalogue-search">Search products</label>
          <input id="catalogue-search" type="search" name="q" placeholder="Search products" />
          <button className="button" type="submit">Search</button>
        </form>
      </div>
      <nav aria-label="Product categories" className="category-nav">
        <CatalogueResource load={getCategories}>
          {(categories) => <ul>{categories.map((name) => (
            <li key={name}><Link href={`/category/${encodeURIComponent(name)}`}>{name}</Link></li>
          ))}</ul>}
        </CatalogueResource>
      </nav>
    </header>
  );
}

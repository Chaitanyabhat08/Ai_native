import type { Metadata } from "next";
import CatalogueHeader from "../components/catalogue-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Catalogue",
  description: "Browse the highest-rated products in the catalogue.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body><CatalogueHeader />{children}</body></html>;
}

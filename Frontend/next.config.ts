import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // A fixed same-origin route keeps the backend URL out of the client bundle.
  async rewrites() {
    const origin = process.env.CATALOGUE_API_ORIGIN ?? "http://127.0.0.1:4000";
    const routes = ["products/featured", "products/:id", "products", "categories", "category", "enquiries"];
    return routes.map((route) => ({
      source: `/api/${route}`,
      destination: `${new URL(origin).origin}/${route}`,
    }));
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "fakestoreapi.com", port: "", pathname: "/img/**", search: "" }],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    }];
  },
};

export default nextConfig;

import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";
import { FileEmailService, parseEnquiry } from "./enquiry.ts";
import type { EmailService } from "./enquiry.ts";
import { FakeStoreRepository, rankProducts, searchProducts } from "./products.ts";
import type { ProductRepository } from "./products.ts";

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

async function handleEnquiry(
  request: IncomingMessage,
  response: ServerResponse,
  repository: ProductRepository,
  email: EmailService,
) {
  const contentType = request.headers["content-type"]?.split(";")[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    return sendJson(response, 415, { error: "Expected a JSON enquiry." });
  }

  // Read only a bounded form payload before parsing it.
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > 16_384) {
      response.setHeader("Connection", "close");
      return sendJson(response, 413, { error: "Enquiry is too large." });
    }
    chunks.push(chunk);
  }

  let body: unknown;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return sendJson(response, 400, { error: "Invalid JSON enquiry." });
  }
  const details = parseEnquiry(body);
  if (!details) return sendJson(response, 400, { error: "Enter a valid name, email and message." });

  const product = (await repository.list()).find(({ id }) => id === details.productId);
  if (!product) return sendJson(response, 404, { error: "Product not found." });

  // Report success only after the configured provider accepts the email.
  await email.sendEnquiry(details, product);
  return sendJson(response, 201, { status: "accepted" });
}

export function createCatalogueServer(repository: ProductRepository, email: EmailService) {
  return createServer(async (request, response) => {
    const url = request.url ?? "";
    const separator = url.indexOf("?");
    const path = separator < 0 ? url : url.slice(0, separator);
    const params = new URLSearchParams(separator < 0 ? "" : url.slice(separator + 1));
    const productMatch = path.match(/^\/products\/([1-9]\d*)$/);
    const isEnquiry = path === "/enquiries";
    const isCatalogue = path === "/products/featured" || path === "/products" ||
      path === "/categories" || path === "/category" || !!productMatch;
    if (!isEnquiry && !isCatalogue) {
      return sendJson(response, 404, { error: "Route not found." });
    }

    const method = isEnquiry ? "POST" : "GET";
    if (request.method !== method) {
      response.setHeader("Allow", method);
      return sendJson(response, 405, { error: "Method not allowed." });
    }

    try {
      if (isEnquiry) return await handleEnquiry(request, response, repository, email);

      const products = await repository.list();
      if (path === "/products/featured") return sendJson(response, 200, rankProducts(products).slice(0, 5));
      if (path === "/products") return sendJson(response, 200, searchProducts(products, params.get("q") ?? ""));
      if (path === "/categories") {
        const categories = Array.from(new Set(products.map(({ category }) => category))).sort();
        return sendJson(response, 200, categories);
      }
      if (path === "/category") {
        const category = params.get("name");
        const ranked = rankProducts(products.filter((product) => product.category === category));
        if (!ranked.length) return sendJson(response, 404, { error: "Category not found." });
        return sendJson(response, 200, { featured: ranked.slice(0, 3), remaining: ranked.slice(3) });
      }
      const product = products.find(({ id }) => id === Number(productMatch?.[1]));
      if (!product) return sendJson(response, 404, { error: "Product not found." });
      return sendJson(response, 200, product);
    } catch (error) {
      console.error("Catalogue request failed", error);
      return sendJson(response, 502, { error: "The service is temporarily unavailable." });
    }
  });
}

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 4000);
  const inbox = process.env.SALES_INBOX_DIR ?? fileURLToPath(new URL("./.sales-inbox", import.meta.url));
  createCatalogueServer(new FakeStoreRepository(), new FileEmailService(inbox)).listen(port, "127.0.0.1", () => {
    console.log(`Catalogue API at http://127.0.0.1:${port}`);
  });
}

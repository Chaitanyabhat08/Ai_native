import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { FileEmailService } from "./enquiry.ts";
import type { EmailService } from "./enquiry.ts";
import { createCatalogueServer } from "./server.ts";


// created the testing script purely through claude.
const products = [7, 6, 5, 4, 3, 2, 1].map((id) => ({
  id,
  title: id === 1 ? "Travel Pack" : `Product ${id}`,
  description: id === 2 ? "A TRAVEL companion" : "Description",
  category: id === 7 ? "electronics" : "men's clothing",
  price: 10,
  image: "https://fakestoreapi.com/img/product.png",
  rating: { rate: id === 7 ? 5 : 4, count: id === 6 ? 20 : 10 },
}));

const valid = { productId: 1, name: " Alex ", email: "alex@example.test", message: "Is this available?" };

async function start(context: TestContext, email: EmailService = {
  async sendEnquiry() {
    assert.fail("This request must not deliver mail");
  },
}) {
  const server = createCatalogueServer({ async list() { return products; } }, email);
  server.listen(0, "127.0.0.1");
  context.after(() => server.close());
  await once(server, "listening");
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  return (path: string, options?: RequestInit) => fetch(`${origin}${path}`, options);
}

function enquiry(body: unknown): RequestInit {
  return { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

test("ranks the top five and rejects unsupported methods", async (context) => {
  const request = await start(context);
  const response = await request("/products/featured");
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).map(({ id }: { id: number }) => id), [7, 6, 1, 2, 3]);
  const rejected = await request("/products/featured", { method: "POST" });
  assert.equal(rejected.status, 405);
  assert.equal(rejected.headers.get("allow"), "GET");
});

test("lists and partitions categories without duplicate products", async (context) => {
  const request = await start(context);
  assert.deepEqual(await (await request("/categories")).json(), ["electronics", "men's clothing"]);
  const category = await (await request(`/category?${new URLSearchParams({ name: "men's clothing" })}`)).json();
  assert.deepEqual(category.featured.map((product: { id: number }) => product.id), [6, 1, 2]);
  assert.deepEqual(category.remaining.map((product: { id: number }) => product.id), [3, 4, 5]);
  assert.equal((await request("/category?name=unknown")).status, 404);
});

test("finds a trimmed case-insensitive title or description match and loads details", async (context) => {
  const request = await start(context);
  const matches = await (await request("/products?q=+TrAvEl+")).json();
  assert.deepEqual(matches.map((product: { id: number }) => product.id), [2, 1]);
  assert.deepEqual(await (await request("/products?q=no-such-product")).json(), []);
  assert.equal((await (await request("/products/1")).json()).title, "Travel Pack");
  assert.equal((await request("/products/999")).status, 404);
});

test("rejects invalid enquiries and missing products before delivery", async (context) => {
  const request = await start(context);
  assert.equal((await request("/enquiries", enquiry({ ...valid, email: "invalid" }))).status, 400);
  assert.equal((await request("/enquiries", enquiry({ ...valid, productId: 999 }))).status, 404);
  assert.equal((await request("/enquiries", { method: "POST", body: "message=x" })).status, 415);
  assert.equal((await request("/enquiries", enquiry({ ...valid, message: "x".repeat(17_000) }))).status, 413);
});

test("writes one email to the sales inbox before accepting an enquiry", async (context) => {
  const inbox = await mkdtemp(join(tmpdir(), "catalogue-inbox-"));
  context.after(() => rm(inbox, { recursive: true, force: true }));
  const request = await start(context, new FileEmailService(inbox));
  const response = await request("/enquiries", enquiry(valid));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { status: "accepted" });

  const files = await readdir(inbox);
  assert.equal(files.length, 1);
  const file = files[0]!;
  assert.match(file, /\.eml$/);
  const [headers, body] = (await readFile(join(inbox, file), "utf8")).split("\r\n\r\n", 2);
  assert.match(headers!, /To: sales@example\.test/);
  assert.match(Buffer.from(body!, "base64").toString("utf8"), /Travel Pack \(#1\)\r\nName: Alex\r\nEmail: alex@example\.test\r\n\r\nIs this available\?/);
});

test("returns a service error when email delivery fails", async (context) => {
  const request = await start(context, { async sendEnquiry() { throw new Error("Test delivery failure"); } });
  const response = await request("/enquiries", enquiry(valid));
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "The service is temporarily unavailable." });
});

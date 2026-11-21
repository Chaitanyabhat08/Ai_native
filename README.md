# Product Catalogue

Browse Fake Store products, search the catalogue, and send a product enquiry to a local sales inbox. The [assignment brief](docs/assignment.txt) records the original acceptance criteria.

## Run locally

Install Node.js 24. In two terminals, from the repository root, run:

```sh
node --env-file-if-exists=Backend/.env Backend/server.ts
cd Frontend && npm ci && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend install and Fake Store requests require internet access. The backend runs TypeScript directly with Node and has no runtime packages to install.

The defaults work without environment files. To change the backend port or inbox directory, copy [Backend/.env.example](Backend/.env.example) to `Backend/.env`. If you change the API port, copy [Frontend/.env.example](Frontend/.env.example) to `Frontend/.env.local` and update `CATALOGUE_API_ORIGIN`. Set that origin before running a production build because the rewrite is part of the build output.

## Review the five flows

| Flow | What to try |
| --- | --- |
| Home | Open the home page and check that it shows five featured products. |
| Category | Choose **Men's clothing** and check the top-rated and remaining groups. |
| Search | Search for **backpack**, then for **no-such-product** to see the empty state. |
| Product | Click a product tile and check its image, price, rating and description. |
| Enquiry | Click **Enquire**, enter test contact details and submit. The page shows **Thank you**. Open the resulting `.eml` in `Backend/.sales-inbox/` to inspect the message addressed to `sales@example.test`. |

Use test contact details. The local adapter writes email files to disk, where you can open them with a mail client. Delete the files after reviewing them.

## Architecture

React and TypeScript fit the supplied Next.js scaffold. Next.js handles routes, image rendering and the same-origin API proxy. Node.js and TypeScript keep the backend small and support a shared API contract. Catalogue data is fetched in the browser from the Node API, and all Fake Store catalogue requests originate in the backend.

```text
React views → typed API client → Next.js rewrite → Node HTTP API
                                                     ├─ ProductRepository → Fake Store API
                                                     └─ EmailService → local .eml inbox
```

See [DECISIONS.md](DECISIONS.md) for the ranking, search and delivery assumptions and the changes needed to replace each integration.

See the [proposed network architecture](docs/network-architecture.md) for AWS hosting options, API request flows, and security checks.

## Checks

```sh
node --test Backend/server.test.ts
npm --prefix Frontend run lint
npm --prefix Frontend run build
```

The backend tests use fixture products and a temporary inbox. They cover the catalogue routes, invalid submissions, confirmed email delivery and provider failure. For backend static type checking, run `cd Backend && npm ci && npx tsc --noEmit` in a separate terminal.

See [AI_USAGE.md](AI_USAGE.md) for the implementation history and time notes.

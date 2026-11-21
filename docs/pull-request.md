# Product catalogue MVP

## Summary

- Adds a Next.js catalogue with featured products, category pages, search, product details and enquiry confirmation.
- Keeps Fake Store access and email delivery behind replaceable Node interfaces.
- Uses a local `.eml` inbox so reviewers can inspect what sales receives without configuring an external provider.

## Review path

1. Follow the root README and start both servers with Node.js 24.
2. Open the home page, choose a category and search for `backpack`.
3. Open a matching tile, send a test enquiry and check for **Thank you** and the resulting email in `Backend/.sales-inbox/`.

## Verification

Backend integration tests cover ranking, category partitioning, search, product lookup, input validation, local delivery and delivery failure. Frontend lint, backend type checking and the production build passed. A local browser walkthrough checked all five flows and produced a test email in the local inbox. The README lists the commands.

See `DECISIONS.md` for the ranking, search and delivery assumptions and `AI_USAGE.md` for the AI review notes.

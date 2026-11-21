# AI usage

## Tool and instructions

OpenAI Codex generated and revised code, drafted documentation and ran checks. The session identifies the assistant as GPT-6-based Codex. The exact model variant was not exposed. [AGENTS.md](AGENTS.md) records the project boundaries and [Frontend/AGENTS.md](Frontend/AGENTS.md) records the scaffold's requirement to check its bundled Next.js docs.

## Plan and turning points

1. Read the assignment and identify the five acceptance flows and the three components expected to change.
2. Use the existing React and Next.js scaffold with client-side catalogue requests. Start with one complete slice from Fake Store through the Node API to a product tile.
3. Complete the category, search, details and enquiry flows using the existing API boundary. Use a local sales inbox that reviewers can inspect and replace through an email interface.
4. Re-read the original assignment and add focused integration tests, the walkthrough and the decisions document. Capture the reviewer-facing tradeoffs and verification evidence.

## Where AI got it wrong

The first smoke test changed `CATALOGUE_API_ORIGIN` only when starting the production server. The proxy still used port 4000 from the existing build, so the API smoke request failed. The server logs showed the baked-in destination. Codex reran the check against the configured destination and documented that a custom origin must be set before building.

The initial category route also assumed Next.js always decoded the path parameter. Clicking **Men’s clothing** in the browser showed the escaped name and a 404. Codex normalized the route parameter and repeated the click to verify both product groups.

## Time spent

[Time log](TIME_LOG.md) records the observed assisted implementation sessions. The submitter should add any independent planning, coding, testing or review time from their own records.

# Code Challenge: AI-Native Engineer — Plain-English Cheat Sheet

## What Is This Actually Testing?
They are **not** testing how fast you can type boilerplate code or how many fancy features you can cram in. They want to see:
1. **Your architectural judgment:** Can you build a small MVP that isn't throwaway spaghetti code?
2. **How you direct AI:** Can you write clear specs/rules, catch AI mistakes, and explain/defend every line of code in a 45-minute follow-up interview (where they will ask you to make a small live change)?
3. **Pragmatism:** Can you spot ambiguous requirements, make sensible assumptions, document them, and stick to a ~2–3 hour time-box?

---

## The Scenario (In Simple Terms)
A founder wants a basic product catalogue MVP right now using dummy data (the **Fake Store API**). However, they've been burned by throwaway prototypes before. 

Your job is to build the MVP so that **three things can be swapped out later without rewriting the app**:
1. **Product Data Source** (Fake Store API today $\rightarrow$ real database/CMS tomorrow)
2. **Look & Feel / UI** (basic clean UI today $\rightarrow$ custom brand design tomorrow)
3. **Email Provider** (local fake inbox/console today $\rightarrow$ AWS SES / SendGrid tomorrow)

*(Tip: Use clean interfaces/adapters on the backend for products and email, and keep UI components decoupled from data-fetching logic.)*

---

## What I Need to Build (5 Core User Flows)
1. **Home Page:** Shows **5 "top rated" featured products**. *(You decide how "top rated" is picked—e.g., highest `rating.rate` from the API—and document that assumption).*
2. **Category Page:** Clicking a category shows the **top-rated products in that category**, plus **the rest of the products** in that category.
3. **Search:** Typing in the search bar and clicking **Search** filters the catalogue to products matching that text (title/description).
4. **Product Details Page:** Clicking any product card opens its full details view.
5. **Enquiry Flow:** Clicking **Enquire** on a product opens a contact form $\rightarrow$ submitting sends an email to a sales inbox and shows a **"Thank you"** screen.

---

## Non-Negotiable Rules
* **Pick 1 Client + 1 Backend:** E.g., **React (TypeScript)** + **Node.js (TypeScript)** (recommended).
* **No direct Fake Store API calls from the frontend:** React must talk *only* to your Node backend; your Node backend talks to the Fake Store API.
* **Runs locally in under 10 minutes:** Ideally 1–2 commands (`docker compose up` or `npm install && npm run dev`).
* **Zero paid accounts needed:** Use a free local email catcher (like Mailpit/Mailhog via Docker, Ethereal, or a local file/console adapter) so the reviewer doesn't need API keys.
* **AWS-compatible:** If you add Docker/infra configs, keep them standard so they could run on AWS (ECS/App Runner/Lambda).
* **No secrets in Git:** Include a `.env.example` file.

---

## What You Must Submit (Checklist)
1. **GitHub Repo:** Public (or private with reviewer access) within **3 days**.
2. **Open Pull Request:** Do all your work on a **feature branch** and open a **PR into `main`**. **Leave it open**—they grade your PR description!
3. **Working Code + Tests:** Clean code with tests covering the critical paths (e.g., product service, search/filtering, enquiry endpoint, and key UI flow).
4. **`README.md`:** Why you picked your stack, any env config needed, and exact 1–2 commands to run it locally.
5. **`DECISIONS.md`:**
   * Assumptions you made where requirements were vague (e.g., how "top rated" works, search matching rules, email delivery in local dev).
   * Anything you simplified or cut to stay near the 2–3 hour mark, and why.
   * How your architecture makes swapping the data source, UI, and email provider easy.
   * What you would build next if you had one more day.
6. **`AI_USAGE.md`:**
   * Which AI tools & models you used.
   * Agent rule files you committed to the repo (e.g., `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`).
   * Your initial plan/spec.
   * 3–5 key prompts or turning points that shaped the project.
   * At least one concrete example where the AI got something wrong and how you caught/fixed it.
7. **Time Log:** Honest breakdown of time spent across **Planning, Building, Testing, and Reviewing** (aim for 2–3 hours, or explain honestly if you went over).

---

## Recommended Game Plan (2.5–3 Hours)
* **0:00 – 0:25 (Plan):** Create repo, set up `AGENTS.md` / `CLAUDE.md` with your architecture rules, create a feature branch, and scaffold the monorepo (`client/` + `server/` + `docker-compose.yml`).
* **0:25 – 1:45 (Build):**
  * Backend: `ProductRepository` interface (FakeStore implementation), `EmailService` interface (Local/Mailpit implementation), REST endpoints (`/products`, `/products/featured`, `/categories/:name`, `/enquiries`), and input validation (Zod).
  * Frontend: Clean typed API client, Home, Category, Search, Product Detail, and Enquiry Modal/Form.
* **1:45 – 2:15 (Test):** Write focused unit/integration tests for backend endpoints/adapters and frontend critical flows.
* **2:15 – 2:45 (Review & Docs):** Review all AI-generated code line-by-line (so you can defend it in the interview!), test a fresh clone setup from scratch, write `README.md`, `DECISIONS.md`, `AI_USAGE.md`, and open the PR into `main`.
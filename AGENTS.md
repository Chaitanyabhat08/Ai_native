# Catalogue project instructions

- Keep Fake Store access behind the backend product repository. Route browser catalogue requests through the typed client and the Node API.
- Keep ranking, search and enquiry validation on the backend. UI components render the API contract and collect input.
- Keep email delivery behind the email service interface. Await delivery acceptance before returning enquiry success.
- Use fixture products and a temporary sales inbox for automated integration tests.
- Record decisions where the assignment leaves a choice, and consult the frontend's Next.js instructions before editing routes or configuration.

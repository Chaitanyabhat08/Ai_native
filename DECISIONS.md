# Decisions and assumptions

## Catalogue behavior

- Featured ranking uses rating descending, review count descending, then product ID ascending. Home takes five products. Each category takes three, and the remaining products appear once in the second group. Smaller categories can have an empty second group.
- Search matches a trimmed, case-insensitive substring in the title or description. An empty query shows all products in source order. Category names and product IDs are taken from the source catalogue and passed through shareable URLs.
- Fake Store supplies demo amounts. The catalogue treats those amounts as INR and formats them for India. Exchange-rate conversion is outside the MVP. Product descriptions, images and ratings come from the source catalogue.
- Enquiries require a name, email and message. The backend resolves the submitted product ID and includes the product and contact details in the email. The customer sees confirmation only after the email adapter completes. The local sales inbox is a directory of standard `.eml` files. Initial setup requires no mail account.

## What can change independently

| Change | Where to make it |
| --- | --- |
| Move products to a database or CMS | Implement `ProductRepository.list()` against the new store and wire it into `createCatalogueServer`. The API contract, ranking and views stay the same. If media moves domains, update the Next.js image configuration as well. |
| Apply a visual redesign | Replace the product cards, layouts and styles. Route views and the typed API client already receive defined product and enquiry data. |
| Deliver mail via SES or SendGrid | Implement `EmailService.sendEnquiry()` and configure the sender and sales address in that adapter. The HTTP handler continues to wait for provider acceptance before returning success. |

## Time-box decisions

The MVP ranks and filters a small catalogue in memory and uses the upstream catalogue on request. It uses file delivery locally and keeps catalogue fetching client-side. The brief does not require payments, customer accounts or inventory. Infrastructure and production deployment are outside this implementation.

## With another day

Add a browser regression test for search through enquiry confirmation, including a delivery-failure case. Add a short-lived catalogue cache with explicit behavior during upstream outages. Before public deployment, add a durable enquiry outbox with idempotent delivery so retrying a request after a lost response does not send duplicate mail.

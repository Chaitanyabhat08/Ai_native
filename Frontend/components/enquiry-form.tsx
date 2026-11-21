"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { CatalogueError, submitEnquiry } from "../lib/catalogue-api";

export default function EnquiryForm({ productId }: { productId: number }) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const nameField = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (sent) confirmation.current?.focus();
    else nameField.current?.focus();
  }, [sent]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const values = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      await submitEnquiry({
        productId,
        name: String(values.get("name")),
        email: String(values.get("email")),
        message: String(values.get("message")),
      });
      setSent(true);
    } catch (failure) {
      setError(failure instanceof CatalogueError ? failure.message : "Could not send your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) return (
    <section className="enquiry" aria-labelledby="thank-you">
      <h2 ref={confirmation} tabIndex={-1} id="thank-you">Thank you</h2>
      <p>Your enquiry was sent to our sales inbox.</p>
    </section>
  );

  return (
    <section className="enquiry" aria-labelledby="enquiry-title">
      <h2 id="enquiry-title">Send a product enquiry</h2>
      <form onSubmit={onSubmit} aria-busy={submitting}>
        <label>Name<input ref={nameField} name="name" autoComplete="name" maxLength={100} required /></label>
        <label>Email<input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
        <label>Message<textarea name="message" rows={4} maxLength={2000} required /></label>
        {error && <p role="alert">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </section>
  );
}

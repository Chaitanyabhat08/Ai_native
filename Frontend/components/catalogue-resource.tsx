"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CatalogueError } from "../lib/catalogue-api";

type Result<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; message: string; retryable: boolean };

export default function CatalogueResource<T>({
  load, children,
}: {
  load: (signal: AbortSignal) => Promise<T>;
  children: (data: T) => ReactNode;
}) {
  const [result, setResult] = useState<Result<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const request = new AbortController();
    load(request.signal).then(
      (data) => { if (!request.signal.aborted) setResult({ status: "ready", data }); },
      (error: unknown) => {
        if (request.signal.aborted) return;
        setResult({
          status: "error",
          message: error instanceof CatalogueError ? error.message : "Could not load the catalogue.",
          retryable: !(error instanceof CatalogueError) || error.status >= 500,
        });
      },
    );
    // Route changes unmount their keyed resource and cancel requests for the old view.
    return () => request.abort();
  }, [load, attempt]);

  if (result.status === "ready") return children(result.data);
  if (result.status === "loading") return <p role="status">Loading…</p>;
  return (
    <div role="alert">
      <p>{result.message}</p>
      {result.retryable && (
        <button className="button secondary" onClick={() => {
          setResult({ status: "loading" });
          setAttempt((value) => value + 1);
        }}>Try again</button>
      )}
    </div>
  );
}

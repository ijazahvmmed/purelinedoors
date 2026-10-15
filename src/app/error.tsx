"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="not-found">
      <h1>A brief interruption.</h1>
      <p>
        We couldn’t load this page. Please try again. Unverified catalogue
        content is not substituted for unavailable live data.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}

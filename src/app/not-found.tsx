import { ButtonLink, Eyebrow } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="not-found">
      <Eyebrow>404 / A different doorway</Eyebrow>
      <h1>
        Let’s find the
        <br />
        <em>right way in.</em>
      </h1>
      <p>
        This page or product isn’t available. Explore the current collections or
        return to the homepage.
      </p>
      <ButtonLink href="/doors">Explore our doors</ButtonLink>
    </section>
  );
}

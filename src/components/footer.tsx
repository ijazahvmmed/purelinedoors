import Link from "next/link";
import { Wordmark } from "./header";
import { ConsentControls } from "./consent";
import type { CmsGlobal } from "@/sanity/content";
export function Footer({
  preview,
  content,
}: {
  preview: boolean;
  content?: CmsGlobal | null;
}) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Wordmark />
          <p>
            {content?.footerText || (
              <>
                Considered doors.
                <br />
                For the spaces we call our own.
              </>
            )}
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/doors">Our door collections</Link>
          <Link href="/accessories">Frames & accessories</Link>
          <Link href="/why-pureline">Why Pureline</Link>
          <Link href="/manufacturing-quality">Manufacturing & quality</Link>
        </div>
        <div>
          <h3>For your project</h3>
          <Link href="/applications">Applications</Link>
          <Link href="/trade-projects">Trade & specification</Link>
          <Link href="/resources">Resources & guidance</Link>
          <Link href="/request-quote">Request a quote</Link>
        </div>
        <div>
          <h3>Get to know us</h3>
          <Link href="/about">About Pureline</Link>
          <Link href="/contact">Contact</Link>
          {content?.footerLinks?.map((link) => (
            <Link key={link._key} href={link.href}>
              {link.label}
            </Link>
          ))}
          <p className="footer-market">
            A UK-focused
            <br />
            composite door catalogue.
          </p>
        </div>
      </div>
      {preview && (
        <p className="preview-note">
          Design preview · Catalogue references are subject to UK range
          approval. Live enquiries and official downloads open after business
          details and documents are confirmed.
        </p>
      )}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Pureline. All rights reserved.</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terms">Terms</Link>
          <ConsentControls analyticsId={process.env.NEXT_PUBLIC_GA_ID} />
        </div>
        <span>{content?.tagline || "Thoughtfully considered."}</span>
      </div>
    </footer>
  );
}

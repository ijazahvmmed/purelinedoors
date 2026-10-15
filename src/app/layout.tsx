import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { isPreview } from "@/lib/catalogue";
import { siteUrl } from "@/lib/seo";
import localFont from "next/font/local";
import { fetchCmsGlobal } from "@/sanity/content";
import { AnalyticsEvents } from "@/components/analytics-events";
import { MotionRoot } from "@/components/motion-root";
import "./globals.css";
import "./creative.css";
import "./homepage.css";
import "./entrance.css";
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-satoshi",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pureline — Considered doors. Welcoming spaces.",
    template: "%s | Pureline",
  },
  description:
    "Explore Pureline’s GRP and composite door catalogue for UK homes and projects. Discover a design and discuss your requirements.",
  robots: isPreview
    ? { index: false, follow: false }
    : { index: true, follow: true },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await fetchCmsGlobal();
  if (!isPreview && !global)
    throw new Error(
      "Approved site identity and content are required before launch.",
    );
  return (
    <html lang="en-GB" className={satoshi.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header preview={isPreview} links={global?.navigation} />
        <MotionRoot>
          <main id="main">{children}</main>
        </MotionRoot>
        <Footer preview={isPreview} content={global} />
        <AnalyticsEvents />
      </body>
    </html>
  );
}

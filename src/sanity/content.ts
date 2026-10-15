import "server-only";
import { getCmsClient } from "./client";
import {
  DOWNLOADS_QUERY,
  FAMILIES_QUERY,
  GLOBAL_QUERY,
  PAGE_QUERY,
  PRODUCTS_QUERY,
} from "./queries";
import {
  canPublishClaim,
  canPublishProduct,
  verifiedSpecifications,
  type ClaimPublication,
  type VerificationStatus,
  type AvailabilityStatus,
  type SpecificationPublication,
} from "./publication";

export interface CmsClaim extends ClaimPublication {
  _id: string;
  exactApprovedCopy: string;
}
export interface CmsSeo {
  title?: string;
  description?: string;
  noIndex?: boolean;
}
export interface CmsProduct {
  id: string;
  slug: string;
  name: string;
  family: string;
  description: string;
  image: string;
  sourceFile: string;
  sourcePage: number;
  sourceLabel: string;
  style: string;
  applications: string[];
  specifications: ({
    label: string;
    value: string;
    status: VerificationStatus;
  } & SpecificationPublication)[];
  finishes?: string[];
  status: VerificationStatus;
  verificationStatus?: string;
  ukAvailabilityStatus: AvailabilityStatus;
  isPublished: boolean;
  imageRightsApproved?: boolean;
  gallery?: { _key: string; alt: string; url: string }[];
  claims?: CmsClaim[];
  seo?: CmsSeo;
}
export interface CmsFamily {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  applications?: string[];
  sortOrder?: number;
  image?: string;
  seo?: CmsSeo;
}
export interface CmsLink {
  _key: string;
  label: string;
  href: string;
}
export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  eyebrow?: string;
  introduction?: string;
  image?: string;
  imageAlt?: string;
  seo?: CmsSeo;
  sections?: { _key: string; heading: string; body: string; link?: CmsLink }[];
  faqs?: { _key: string; question: string; answer: string }[];
  claims?: CmsClaim[];
}
export interface CmsGlobal {
  brandName: string;
  tagline?: string;
  footerText?: string;
  navigation?: CmsLink[];
  footerLinks?: CmsLink[];
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    legalName?: string;
    companyNumber?: string;
    serviceArea?: string;
  };
  seo?: CmsSeo;
  experienceStatements?: CmsClaim[];
  redirects?: { _key: string; from: string; to: string }[];
}
export interface CmsDownload {
  id: string;
  name: string;
  kind?: string;
  url: string;
  language: string;
  market: string;
  version: string;
  date: string;
  relatedProducts?: string[];
  certificate?: CmsClaim | null;
}

/** Null means no CMS configured. Configured-CMS failures deliberately propagate. */
export async function fetchCmsProducts(): Promise<CmsProduct[] | null> {
  const client = getCmsClient();
  if (!client) return null;
  const products = await client.fetch<CmsProduct[]>(
    PRODUCTS_QUERY,
    {},
    { cache: "no-store" },
  );
  return products.filter(canPublishProduct).map((product) => ({
    ...product,
    applications: product.applications ?? [],
    specifications: verifiedSpecifications(product.specifications),
    claims: (product.claims ?? []).filter(
      (claim) => claim && canPublishClaim(claim),
    ),
  }));
}

export async function fetchCmsFamilies(): Promise<CmsFamily[] | null> {
  const client = getCmsClient();
  return client
    ? client.fetch<CmsFamily[]>(FAMILIES_QUERY, {}, { cache: "no-store" })
    : null;
}

export async function fetchCmsPage(slug: string): Promise<CmsPage | null> {
  const client = getCmsClient();
  if (!client) return null;
  const page = await client.fetch<CmsPage | null>(
    PAGE_QUERY,
    { slug },
    { cache: "no-store" },
  );
  return page
    ? {
        ...page,
        claims: (page.claims ?? []).filter(
          (claim) => claim && canPublishClaim(claim),
        ),
      }
    : null;
}

export async function fetchCmsGlobal(): Promise<CmsGlobal | null> {
  const client = getCmsClient();
  if (!client) return null;
  const content = await client.fetch<CmsGlobal | null>(
    GLOBAL_QUERY,
    {},
    { cache: "no-store" },
  );
  return content
    ? {
        ...content,
        experienceStatements: (content.experienceStatements ?? []).filter(
          (claim) => claim && canPublishClaim(claim),
        ),
      }
    : null;
}

export async function fetchCmsDownloads(): Promise<CmsDownload[] | null> {
  const client = getCmsClient();
  if (!client) return null;
  const downloads = await client.fetch<CmsDownload[]>(
    DOWNLOADS_QUERY,
    {},
    { cache: "no-store" },
  );
  return downloads.filter(
    (download) =>
      download.url &&
      (download.kind !== "certificate" || download.certificate) &&
      (!download.certificate || canPublishClaim(download.certificate)),
  );
}

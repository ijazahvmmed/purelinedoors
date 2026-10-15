import { defineQuery } from "next-sanity";

export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && verificationStatus == "verified" && ukAvailabilityStatus == "approved" && isPublished == true && imageRightsApproved == true && family->isPublished == true && defined(image.asset)] | order(officialName asc) {
    "id": _id, "slug": slug.current, "name": officialName, "family": family->slug.current,
    description, "image": image.asset->url, "sourceFile": sourceCatalogue, sourcePage, sourceLabel,
    style, applications, "finishes": availableColours,
    "status": verificationStatus, verificationStatus, ukAvailabilityStatus, isPublished, imageRightsApproved,
    "specifications": specifications[status == "verified"]{_key, label, value, status, sourceFile, sourcePage, verifiedBy, approvalDate},
    "gallery": gallery[imageRightsApproved == true]{_key, alt, "url": asset->url},
    "claims": claimReferences[]->{_id, claimType, exactApprovedCopy, status, publicationPermission, expiryDate, nonExpiring, verifiedBy, approvalDate, "evidenceAsset": select(defined(evidenceAsset.asset->url) => evidenceAsset), certificateHolder, sourceFile, issueDate},
    seo
  }
`);

export const FAMILIES_QUERY = defineQuery(`
  *[_type == "productFamily" && isPublished == true] | order(sortOrder asc, name asc) {
    "id": _id, "slug": slug.current, name, shortDescription, longDescription, applications, sortOrder,
    "image": select(imageRightsApproved == true => featuredImage.asset->url), seo
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug && isPublished == true && verificationStatus == "verified"][0] {
    "id": _id, "slug": slug.current, title, eyebrow, introduction, seo,
    "image": select(imageRightsApproved == true => image.asset->url), imageAlt,
    "sections": sections[status == "verified"]{_key, heading, body, link{label, href}},
    "faqs": faqs[status == "verified"]{_key, question, answer},
    "claims": claimReferences[]->{_id, claimType, exactApprovedCopy, status, publicationPermission, expiryDate, nonExpiring, verifiedBy, approvalDate, "evidenceAsset": select(defined(evidenceAsset.asset->url) => evidenceAsset), certificateHolder, sourceFile, issueDate}
  }
`);

export const GLOBAL_QUERY = defineQuery(`
  *[_type == "globalContent" && _id == "globalContent" && isPublished == true && verificationStatus == "verified"][0] {
    brandName, tagline, footerText, navigation[]{_key, label, href}, footerLinks[]{_key, label, href},
    contact{email, phone, address, legalName, companyNumber, serviceArea}, seo,
    "experienceStatements": experienceStatements[]->{_id, claimType, exactApprovedCopy, status, publicationPermission, expiryDate, nonExpiring, verifiedBy, approvalDate, "evidenceAsset": select(defined(evidenceAsset.asset->url) => evidenceAsset), certificateHolder, sourceFile, issueDate},
    redirects[]{_key, from, to}
  }
`);

export const DOWNLOADS_QUERY = defineQuery(`
  *[_type == "download" && isPublished == true && status == "verified" && publicationPermission == true && market == "UK" && defined(approvedBy) && defined(date) && (kind != "certificate" || defined(certificate._ref))] | order(date desc) {
    "id": _id, name, kind, "url": file.asset->url, language, market, version, date,
    "relatedProducts": relatedProducts[]->slug.current,
    "certificate": certificate->{_id, claimType, exactApprovedCopy, status, publicationPermission, expiryDate, nonExpiring, verifiedBy, approvalDate, "evidenceAsset": select(defined(evidenceAsset.asset->url) => evidenceAsset), certificateHolder, sourceFile, issueDate}
  }
`);

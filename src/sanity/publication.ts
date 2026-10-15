/** Fail-closed rules shared by the Studio, server adapter and unit tests. */
export type VerificationStatus = "verified" | "needs_review" | "withheld";
export type AvailabilityStatus = "approved" | "needs_review" | "unavailable";

export interface ProductPublication {
  verificationStatus?: string;
  ukAvailabilityStatus?: string;
  isPublished?: boolean;
  imageRightsApproved?: boolean;
}

export function canPublishProduct(product: ProductPublication): boolean {
  return (
    product.verificationStatus === "verified" &&
    product.ukAvailabilityStatus === "approved" &&
    product.isPublished === true &&
    product.imageRightsApproved === true
  );
}

export interface ClaimPublication {
  status?: string;
  publicationPermission?: boolean;
  claimType?: string;
  expiryDate?: string | null;
  nonExpiring?: boolean;
  verifiedBy?: string | null;
  approvalDate?: string | null;
  evidenceAsset?: unknown;
  certificateHolder?: string | null;
  sourceFile?: string | null;
  issueDate?: string | null;
}

function dateValue(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === value
    ? timestamp
    : null;
}

function meaningfulText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasEvidenceAsset(value: unknown): boolean {
  if (!value || typeof value !== "object" || !("asset" in value)) return false;
  const asset = value.asset;
  return (
    !!asset &&
    typeof asset === "object" &&
    "_ref" in asset &&
    meaningfulText(asset._ref)
  );
}

export function canPublishClaim(
  claim: ClaimPublication,
  now = new Date(),
): boolean {
  if (
    claim.status !== "verified" ||
    claim.publicationPermission !== true ||
    !meaningfulText(claim.verifiedBy) ||
    !hasEvidenceAsset(claim.evidenceAsset)
  )
    return false;
  const approvalDate = dateValue(claim.approvalDate);
  if (
    approvalDate === null ||
    approvalDate > now.getTime() ||
    !Number.isFinite(now.getTime())
  )
    return false;
  const issueDate = claim.issueDate ? dateValue(claim.issueDate) : null;
  if (
    claim.issueDate &&
    (issueDate === null ||
      issueDate > now.getTime() ||
      issueDate > approvalDate)
  )
    return false;
  if (claim.expiryDate) {
    const expiry = dateValue(claim.expiryDate);
    if (
      expiry === null ||
      expiry + 86_400_000 <= now.getTime() ||
      (issueDate !== null && expiry < issueDate)
    )
      return false;
  }
  if (
    claim.claimType === "certificate" &&
    (!meaningfulText(claim.certificateHolder) ||
      !meaningfulText(claim.sourceFile) ||
      issueDate === null ||
      (!claim.expiryDate && claim.nonExpiring !== true))
  )
    return false;
  return true;
}

export interface SpecificationPublication {
  status?: string;
  sourceFile?: string | null;
  verifiedBy?: string | null;
  approvalDate?: string | null;
}

export function canPublishSpecification(
  specification: SpecificationPublication,
  now = new Date(),
): boolean {
  const approval = dateValue(specification.approvalDate);
  return (
    specification.status === "verified" &&
    meaningfulText(specification.sourceFile) &&
    meaningfulText(specification.verifiedBy) &&
    approval !== null &&
    approval <= now.getTime()
  );
}

export function verifiedSpecifications<T extends SpecificationPublication>(
  specifications: T[] | null | undefined,
  now = new Date(),
): T[] {
  return (specifications ?? []).filter((specification) =>
    canPublishSpecification(specification, now),
  );
}

import assert from "node:assert/strict";
import test from "node:test";
import {
  canPublishClaim,
  canPublishProduct,
  verifiedSpecifications,
} from "../src/sanity/publication";

const product = {
  verificationStatus: "verified",
  ukAvailabilityStatus: "approved",
  isPublished: true,
  imageRightsApproved: true,
};
test("every product publication gate is mandatory", () => {
  assert.equal(canPublishProduct(product), true);
  for (const key of Object.keys(product))
    assert.equal(
      canPublishProduct({ ...product, [key]: undefined }),
      false,
      key,
    );
  assert.equal(
    canPublishProduct({ ...product, ukAvailabilityStatus: "unavailable" }),
    false,
  );
  assert.equal(
    canPublishProduct({ ...product, verificationStatus: "needs_review" }),
    false,
  );
});
const now = new Date("2026-10-14T12:00:00Z");
const claim = {
  claimType: "certificate",
  status: "verified",
  publicationPermission: true,
  verifiedBy: "Reviewer",
  approvalDate: "2026-10-01",
  evidenceAsset: { asset: { _ref: "example" } },
  expiryDate: "2026-10-14",
  issueDate: "2026-09-01",
  certificateHolder: "Documented holder",
  sourceFile: "Reviewed certificate.pdf",
};
test("expired, malformed, incomplete and unapproved certificate evidence stays private", () => {
  assert.equal(canPublishClaim(claim, new Date("2026-10-14T20:00:00Z")), true);
  assert.equal(canPublishClaim(claim, new Date("2026-10-15T00:00:00Z")), false);
  assert.equal(
    canPublishClaim({ ...claim, expiryDate: "invalid" }, now),
    false,
  );
  assert.equal(
    canPublishClaim({ ...claim, expiryDate: undefined }, now),
    false,
  );
  assert.equal(
    canPublishClaim(
      { ...claim, expiryDate: undefined, nonExpiring: true },
      now,
    ),
    true,
  );
  for (const key of [
    "status",
    "publicationPermission",
    "verifiedBy",
    "approvalDate",
    "evidenceAsset",
    "certificateHolder",
    "sourceFile",
    "issueDate",
  ]) {
    assert.equal(
      canPublishClaim({ ...claim, [key]: undefined }, new Date("2026-10-14")),
      false,
      key,
    );
  }
});
test("API-written certificates cannot bypass date, holder or evidence checks", () => {
  for (const [key, value] of [
    ["approvalDate", "2026-10-15"],
    ["issueDate", "2026-10-15"],
    ["approvalDate", "2026-02-31"],
    ["issueDate", "2026-02-31"],
    ["expiryDate", "2026-02-31"],
    ["approvalDate", "2026-8-1"],
    ["issueDate", "not-a-date"],
    ["approvalDate", "2026-08-01"],
    ["certificateHolder", "   "],
    ["sourceFile", "   "],
    ["evidenceAsset", {}],
    ["evidenceAsset", { asset: { _ref: "" } }],
  ] as const)
    assert.equal(
      canPublishClaim({ ...claim, [key]: value }, now),
      false,
      `${key}: ${JSON.stringify(value)}`,
    );
});
test("a verified product does not confer approval on its specifications", () => {
  const approved = {
    label: "Approved",
    status: "verified",
    sourceFile: "Technical sheet.pdf",
    verifiedBy: "Reviewer",
    approvalDate: "2026-10-01",
  };
  assert.deepEqual(
    verifiedSpecifications(
      [
        { label: "Unreviewed", status: "needs_review" },
        approved,
        { label: "Withheld", status: "withheld" },
        { label: "API bypass", status: "verified" },
      ],
      now,
    ),
    [approved],
  );
  for (const field of ["sourceFile", "verifiedBy", "approvalDate"])
    assert.deepEqual(
      verifiedSpecifications([{ ...approved, [field]: undefined }], now),
      [],
      field,
    );
  for (const approvalDate of ["2026-10-15", "2026-02-31", "invalid"])
    assert.deepEqual(
      verifiedSpecifications([{ ...approved, approvalDate }], now),
      [],
    );
  assert.deepEqual(verifiedSpecifications(undefined), []);
});

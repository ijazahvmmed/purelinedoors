import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { TagIcon } from "@sanity/icons/Tag";
import { CogIcon } from "@sanity/icons/Cog";
import {
  canPublishClaim,
  canPublishProduct,
  canPublishSpecification,
  type ClaimPublication,
  type ProductPublication,
  type SpecificationPublication,
} from "./publication";

const statusValues = [
  { title: "Needs review", value: "needs_review" },
  { title: "Verified", value: "verified" },
  { title: "Withheld", value: "withheld" },
];
const statusField = (name = "status") =>
  defineField({
    name,
    type: "string",
    initialValue: "needs_review",
    options: { list: statusValues },
    validation: (rule) => rule.required(),
  });
const publishedField = defineField({
  name: "isPublished",
  title: "Approved for website",
  type: "boolean",
  initialValue: false,
  description:
    "Publishing the document alone does not approve it for the website.",
});
const rightsField = defineField({
  name: "imageRightsApproved",
  title: "Image rights approved",
  type: "boolean",
  initialValue: false,
});
const sourceFields = [
  defineField({
    name: "sourceFile",
    type: "string",
    title: "Evidence source file",
  }),
  defineField({
    name: "sourcePage",
    type: "number",
    validation: (rule) => rule.integer().positive(),
  }),
];
const approvalFields = [
  defineField({
    name: "verifiedBy",
    type: "string",
    description: "Named accountable reviewer; never invent approval.",
  }),
  defineField({ name: "approvalDate", type: "date" }),
];
const slugField = defineField({
  name: "slug",
  type: "slug",
  options: { source: "name", maxLength: 96 },
  validation: (rule) => rule.required(),
});
const textArray = (name: string, list?: string[]) =>
  defineField({
    name,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    options: list ? { list } : undefined,
  });
const applications = [
  "Residential",
  "Commercial",
  "Education",
  "Healthcare",
  "Hospitality",
  "Public buildings",
];
const imageField = defineField({
  name: "image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});
const claimReferences = defineField({
  name: "claimReferences",
  type: "array",
  of: [
    defineArrayMember({ type: "reference", to: [{ type: "technicalClaim" }] }),
  ],
});
const seoField = defineField({ name: "seo", type: "seo" });

const seo = defineType({
  name: "seo",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.max(70).warning(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(170).warning(),
    }),
    defineField({ name: "noIndex", type: "boolean", initialValue: false }),
  ],
});
const link = defineType({
  name: "siteLink",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .custom(
            (value) =>
              !value ||
              /^(\/(?!\/)|https:\/\/|mailto:|tel:)/.test(value) ||
              "Use a site path, HTTPS URL, mailto: or tel: link.",
          ),
    }),
  ],
});
const specification = defineType({
  name: "specification",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      type: "string",
      description: "Include units and exact model scope.",
      validation: (rule) => rule.required(),
    }),
    statusField(),
    ...sourceFields,
    ...approvalFields,
  ],
  validation: (rule) =>
    rule.custom((value) =>
      value?.status !== "verified" ||
      canPublishSpecification(value as SpecificationPublication)
        ? true
        : "Verified specifications require evidence, a named reviewer and a valid approval date that is not in the future.",
    ),
});

const productFamily = defineType({
  name: "productFamily",
  title: "Product family",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField,
    defineField({
      name: "shortDescription",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "longDescription", type: "text" }),
    defineField({
      name: "featuredImage",
      type: "image",
      options: { hotspot: true },
    }),
    rightsField,
    textArray("applications", applications),
    defineField({ name: "sortOrder", type: "number" }),
    seoField,
    publishedField,
  ],
});

const product = defineType({
  name: "product",
  type: "document",
  title: "Product",
  icon: TagIcon,
  fields: [
    defineField({
      name: "officialName",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "officialName" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "modelCode", type: "string" }),
    defineField({
      name: "externalId",
      type: "string",
      description: "Source record identity, used by import tools.",
    }),
    defineField({
      name: "family",
      type: "reference",
      to: [{ type: "productFamily" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourceCatalogue",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourcePage",
      type: "number",
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: "sourceLabel",
      type: "string",
      description: "Exact printed model label.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "sourceImageRef", type: "string" }),
    defineField({
      name: "description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    imageField,
    rightsField,
    defineField({
      name: "gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            rightsField,
          ],
        }),
      ],
    }),
    defineField({
      name: "style",
      type: "string",
      options: {
        list: ["Traditional", "Contemporary", "Glazed", "Panelled", "Flush"],
      },
    }),
    textArray("applications", applications),
    textArray("constructionMaterials"),
    textArray("availableColours", [
      "Dark Blue",
      "White",
      "Medium Oak",
      "Rosewood",
      "Light Oak",
      "Ivory",
      "Light Pink",
      "Light Blue",
      "Light Green",
      "Light Grey",
      "Black",
    ]),
    textArray("compatibleGlazing"),
    textArray("compatibleLayouts"),
    defineField({
      name: "specifications",
      type: "array",
      of: [defineArrayMember({ type: "specification" })],
    }),
    defineField({
      name: "technicalDocuments",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "download" }] }),
      ],
    }),
    claimReferences,
    defineField({
      name: "ukAvailabilityStatus",
      type: "string",
      initialValue: "needs_review",
      options: { list: ["needs_review", "approved", "unavailable"] },
      validation: (rule) => rule.required(),
    }),
    statusField("verificationStatus"),
    ...approvalFields,
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    publishedField,
    seoField,
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value?.isPublished) return true;
      if (!canPublishProduct(value as ProductPublication))
        return "Website approval requires verified product data, approved UK availability and approved image rights.";
      return value?.verifiedBy && value?.approvalDate && value?.image
        ? true
        : "Website approval requires a reviewer, approval date and product image.";
    }),
  preview: {
    select: {
      title: "officialName",
      subtitle: "verificationStatus",
      media: "image",
    },
  },
});

const technicalClaim = defineType({
  name: "technicalClaim",
  title: "Claim / certificate",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "claimType",
      type: "string",
      options: {
        list: [
          "certificate",
          "performance",
          "manufacturing",
          "experience",
          "sustainability",
          "commercial",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exactApprovedCopy",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    ...sourceFields,
    defineField({ name: "certificateHolder", type: "string" }),
    defineField({
      name: "evidenceAsset",
      type: "file",
      description:
        "Supporting approval or certificate. Store confidential correspondence outside a public dataset.",
    }),
    defineField({
      name: "relevantProducts",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
    }),
    defineField({ name: "issueDate", type: "date" }),
    defineField({ name: "expiryDate", type: "date" }),
    defineField({
      name: "nonExpiring",
      type: "boolean",
      initialValue: false,
      description: "Only select if reviewed evidence explicitly has no expiry.",
    }),
    ...approvalFields,
    defineField({
      name: "publicationPermission",
      type: "boolean",
      initialValue: false,
    }),
    statusField(),
  ],
  validation: (rule) =>
    rule.custom((value) =>
      value?.status !== "verified" || canPublishClaim(value as ClaimPublication)
        ? true
        : "A verified claim requires permission, evidence, reviewer and a valid non-future approval date. Certificates also require holder, source file, a valid non-future issue date and a current expiry or reviewed non-expiring status. Approval cannot precede issue.",
    ),
});

const download = defineType({
  name: "download",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      initialValue: "brochure",
      options: { list: ["brochure", "specification", "certificate", "care"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "en-GB",
      options: { list: ["en-GB"] },
    }),
    defineField({
      name: "market",
      type: "string",
      options: { list: ["UK", "Other"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "version",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "approvedBy", type: "string" }),
    defineField({ name: "date", type: "date", title: "Approval date" }),
    defineField({
      name: "relatedProducts",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
    }),
    defineField({
      name: "certificate",
      type: "reference",
      to: [{ type: "technicalClaim" }],
      description:
        "Link certificate downloads to their evidence record so expiry is enforced.",
    }),
    defineField({
      name: "publicationPermission",
      type: "boolean",
      initialValue: false,
    }),
    statusField(),
    publishedField,
  ],
  validation: (rule) =>
    rule.custom((value) =>
      !value?.isPublished ||
      (value.status === "verified" &&
        value.publicationPermission === true &&
        value.market === "UK" &&
        value.approvedBy &&
        value.date &&
        (value.kind !== "certificate" || value.certificate))
        ? true
        : "Website downloads require verified status, permission, UK market, approver and date. Certificate files also require a linked certificate record.",
    ),
});

const section = defineType({
  name: "pageSection",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "link", type: "siteLink" }),
    statusField(),
  ],
});
const faq = defineType({
  name: "faq",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    statusField(),
  ],
});
const page = defineType({
  name: "page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "Use home for homepage; about, manufacturing, trade, privacy and cookies for standard pages.",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "introduction", type: "text" }),
    imageField,
    rightsField,
    defineField({ name: "imageAlt", type: "string" }),
    defineField({
      name: "sections",
      type: "array",
      of: [defineArrayMember({ type: "pageSection" })],
    }),
    defineField({
      name: "faqs",
      type: "array",
      of: [defineArrayMember({ type: "faq" })],
    }),
    claimReferences,
    statusField("verificationStatus"),
    ...approvalFields,
    publishedField,
    seoField,
  ],
  validation: (rule) =>
    rule.custom((value) =>
      !value?.isPublished ||
      (value.verificationStatus === "verified" &&
        value.verifiedBy &&
        value.approvalDate)
        ? true
        : "Website pages require verified content, reviewer and approval date.",
    ),
});
const globalContent = defineType({
  name: "globalContent",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "brandName",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "footerText", type: "text" }),
    defineField({
      name: "navigation",
      type: "array",
      of: [defineArrayMember({ type: "siteLink" })],
    }),
    defineField({
      name: "footerLinks",
      type: "array",
      of: [defineArrayMember({ type: "siteLink" })],
    }),
    defineField({
      name: "contact",
      type: "object",
      fields: [
        defineField({
          name: "email",
          type: "string",
          validation: (rule) => rule.email(),
        }),
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "address", type: "text" }),
        defineField({ name: "legalName", type: "string" }),
        defineField({ name: "companyNumber", type: "string" }),
        defineField({ name: "serviceArea", type: "string" }),
      ],
    }),
    defineField({
      name: "experienceStatements",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "technicalClaim" }],
        }),
      ],
    }),
    defineField({
      name: "redirects",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "from",
              type: "string",
              validation: (rule) => rule.required().regex(/^\/(?!\/)/),
            }),
            defineField({
              name: "to",
              type: "string",
              validation: (rule) => rule.required().regex(/^\/(?!\/)/),
            }),
          ],
        }),
      ],
    }),
    statusField("verificationStatus"),
    ...approvalFields,
    publishedField,
    seoField,
  ],
  validation: (rule) =>
    rule.custom((value) =>
      !value?.isPublished ||
      (value.verificationStatus === "verified" &&
        value.verifiedBy &&
        value.approvalDate)
        ? true
        : "Website settings require verified content, reviewer and approval date.",
    ),
});

export const schemaTypes = [
  seo,
  link,
  specification,
  section,
  faq,
  productFamily,
  product,
  technicalClaim,
  download,
  page,
  globalContent,
];

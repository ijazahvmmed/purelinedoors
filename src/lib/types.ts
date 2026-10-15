export type VerificationStatus = "verified" | "needs_review" | "withheld";
export interface Product {
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
  specifications: {
    label: string;
    value: string;
    status: VerificationStatus;
  }[];
  finishes?: string[];
  status: VerificationStatus;
  ukAvailabilityStatus: string;
  isPublished: boolean;
}
export interface Family {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  category: "Residential" | "Commercial" | "Ancillary";
}

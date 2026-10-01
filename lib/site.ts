/** Site-wide settings. Replace STUDIO_NAME with your studio's name. */
export const SITE = {
  name: "Maison Lume",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Set NEXT_PUBLIC_ALLOW_INDEXING=true to let search engines index the demo. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  studioName: "[My Studio]",
  studioUrl: "#",
  email: "hello@maisonlume.example",
  phone: "+49 341 555 0192",
  address: { street: "Gottschedstraße 12", city: "04109 Leipzig", country: "Germany" },
} as const;

/** Shipping rules, in cents. */
export const SHIPPING = {
  freeThreshold: 10000,
  standard: 490,
  express: 990,
} as const;

// Sanity document types (mirror the schema definitions in /sanity/schemaTypes/)

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}

export interface Venue {
  name: string;
  city: string;
  address?: string;
}

export type ShowStatus = "upcoming" | "selling_fast" | "sold_out" | "completed";

export interface LineupItem {
  _key: string;
  artistName: string;
  role?: string;
  setTime?: string;
}

export interface Show {
  _id: string;
  _type: "show";
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: { current: string };
  date: string;
  doorsTime?: string;
  venue?: Venue;
  description?: PortableTextBlock[];
  status: ShowStatus;
  poster?: SanityImage;
  lineup?: LineupItem[];
  supabaseShowId?: string;
  featured: boolean;
  ticketUrl?: string;
}

// Minimal PortableText block type
export interface PortableTextBlock {
  _key: string;
  _type: "block";
  style?: string;
  children: Array<{ _key: string; _type: "span"; text: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
}

// Contact info document (singleton)
export interface ContactInfo {
  phone?: string;
  email?: string;
  location?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
}

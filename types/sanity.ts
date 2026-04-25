// Sanity document types (mirror the schema definitions in /sanity/schemaTypes/)

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}

export interface LineupArtist {
  _key: string;
  name: string;
  role?: string;
  bio?: string;
  image?: SanityImage;
}

export interface Show {
  _id: string;
  _type: "show";
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: { current: string };
  date: string;
  doorsOpen?: string;
  venueName: string;
  venueAddress?: string;
  city: string;
  capacity: number;
  description?: string;
  longDescription?: PortableTextBlock[];
  lineup?: LineupArtist[];
  poster?: SanityImage;
  galleryImages?: SanityImage[];
  supabaseShowId?: string;
}

// Minimal PortableText block type
export interface PortableTextBlock {
  _key: string;
  _type: "block";
  style?: string;
  children: Array<{ _key: string; _type: "span"; text: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
}

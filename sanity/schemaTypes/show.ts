import { defineField, defineType } from "sanity";

export const showType = defineType({
  name: "show",
  title: "Show",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Show Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Show Date & Time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "doorsOpen",
      title: "Doors Open",
      type: "datetime",
    }),
    defineField({
      name: "venueName",
      title: "Venue Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venueAddress",
      title: "Venue Address",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "capacity",
      title: "Venue Capacity",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "longDescription",
      title: "Full Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "lineup",
      title: "Lineup",
      type: "array",
      of: [
        {
          type: "object",
          name: "artist",
          fields: [
            defineField({ name: "name", title: "Artist Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "role", title: "Role / Set", type: "string" }),
            defineField({ name: "bio", title: "Short Bio", type: "text", rows: 2 }),
            defineField({ name: "image", title: "Artist Photo", type: "image", options: { hotspot: true } }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "poster",
      title: "Event Poster",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
        },
      ],
    }),
    defineField({
      name: "supabaseShowId",
      title: "Supabase Show ID",
      type: "string",
      description: "Links this CMS entry to the Supabase shows table for ticketing.",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      date: "date",
      venue: "venueName",
      media: "poster",
    },
    prepare({ title, date, venue, media }) {
      const formatted = date
        ? new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "No date";
      return { title, subtitle: `${formatted} — ${venue ?? "No venue"}`, media };
    },
  },
});

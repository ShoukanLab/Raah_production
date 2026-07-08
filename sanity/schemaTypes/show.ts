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
      name: "doorsTime",
      title: "Doors Open (HH:MM)",
      type: "string",
      description: "Time doors open, e.g. 19:30",
      validation: (Rule) =>
        Rule.regex(/^\d{2}:\d{2}$/, { name: "HH:MM format", invert: false }).warning("Enter time in HH:MM format"),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Venue Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "string",
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url",
      description: "Link to the third-party ticket sales page (e.g. Eventbrite, Ticketmaster)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Upcoming", value: "upcoming" },
          { title: "Selling Fast", value: "selling_fast" },
          { title: "Sold Out", value: "sold_out" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      initialValue: "upcoming",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Event Poster",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "lineup",
      title: "Lineup",
      type: "array",
      of: [
        {
          type: "object",
          name: "lineupItem",
          fields: [
            defineField({
              name: "artistName",
              title: "Artist Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              description: "e.g. Headliner, Featured Artist, DJ",
            }),
            defineField({
              name: "setTime",
              title: "Set Time (HH:MM)",
              type: "string",
              description: "When this artist performs, e.g. 21:00",
              validation: (Rule) =>
                Rule.regex(/^\d{2}:\d{2}$/, { name: "HH:MM format", invert: false }).warning("Enter time in HH:MM format"),
            }),
          ],
          preview: {
            select: { title: "artistName", subtitle: "setTime" },
          },
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
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
      description: "Pin this show to the top of the homepage carousel",
    }),
  ],
  preview: {
    select: {
      title: "name",
      date: "date",
      venue: "venue.name",
      media: "poster",
      status: "status",
    },
    prepare({ title, date, venue, media, status }) {
      const formatted = date
        ? new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "No date";
      const statusLabel = status ? ` — ${status}` : "";
      return {
        title,
        subtitle: `${formatted} — ${venue ?? "No venue"}${statusLabel}`,
        media,
      };
    },
  },
});

import { defineType, defineField } from 'sanity';

export const contactInfoType = defineType({
  name: 'contactInfo',
  title: 'Contact Info',
  type: 'document',
  fields: [
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Contact phone number',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Contact email address',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City and region, e.g. "Toronto, Ontario"',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter / X URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
  ],
});

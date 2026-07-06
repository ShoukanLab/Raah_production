import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://raahproduction.ca'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/staff', '/studio', '/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

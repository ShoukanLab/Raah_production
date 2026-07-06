import type { MetadataRoute } from 'next'
import { getAllShows } from '@/lib/sanity'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://raahproduction.ca'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shows = await getAllShows()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/shows`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const showRoutes: MetadataRoute.Sitemap = shows.map((show) => ({
    url: `${siteUrl}/shows/${show.slug.current}`,
    lastModified: show._updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...showRoutes]
}

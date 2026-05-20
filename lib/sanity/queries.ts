import { unstable_cache } from 'next/cache'
import { sanityServerClient } from './client'
import type { Show, ContactInfo } from '@/types/sanity'

const REVALIDATE_INTERVAL = 60 // 1 minute

// Fetch all shows ordered by date (ascending)
export const getAllShows = unstable_cache(
  async (): Promise<Show[]> => {
    const query = `*[_type == "show"] | order(date asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      slug,
      date,
      doorsTime,
      venue,
      genre,
      description,
      status,
      poster,
      lineup,
      supabaseShowId,
      featured,
      ticketUrl
    }`

    try {
      const shows = await sanityServerClient.fetch<Show[]>(query)
      return shows
    } catch (error) {
      console.error('Error fetching all shows:', error)
      throw error
    }
  },
  ['getAllShows'],
  { revalidate: REVALIDATE_INTERVAL, tags: ['shows'] }
)

// Fetch shows with date >= today (upcoming)
export const getUpcomingShows = unstable_cache(
  async (): Promise<Show[]> => {
    const now = new Date().toISOString()
    const query = `*[_type == "show" && date >= $now] | order(date asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      slug,
      date,
      doorsTime,
      venue,
      genre,
      description,
      status,
      poster,
      lineup,
      supabaseShowId,
      featured,
      ticketUrl
    }`

    try {
      const shows = await sanityServerClient.fetch<Show[]>(query, { now })
      return shows
    } catch (error) {
      console.error('Error fetching upcoming shows:', error)
      throw error
    }
  },
  ['getUpcomingShows'],
  { revalidate: REVALIDATE_INTERVAL, tags: ['shows', 'upcoming-shows'] }
)

// Fetch past shows (with status "completed")
export const getPastShows = unstable_cache(
  async (): Promise<Show[]> => {
    const query = `*[_type == "show" && status == "completed"] | order(date desc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      slug,
      date,
      doorsTime,
      venue,
      genre,
      description,
      status,
      poster,
      lineup,
      supabaseShowId,
      featured,
      ticketUrl
    }`

    try {
      const shows = await sanityServerClient.fetch<Show[]>(query)
      return shows
    } catch (error) {
      console.error('Error fetching past shows:', error)
      throw error
    }
  },
  ['getPastShows'],
  { revalidate: REVALIDATE_INTERVAL, tags: ['shows', 'past-shows'] }
)

// Fetch the first featured show
export const getFeaturedShow = unstable_cache(
  async (): Promise<Show | null> => {
    const query = `*[_type == "show" && featured == true] | order(date asc) [0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      slug,
      date,
      doorsTime,
      venue,
      genre,
      description,
      status,
      poster,
      lineup,
      supabaseShowId,
      featured,
      ticketUrl
    }`

    try {
      const show = await sanityServerClient.fetch<Show | null>(query)
      return show
    } catch (error) {
      console.error('Error fetching featured show:', error)
      throw error
    }
  },
  ['getFeaturedShow'],
  { revalidate: REVALIDATE_INTERVAL, tags: ['shows', 'featured-show'] }
)

// Fetch show by slug (full details with lineup)
export const getShowBySlug = (slug: string) =>
  unstable_cache(
    async (): Promise<Show | null> => {
      const query = `*[_type == "show" && slug.current == $slug][0] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        name,
        slug,
        date,
        doorsTime,
        venue,
        genre,
        description,
        status,
        poster,
        lineup,
        supabaseShowId,
        featured
      }`

      try {
        const show = await sanityServerClient.fetch<Show | null>(query, { slug })
        return show
      } catch (error) {
        console.error(`Error fetching show with slug "${slug}":`, error)
        throw error
      }
    },
    [`getShowBySlug-${slug}`],
    { revalidate: REVALIDATE_INTERVAL, tags: ['shows', `show-${slug}`] }
  )()

// Fetch contact info (singleton document)
export const getContactInfo = unstable_cache(
  async (): Promise<ContactInfo | null> => {
    const query = `*[_type == "contactInfo"][0] {
      phone,
      email,
      location,
      instagramUrl,
      twitterUrl,
      facebookUrl,
      websiteUrl
    }`

    try {
      const contactInfo = await sanityServerClient.fetch<ContactInfo | null>(query)
      return contactInfo
    } catch (error) {
      console.error('Error fetching contact info:', error)
      return null
    }
  },
  ['getContactInfo'],
  { revalidate: REVALIDATE_INTERVAL, tags: ['contact-info'] }
)

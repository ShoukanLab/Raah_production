import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion, token } from '@/sanity/env'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

export const sanityServerClient = (() => {
  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for server-side operations')
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: 'previewDrafts',
  })
})()

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return sanityServerClient.fetch<T>(query, params)
}

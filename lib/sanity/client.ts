import { createClient, type SanityClient } from '@sanity/client'
import { projectId, dataset, apiVersion, token } from '@/sanity/env'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

let _serverClient: SanityClient | undefined

export function getSanityServerClient(): SanityClient {
  if (_serverClient) return _serverClient
  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for server-side operations')
  }
  _serverClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: 'drafts',
  })
  return _serverClient
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return getSanityServerClient().fetch<T>(query, params)
}

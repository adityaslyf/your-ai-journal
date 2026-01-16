/**
 * Sanity Client Service
 * Core functions for interacting with Sanity API
 */

import { SANITY_CONFIG } from '@/lib/constants/sanity'

/**
 * Generate a fully qualified URL for the Sanity Query API
 */
export function generateSanityQueryUrl(
  query: string,
  params: Record<string, string | number | boolean> = {}
): string {
  const { projectId, dataset, apiVersion, useCdn } = SANITY_CONFIG
  const host = useCdn ? 'apicdn.sanity.io' : 'api.sanity.io'

  let url = `https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
    query
  )}`

  // Append parameters
  for (const [key, value] of Object.entries(params)) {
    const encodedValue = encodeURIComponent(JSON.stringify(value))
    url += `&$${key}=${encodedValue}`
  }

  return url
}

/**
 * Execute a GROQ query
 */
export async function executeQuery<T = any>(
  query: string,
  params: Record<string, any> = {}
): Promise<T> {
  const url = generateSanityQueryUrl(query, params)
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.result
}

/**
 * Generate mutation URL
 */
export function generateMutationUrl(): string {
  const { projectId, dataset, apiVersion } = SANITY_CONFIG
  return `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`
}

/**
 * Execute a mutation (create, update, delete)
 */
export async function executeMutation(
  mutations: any[],
  token: string
): Promise<any> {
  const url = generateMutationUrl()
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  })

  const result = await response.json()
  
  if (result.error) {
    throw new Error(result.error.description || 'Mutation failed')
  }

  return result
}

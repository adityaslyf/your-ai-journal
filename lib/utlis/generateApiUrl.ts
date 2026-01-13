export const sanityConfig = {
  projectId: '6p86bkf8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
}

/**
 * Generates a fully qualified URL for the Sanity Query API
 * @param query - The GROQ query string
 * @param params - Optional parameters to pass to the query (e.g., { type: 'post' })
 * @returns The complete API URL
 */
export function generateApiUrl(
  query: string,
  params: Record<string, string | number | boolean> = {}
) {
  const { projectId, dataset, apiVersion, useCdn } = sanityConfig
  const host = useCdn ? 'apicdn.sanity.io' : 'api.sanity.io'

  let url = `https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
    query
  )}`

  // Append parameters
  for (const [key, value] of Object.entries(params)) {
    // Sanity expects params to be JSON encoded values
    // e.g. &param="value" or &param=123
    const encodedValue = encodeURIComponent(JSON.stringify(value))
    url += `&$${key}=${encodedValue}`
  }

  return url
}


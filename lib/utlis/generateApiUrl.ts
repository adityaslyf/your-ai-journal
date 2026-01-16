/**
 * @deprecated This file is deprecated. Use the new structure:
 * - Import from '@/lib/services/sanity/client' for query utilities
 * - Import from '@/lib/api/journal' or '@/lib/api/prompts' for API calls
 * - Import from '@/lib/constants/sanity' for configuration
 * 
 * This file is kept for backward compatibility only.
 */

import { SANITY_CONFIG } from '@/lib/constants/sanity'
import { generateSanityQueryUrl } from '@/lib/services/sanity/client'

/**
 * @deprecated Use SANITY_CONFIG from '@/lib/constants/sanity' instead
 */
export const sanityConfig = SANITY_CONFIG

/**
 * @deprecated Use generateSanityQueryUrl from '@/lib/services/sanity/client' instead
 */
export function generateApiUrl(
  query: string,
  params: Record<string, string | number | boolean> = {}
): string {
  return generateSanityQueryUrl(query, params)
}

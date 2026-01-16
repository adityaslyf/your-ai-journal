/**
 * Sanity Configuration
 * Central configuration for Sanity CMS
 */

export const SANITY_CONFIG = {
  projectId: '6p86bkf8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false during development for instant updates
} as const

export const SANITY_TOKEN = process.env.EXPO_PUBLIC_SANITY_TOKEN

/**
 * Prompts API Service
 * All daily prompt-related API calls
 */

import { executeQuery, executeMutation } from '@/lib/services/sanity/client'
import { GET_DAILY_PROMPT_BY_DATE, GET_LATEST_DAILY_PROMPT } from '@/lib/services/sanity/queries'
import { SANITY_TOKEN } from '@/lib/constants/sanity'
import type { DailyPrompt } from '@/lib/types'

/**
 * Fetch the latest active daily prompt
 */
export async function fetchLatestDailyPrompt(): Promise<DailyPrompt | null> {
  try {
    const prompt = await executeQuery<DailyPrompt>(GET_LATEST_DAILY_PROMPT)
    return prompt
  } catch (error) {
    console.error('Failed to fetch daily prompt:', error)
    return null
  }
}

/**
 * Fetch daily prompt for a specific date
 */
export async function fetchDailyPromptByDate(
  date: string
): Promise<DailyPrompt | null> {
  try {
    const prompt = await executeQuery<DailyPrompt>(
      GET_DAILY_PROMPT_BY_DATE,
      { date }
    )
    return prompt
  } catch (error) {
    console.error('Failed to fetch daily prompt for date:', error)
    return null
  }
}

/**
 * Create a new daily prompt
 */
export async function createDailyPrompt(promptText: string, date: string): Promise<DailyPrompt> {
  if (!SANITY_TOKEN) {
    throw new Error('Sanity token is missing')
  }

  const mutations = [{
    create: {
      _type: 'dailyPrompt',
      promptText,
      date,
      isActive: true,
      aiGenerated: true,
    }
  }]

  const result = await executeMutation(mutations, SANITY_TOKEN)
  // @ts-ignore - Sanity mutation result structure
  return result.results[0].document as DailyPrompt
}

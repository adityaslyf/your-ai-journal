/**
 * Prompts API Service
 * All daily prompt-related API calls
 */

import { executeQuery } from '@/lib/services/sanity/client'
import { GET_DAILY_PROMPT_BY_DATE, GET_LATEST_DAILY_PROMPT } from '@/lib/services/sanity/queries'
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

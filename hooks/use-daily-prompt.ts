/**
 * useDailyPrompt Hook
 * Custom hook for managing daily prompt data
 */

import { useState, useEffect } from 'react'
import { fetchLatestDailyPrompt } from '@/lib/api/prompts'
import type { DailyPrompt } from '@/lib/types'

interface UseDailyPromptReturn {
  prompt: DailyPrompt | null
  isLoading: boolean
  error: Error | null
}

export function useDailyPrompt(): UseDailyPromptReturn {
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadPrompt() {
      try {
        setIsLoading(true)
        setError(null)
        const fetchedPrompt = await fetchLatestDailyPrompt()
        setPrompt(fetchedPrompt)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch prompt'))
        console.error('Error fetching prompt:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPrompt()
  }, [])

  return {
    prompt,
    isLoading,
    error,
  }
}

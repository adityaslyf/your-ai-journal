/**
 * useDailyPrompt Hook
 * Custom hook for managing daily prompt data
 */

import { fetchDailyPromptByDate, createDailyPrompt } from '@/lib/api/prompts'
import { generateDailyPrompt } from '@/lib/services/gemini/client'
import type { DailyPrompt } from '@/lib/types'
import { useEffect, useState } from 'react'

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
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0]
        
        // Try to fetch existing prompt for today
        let currentPrompt = await fetchDailyPromptByDate(today)
        
        // If no prompt exists for today, generate one with AI
        if (!currentPrompt) {
          console.log('No prompt found for today, generating with AI...')
          const aiPromptText = await generateDailyPrompt()
          
          if (aiPromptText) {
            // Save the generated prompt to Sanity
            // Note: In a real production app, this might be better handled by a scheduled cron job
            // to avoid race conditions if multiple users open the app at once.
            // For this personal app, client-side generation is acceptable.
            try {
              currentPrompt = await createDailyPrompt(aiPromptText, today)
            } catch (saveError) {
              console.error('Failed to save generated prompt:', saveError)
              // Even if save fails, we can still display the AI prompt temporarily
              currentPrompt = {
                _id: 'temp',
                _type: 'dailyPrompt',
                _createdAt: new Date().toISOString(),
                _updatedAt: new Date().toISOString(),
                promptText: aiPromptText,
                date: today,
                isActive: true,
                aiGenerated: true
              }
            }
          }
        }
        
        setPrompt(currentPrompt)
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

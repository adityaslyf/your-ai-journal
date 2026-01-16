/**
 * Daily Prompt Types
 * Type definitions for daily prompts
 */

export interface DailyPrompt {
  _id: string
  promptText: string
  date: string
  aiGenerated: boolean
  isActive: boolean
  category?: {
    _ref: string
    _type: 'reference'
  }
}

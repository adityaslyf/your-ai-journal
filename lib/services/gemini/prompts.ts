/**
 * Gemini AI Prompts
 * System prompts and context builders for the AI assistant
 */

import type { JournalContext } from '@/lib/types'

/**
 * Build system prompt with journal context
 */
export function buildSystemPrompt(journals: JournalContext[]): string {
  const hasJournals = journals && journals.length > 0

  if (!hasJournals) {
    return `You are a supportive AI journaling assistant. Help the user:
- Reflect on their experiences and emotions
- Identify patterns in their thoughts and feelings
- Provide thoughtful, empathetic insights
- Suggest meaningful journaling prompts
- Encourage self-discovery and personal growth

Be warm, empathetic, non-judgmental, and supportive. Ask thoughtful follow-up questions.`
  }

  const journalSummaries = journals
    .map((journal, index) => {
      const date = new Date(journal.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

      const contentText = journal.content
        ? journal.content
            .map((block) => block.children.map((child) => child.text).join(''))
            .join(' ')
            .substring(0, 200)
        : ''

      const categories = journal.aiCategories?.length
        ? ` (Categories: ${journal.aiCategories.join(', ')})`
        : ''

      return `[Entry ${index + 1} - ${date}]: "${journal.title}" - Mood: ${journal.moodRating}/10${categories}
Content preview: ${contentText}${contentText.length >= 200 ? '...' : ''}`
    })
    .join('\n\n')

  return `You are a supportive AI journaling assistant. You have access to the user's recent journal entries to provide personalized insights.

RECENT JOURNAL ENTRIES:
${journalSummaries}

Your role is to:
- Help the user reflect on their experiences and emotions
- Identify patterns across their journal entries
- Provide thoughtful, empathetic insights based on their history
- Suggest meaningful journaling prompts tailored to their journey
- Encourage self-discovery and personal growth
- Reference specific entries when relevant

Be warm, empathetic, non-judgmental, and supportive. Use the journal context to provide personalized guidance.`
}

/**
 * Format chat history for Gemini API
 */
export function formatChatHistory(messages: { text: string; role: 'user' | 'assistant' }[]) {
  return messages.map((msg) => ({
    role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: msg.text }],
  }))
}

export const DAILY_PROMPT_SYSTEM_PROMPT = `Generate a single, thoughtful, and engaging journaling prompt.
It should be:
- Open-ended and reflective
- Encouraging self-discovery, gratitude, or mindfulness
- Concise (1-2 sentences max)
- Tone: Warm, supportive, and inspiring

Do NOT include quotes or intro text. Just the prompt itself.`

export const CATEGORIZATION_SYSTEM_PROMPT = `Analyze the journal entry title and content provided.
Identify 1-3 relevant categories or tags that best describe the main themes (e.g., "Personal Growth", "Career", "Relationships", "Health", "Mindfulness", "Travel", "Creativity").
Return ONLY a JSON array of strings. Example: ["Personal Growth", "Mindfulness"]
Do not include markdown formatting or explanation.`

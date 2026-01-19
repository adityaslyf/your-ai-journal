/**
 * Gemini AI Client Service
 * Handles communication with Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_API_KEY } from '@/lib/constants/sanity'
import { buildSystemPrompt, formatChatHistory } from './prompts'
import type { JournalContext } from '@/lib/types'

/**
 * Initialize Gemini client
 */
function getGeminiClient() {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured')
  }

  return new GoogleGenerativeAI(GEMINI_API_KEY)
}

/**
 * Generate chat response with simulated streaming for React Native
 * Note: React Native doesn't support Web Streams API, so we fetch the complete
 * response and simulate streaming by chunking the text
 * @param messages - Chat history
 * @param journalContext - User's recent journal entries
 * @param onChunk - Callback for each streamed chunk
 */
export async function generateChatResponseStream(
  messages: { text: string; role: 'user' | 'assistant' }[],
  journalContext: JournalContext[],
  onChunk: (text: string) => void
): Promise<string> {
  try {
    const genAI = getGeminiClient()
    // Use gemini-2.5-flash - stable GA model (available until June 2026)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })

    // Build system prompt with journal context
    const systemPrompt = buildSystemPrompt(journalContext)

    // Format chat history for Gemini
    const history = formatChatHistory(messages.slice(0, -1)) // Exclude the last message

    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will be a supportive journaling assistant with access to your recent entries. How can I help you today?' }],
        },
        ...history,
      ],
    })

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].text

    // Get the complete response (React Native doesn't support streaming)
    const result = await chat.sendMessage(latestMessage)
    const fullResponse = result.response.text()

    // Simulate streaming by chunking the response
    // This creates a typing effect for better UX
    const words = fullResponse.split(' ')
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      onChunk((i > 0 ? ' ' : '') + word)
      
      // Small delay between chunks for typing effect
      await new Promise(resolve => setTimeout(resolve, 30))
    }

    return fullResponse
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate response from AI')
  }
}

/**
 * Generate chat response without streaming (fallback)
 */
export async function generateChatResponse(
  messages: { text: string; role: 'user' | 'assistant' }[],
  journalContext: JournalContext[]
): Promise<string> {
  try {
    const genAI = getGeminiClient()
    // Use gemini-2.5-flash - stable GA model (available until June 2026)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })

    const systemPrompt = buildSystemPrompt(journalContext)
    const history = formatChatHistory(messages.slice(0, -1))

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will be a supportive journaling assistant with access to your recent entries. How can I help you today?' }],
        },
        ...history,
      ],
    })

    const latestMessage = messages[messages.length - 1].text
    const result = await chat.sendMessage(latestMessage)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate response from AI')
  }
}

/**
 * Chat Types
 * Type definitions for AI chat functionality
 */

export interface ChatMessage {
  _id: string
  text: string
  role: 'user' | 'assistant'
  timestamp: string
  conversationId: string
}

export interface ChatConversation {
  _id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessageInput {
  text: string
  role: 'user' | 'assistant'
  conversationId: string
}

export interface JournalContext {
  title: string
  content?: {
    _type: string
    _key: string
    children: {
      _type: string
      _key: string
      text: string
      marks: string[]
    }[]
    markDefs: any[]
    style: string
  }[]
  moodRating: number
  createdAt: string
  aiCategories?: string[]
}

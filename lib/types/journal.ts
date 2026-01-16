/**
 * Journal Entry Types
 * Core type definitions for journal entries
 */

export interface JournalEntry {
  _id: string
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
  updatedAt?: string
  userId: string
  aiCategories?: string[]
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
      url?: string
    }
  }
}

export interface JournalEntryListItem {
  _id: string
  title: string
  moodRating: number
  createdAt: string
  aiCategories?: string[]
  image?: {
    asset: {
      _id: string
      url: string
    }
  }
}

export interface CreateJournalEntryPayload {
  title: string
  content: string
  moodRating: number
  userId: string
  imageUri?: string
}

/**
 * Journal API Service
 * All journal-related API calls
 */

import { executeQuery } from '@/lib/services/sanity/client'
import { GET_USER_JOURNAL_ENTRIES, GET_JOURNAL_ENTRY_BY_ID } from '@/lib/services/sanity/queries'
import type { JournalEntry, JournalEntryListItem } from '@/lib/types'

/**
 * Fetch all journal entries for a user
 */
export async function fetchUserJournalEntries(
  userId: string
): Promise<JournalEntryListItem[]> {
  try {
    const entries = await executeQuery<JournalEntryListItem[]>(
      GET_USER_JOURNAL_ENTRIES,
      { userId }
    )
    return entries || []
  } catch (error) {
    console.error('Failed to fetch journal entries:', error)
    throw error
  }
}

/**
 * Fetch a single journal entry by ID
 */
export async function fetchJournalEntryById(
  entryId: string
): Promise<JournalEntry | null> {
  try {
    const entry = await executeQuery<JournalEntry>(
      GET_JOURNAL_ENTRY_BY_ID,
      { entryId }
    )
    return entry
  } catch (error) {
    console.error('Failed to fetch journal entry:', error)
    throw error
  }
}

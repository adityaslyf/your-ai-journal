/**
 * useJournalEntries Hook
 * Custom hook for managing journal entries data
 */

import { fetchUserJournalEntries } from '@/lib/api/journal'
import type { JournalEntryListItem } from '@/lib/types'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'

interface UseJournalEntriesReturn {
  entries: JournalEntryListItem[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useJournalEntries(userId: string | undefined): UseJournalEntriesReturn {
  const [entries, setEntries] = useState<JournalEntryListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const fetchedEntries = await fetchUserJournalEntries(userId)
      setEntries(fetchedEntries)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch entries'))
      console.error('Error fetching entries:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Auto-fetch when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchEntries()
    }, [fetchEntries])
  )

  return {
    entries,
    isLoading,
    error,
    refetch: fetchEntries,
  }
}

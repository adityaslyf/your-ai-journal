import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'

import { JournalEntry, JournalFeedItem } from '@/components/JournalFeedItem'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { generateApiUrl } from '@/lib/utlis/generateApiUrl'
import { useAppUser } from '@/lib/utlis/user'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function JournalScreen() {
  const { userId } = useAppUser()
  const colorScheme = useColorScheme()
  
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const query = `*[_type == "journalEntry" && userId == $userId] | order(createdAt desc) {
        _id,
        title,
        moodRating,
        createdAt,
        aiCategories,
        image {
          asset -> {
            _id,
            url
          }
        }
      }`
      const url = generateApiUrl(query, { userId })
      
      const response = await fetch(url)
      const data = await response.json()
      
      const fetchedEntries: JournalEntry[] = data.result || []
      setEntries(fetchedEntries)
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useFocusEffect(
    useCallback(() => {
      fetchEntries()
    }, [fetchEntries])
  )

  return (
    <ThemedView className="flex-1">
      <View className="pt-14 pb-4 px-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <ThemedText type="title">Journal Entries</ThemedText>
      </View>
      
      <ScrollView className="flex-1 px-4" contentContainerClassName="pt-4 pb-24">
        <View className="flex-row items-center justify-between mb-4">
          <ThemedText className="text-gray-500 dark:text-gray-400">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </ThemedText>
          <TouchableOpacity onPress={fetchEntries}>
            <Ionicons name="refresh" size={18} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>
        
        {isLoading && entries.length === 0 ? (
          <ActivityIndicator size="large" color="#3b82f6" className="mt-8" />
        ) : entries.length > 0 ? (
          <View className="gap-3">
            {entries.map((entry) => (
              <JournalFeedItem key={entry._id} entry={entry} />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700 mt-4">
            <Ionicons name="book-outline" size={48} color="#ccc" className="mb-2" />
            <ThemedText className="text-gray-400 text-center">No entries yet.</ThemedText>
            <ThemedText className="text-gray-400 text-center text-sm">Create your first entry!</ThemedText>
          </View>
        )}
      </ScrollView>
      
      {/* Floating Action Button for adding new entry */}
      <Link href="/(app)/modal" asChild>
        <TouchableOpacity 
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-600/30"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Link>
    </ThemedView>
  )
}

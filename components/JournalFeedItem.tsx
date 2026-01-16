/**
 * JournalFeedItem Component
 * Displays a single journal entry in a feed list
 */

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import type { JournalEntryListItem } from '@/lib/types'
import { buildImageUrl } from '@/lib/utlis/sanity/image'

interface JournalFeedItemProps {
  entry: JournalEntryListItem
}

export function JournalFeedItem({ entry }: JournalFeedItemProps) {
  const router = useRouter()
  const date = new Date(entry.createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
  
  const moodEmoji = entry.moodRating >= 8 ? '😊' : entry.moodRating >= 5 ? '😐' : '😔'
  const imageUrl = entry.image?.asset?.url 
    ? buildImageUrl({ asset: { _ref: entry.image.asset._id, _type: 'reference' } }, 400, 200) 
    : null

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/journal/${entry._id}`)}
      activeOpacity={0.7}
    >
      <ThemedView className="rounded-2xl mb-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            className="w-full h-40"
            resizeMode="cover"
          />
        )}
        
        <View className="p-5">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-3">
              <ThemedText type="subtitle" className="text-lg leading-tight mb-1" numberOfLines={2}>
                {entry.title}
              </ThemedText>
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <ThemedText className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {formattedDate}
                </ThemedText>
              </View>
            </View>
            <View className="items-center bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-600">
              <ThemedText className="text-lg">{moodEmoji}</ThemedText>
            </View>
          </View>
          
          {entry.aiCategories && entry.aiCategories.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-1">
              {entry.aiCategories.slice(0, 3).map((cat, index) => (
                <View key={index} className="bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-800">
                  <ThemedText className="text-[10px] font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wide">
                    {cat}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  )
}

// Re-export the type for backward compatibility
export type { JournalEntryListItem as JournalEntry } from '@/lib/types'

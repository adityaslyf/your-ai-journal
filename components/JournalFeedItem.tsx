import { View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export interface JournalEntry {
  _id: string
  title: string
  moodRating: number
  createdAt: string
  aiCategories?: string[]
}

export function JournalFeedItem({ entry }: { entry: JournalEntry }) {
  const date = new Date(entry.createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
  
  const moodEmoji = entry.moodRating >= 8 ? '😊' : entry.moodRating >= 5 ? '😐' : '😔'

  return (
    <ThemedView className="p-4 rounded-xl mb-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <ThemedText type="subtitle" numberOfLines={1}>{entry.title}</ThemedText>
          <ThemedText className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formattedDate}
          </ThemedText>
        </View>
        <View className="items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg">
          <ThemedText>{moodEmoji}</ThemedText>
          <ThemedText className="text-xs font-bold mt-0.5">{entry.moodRating}/10</ThemedText>
        </View>
      </View>
      
      {entry.aiCategories && entry.aiCategories.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-2">
          {entry.aiCategories.map((cat, index) => (
            <View key={index} className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
              <ThemedText className="text-xs text-blue-700 dark:text-blue-300">
                #{cat}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  )
}


import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { generateApiUrl } from '@/lib/utlis/generateApiUrl'
import { buildImageUrl } from '@/lib/utlis/sanity/image'

interface JournalDetail {
  _id: string
  title: string
  content: {
    children: { text: string }[]
  }[]
  moodRating: number
  createdAt: string
  aiCategories?: string[]
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
}

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [entry, setEntry] = useState<JournalDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchEntry = useCallback(async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const query = `*[_type == "journalEntry" && _id == $id][0] {
        _id,
        title,
        content,
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
      const url = generateApiUrl(query, { id })

      const response = await fetch(url)
      const data = await response.json()

      setEntry(data.result)
    } catch (error) {
      console.error('Failed to fetch entry:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEntry()
  }, [fetchEntry])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ThemedText>Entry not found</ThemedText>
      </View>
    )
  }

  const date = new Date(entry.createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const moodEmoji = entry.moodRating >= 8 ? '😊' : entry.moodRating >= 5 ? '😐' : '😔'
  const imageUrl = entry.image ? buildImageUrl(entry.image, 800, 400) : null

  const contentText = entry.content
    .map((block) => block.children.map((child) => child.text).join(''))
    .join('\n\n')

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <ThemedText type="subtitle">Journal Entry</ThemedText>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {imageUrl && (
          <Image source={{ uri: imageUrl }} className="w-full h-64" resizeMode="cover" />
        )}

        <View className="p-6">
          <ThemedText type="title" className="mb-2">
            {entry.title}
          </ThemedText>

          <View className="flex-row items-center gap-4 mb-4">
            <ThemedText className="text-gray-500 dark:text-gray-400">{formattedDate}</ThemedText>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <ThemedText className="mr-1">{moodEmoji}</ThemedText>
              <ThemedText className="font-bold">{entry.moodRating}/10</ThemedText>
            </View>
          </View>

          {entry.aiCategories && entry.aiCategories.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-6">
              {entry.aiCategories.map((cat, index) => (
                <View
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full"
                >
                  <ThemedText className="text-blue-700 dark:text-blue-300">#{cat}</ThemedText>
                </View>
              ))}
            </View>
          )}

          <ThemedView className="border-l-4 border-blue-600 dark:border-blue-500 pl-4">
            <ThemedText className="leading-7 text-base">{contentText}</ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
    </View>
  )
}

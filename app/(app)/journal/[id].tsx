/**
 * Journal Detail Screen
 * Profile-style Header Design
 */

import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View, Share } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { format } from 'date-fns'

import { ThemedText } from '@/components/themed-text'
import { fetchJournalEntryById } from '@/lib/api/journal'
import type { JournalEntry } from '@/lib/types'
import { buildImageUrl } from '@/lib/utlis/sanity/image'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const isDark = colorScheme === 'dark'
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEntry() {
      if (!id) return
      try {
        setIsLoading(true)
        const fetchedEntry = await fetchJournalEntryById(id)
        setEntry(fetchedEntry)
      } catch (error) {
        console.error('Failed to fetch entry:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEntry()
  }, [id])

  const handleShare = async () => {
    if (!entry) return
    try {
      await Share.share({
        message: `${entry.title}\n\n${contentText}`,
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#050505]">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#050505]">
        <ThemedText className="font-mono text-red-500">ERROR: ENTRY NOT FOUND</ThemedText>
      </View>
    )
  }

  const date = new Date(entry.createdAt)
  const imageUrl = entry.image ? buildImageUrl(entry.image, 800, 600) : null

  const contentText = entry.content
    ? entry.content
        .map((block) => block.children.map((child) => child.text).join(''))
        .join('\n\n')
    : ''

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return isDark ? '#39ff14' : '#10b981'
    if (mood >= 6) return isDark ? '#ffff00' : '#f59e0b'
    if (mood >= 4) return isDark ? '#ff9900' : '#f97316'
    return isDark ? '#ff003c' : '#ef4444'
  }

  const moodColor = getMoodColor(entry.moodRating || 5)

  return (
    <View className="flex-1 bg-white dark:bg-[#050505]">
      {/* Profile-Style Purple Curved Header */}
      <View 
        style={{ 
          backgroundColor: colors.primary, 
          height: 280,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop: insets.top + 10,
          paddingHorizontal: 24,
        }}
      >
        {/* Navbar */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <View className="flex-row gap-3">
            <TouchableOpacity onPress={handleShare} className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="share-social" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="ellipsis-vertical" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date & Title in Header */}
        <View className="mt-6">
            <View className="flex-row items-center mb-2">
                <View className="bg-white/20 px-3 py-1 rounded-full">
                    <ThemedText className="text-white text-xs font-bold tracking-widest uppercase">
                        {format(date, 'MMMM d, yyyy')}
                    </ThemedText>
                </View>
            </View>
            <ThemedText className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight" numberOfLines={2}>
                {entry.title}
            </ThemedText>
        </View>
      </View>

      <ScrollView 
        className="flex-1 -mt-20" 
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Content Card */}
        <View className="mx-6 bg-white dark:bg-[#0a0a0a] rounded-[32px] p-6 shadow-xl shadow-black/10 border border-gray-100 dark:border-[#27272a]">
            
            {/* Image (if exists) */}
            {imageUrl && (
                <View className="mb-6 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-[#333]">
                    <Image 
                        source={{ uri: imageUrl }} 
                        className="w-full h-64" 
                        resizeMode="cover" 
                    />
                </View>
            )}

            {/* Mood Meter */}
            <View className="flex-row items-center mb-6">
                <View className="flex-1 h-2 bg-gray-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden mr-4">
                    <View 
                        className="h-full rounded-full" 
                        style={{ width: `${(entry.moodRating || 0) * 10}%`, backgroundColor: moodColor }} 
                    />
                </View>
                <ThemedText className="font-bold text-xs" style={{ color: moodColor }}>
                    MOOD: {entry.moodRating}/10
                </ThemedText>
            </View>

            {/* Categories */}
            {entry.aiCategories && (
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {entry.aiCategories.map((cat, i) => (
                        <View key={i} className="border border-gray-200 dark:border-[#333] px-3 py-1.5 rounded-full">
                            <ThemedText className="text-[10px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400">
                                #{cat}
                            </ThemedText>
                        </View>
                    ))}
                </View>
            )}

            {/* Content Text */}
            <ThemedText className="text-base leading-7 font-medium text-gray-800 dark:text-gray-300">
                {contentText}
            </ThemedText>

            {/* Footer Data */}
            <View className="mt-8 pt-6 border-t border-gray-100 dark:border-[#1a1a1a] flex-row justify-between">
                <View>
                    <ThemedText className="text-[10px] font-mono text-gray-400 mb-1">TIME LOG</ThemedText>
                    <ThemedText className="text-sm font-bold">{format(date, 'HH:mm:ss')}</ThemedText>
                </View>
                <View className="items-end">
                    <ThemedText className="text-[10px] font-mono text-gray-400 mb-1">DATA SIZE</ThemedText>
                    <ThemedText className="text-sm font-bold">{contentText.length} BYTES</ThemedText>
                </View>
            </View>
        </View>
      </ScrollView>
    </View>
  )
}

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'

import { ThemedText } from '@/components/themed-text'
import { useJournalEntries } from '@/hooks/use-journal-entries'
import { useAppUser } from '@/lib/utlis/user'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useState } from 'react'
import { buildImageUrl } from '@/lib/utlis/sanity/image'

export default function JournalScreen() {
  const { userId } = useAppUser()
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const isDark = colorScheme === 'dark'
  
  const { entries, isLoading } = useJournalEntries(userId)
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'low' | 'recent'>('all')

  const filters = [
    { id: 'all', label: 'ALL LOGS', icon: 'grid' },
    { id: 'high', label: 'OPTIMAL', icon: 'flash' },
    { id: 'low', label: 'CRITICAL', icon: 'warning' },
    { id: 'recent', label: 'LATEST', icon: 'time' },
  ]

  const filteredEntries = entries.filter(entry => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'high') return entry.moodRating && entry.moodRating >= 7
    if (activeFilter === 'low') return entry.moodRating && entry.moodRating < 5
    if (activeFilter === 'recent') return true
    return true
  })

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return isDark ? '#39ff14' : '#10b981' // Neon Green
    if (mood >= 6) return isDark ? '#ffff00' : '#f59e0b' // Neon Yellow
    if (mood >= 4) return isDark ? '#ff9900' : '#f97316' // Neon Orange
    return isDark ? '#ff003c' : '#ef4444' // Neon Red
  }

  return (
    <View className="flex-1 bg-white dark:bg-[#050505]">
      {/* Neon Header */}
      <View 
        style={{ paddingTop: insets.top + 20, paddingHorizontal: 24, paddingBottom: 20 }}
        className="bg-white dark:bg-[#050505] border-b border-gray-100 dark:border-[#27272a]"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <ThemedText className="text-3xl font-black italic tracking-tighter uppercase">
              Database
            </ThemedText>
            <ThemedText className="text-gray-500 text-xs font-mono mt-1 tracking-widest uppercase">
              {entries.length} ENTRIES FOUND
            </ThemedText>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/(app)/modal')}
            className="w-12 h-12 bg-black dark:bg-[#18181b] border border-gray-200 dark:border-[#333] rounded-xl items-center justify-center active:scale-90 transition-all"
          >
            <Ionicons name="add" size={24} color={isDark ? '#00f2ff' : '#fff'} />
          </TouchableOpacity>
        </View>

        {/* Cyber Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter.id}
              onPress={() => setActiveFilter(filter.id as any)}
              className={`flex-row items-center px-1 py-1 rounded-lg mr-3 border ${
                activeFilter === filter.id 
                  ? 'bg-yellow-500 dark:bg-[#00f2ff]/10 border-black dark:border-[#00f2ff]' 
                  : 'bg-transparent border-gray-200 dark:border-[#333]'
              }`}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={14} 
                color={activeFilter === filter.id ? (isDark ? '#00f2ff' : '#fff') : (isDark ? '#666' : '#999')} 
              />
              <ThemedText className={`ml-2 font-bold text-[10px] tracking-widest ${
                activeFilter === filter.id ? 'text-white dark:text-[#00f2ff]' : 'text-gray-500'
              }`}>
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#00f2ff' : '#000'} />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredEntries.map((entry) => {
            const imageUrl = entry.image?.asset?.url 
              ? buildImageUrl({ asset: { _ref: entry.image.asset._id, _type: 'reference' } }, 400, 300) 
              : null
            
            const moodColor = getMoodColor(entry.moodRating || 5)

            return (
              <TouchableOpacity 
                key={entry._id}
                onPress={() => router.push(`/(app)/journal/${entry._id}`)}
                activeOpacity={0.8}
                className="bg-white dark:bg-[#0a0a0a] rounded-2xl mb-6 border border-gray-200 dark:border-[#27272a] overflow-hidden"
                style={{
                    shadowColor: moodColor,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: 5
                }}
              >
                {/* Image Section */}
                {imageUrl ? (
                  <View className="relative">
                    <Image 
                      source={{ uri: imageUrl }} 
                      className="w-full h-40" 
                      resizeMode="cover" 
                    />
                    <LinearGradient
                      colors={['transparent', isDark ? '#0a0a0a' : '#ffffff']}
                      className="absolute bottom-0 left-0 right-0 h-20"
                    />
                    <View className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                      <ThemedText className="text-[10px] font-bold text-white tracking-widest uppercase">
                        {format(new Date(entry.createdAt), 'MMM d')}
                      </ThemedText>
                    </View>
                  </View>
                ) : (
                  <View className="h-2 w-full" style={{ backgroundColor: moodColor }} />
                )}

                {/* Content Section */}
                <View className="p-5">
                  <View className="flex-row justify-between items-start mb-2">
                    <ThemedText className="text-xl font-bold flex-1 mr-4 leading-6" numberOfLines={2}>
                      {entry.title}
                    </ThemedText>
                    <View 
                        className="w-8 h-8 rounded-full items-center justify-center border"
                        style={{ borderColor: moodColor, backgroundColor: moodColor + '10' }}
                    >
                        <ThemedText className="font-bold text-xs" style={{ color: moodColor }}>
                            {entry.moodRating}
                        </ThemedText>
                    </View>
                  </View>

                  {/* Metadata Row */}
                  <View className="flex-row items-center mt-2">
                    <View className="flex-row items-center mr-4">
                        <Ionicons name="time-outline" size={12} color={isDark ? '#666' : '#999'} />
                        <ThemedText className="text-xs text-gray-500 ml-1 font-mono">
                            {format(new Date(entry.createdAt), 'HH:mm')}
                        </ThemedText>
                    </View>
                    
                    {entry.aiCategories && entry.aiCategories.length > 0 && (
                        <View className="flex-row gap-2">
                            {entry.aiCategories.slice(0, 2).map((cat, idx) => (
                                <View key={idx} className="bg-gray-100 dark:bg-[#18181b] px-2 py-0.5 rounded-sm">
                                    <ThemedText className="text-[10px] text-gray-600 dark:text-gray-400 font-mono uppercase">
                                        #{cat}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}

          {filteredEntries.length === 0 && (
            <View className="items-center justify-center py-20 opacity-50">
                <Ionicons name="terminal-outline" size={64} color={isDark ? '#333' : '#ddd'} />
                <ThemedText className="text-lg font-bold mt-4 font-mono text-gray-500 uppercase tracking-widest">
                    Database Empty
                </ThemedText>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

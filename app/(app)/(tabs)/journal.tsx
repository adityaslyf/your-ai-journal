import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, TouchableOpacity, View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { format } from 'date-fns'

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
  const colors = Colors[colorScheme ?? 'light']
  const insets = useSafeAreaInsets()
  const router = useRouter()
  
  const { entries, isLoading } = useJournalEntries(userId)
  const [activeFilter, setActiveFilter] = useState('All entries')

  const filters = ['All entries', 'High Mood', 'Low Mood', 'Bookmarked']

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 24 }}>
         {/* Header */}
         <View className="flex-row justify-between items-center mb-6">
            <ThemedText className="text-2xl font-bold">My entries</ThemedText>
            <View className="flex-row gap-3">
                 <TouchableOpacity className="w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center">
                    <Ionicons name="search" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center">
                    <Ionicons name="notifications-outline" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8" contentContainerStyle={{ paddingRight: 24 }}>
            {filters.map((filter, index) => (
                <TouchableOpacity 
                    key={index}
                    onPress={() => setActiveFilter(filter)}
                    className={`px-5 py-2.5 rounded-full mr-3 ${activeFilter === filter ? 'bg-black dark:bg-white' : 'bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800'}`}
                >
                    <ThemedText className={`font-medium ${activeFilter === filter ? 'text-white dark:text-black' : 'text-gray-500'}`}>
                        {filter}
                    </ThemedText>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        contentContainerClassName="pb-40" // Increased padding for floating tab bar
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
             {entries.map((entry, index) => {
                 const imageUrl = entry.image?.asset?.url 
                    ? buildImageUrl({ asset: { _ref: entry.image.asset._id, _type: 'reference' } }, 400, 200) 
                    : null
                
                // Varied background colors for visual interest like in the reference
                const cardBg = index % 3 === 0 ? colors.tertiary : (index % 3 === 1 ? '#F2F2F7' : colors.secondary)
                const isDarkText = true; // Pastel backgrounds need dark text

                 return (
                    <TouchableOpacity 
                        key={entry._id}
                        onPress={() => router.push(`/(app)/journal/${entry._id}`)}
                        activeOpacity={0.9}
                        className="rounded-[32px] p-5 mb-3"
                        style={{ backgroundColor: index === 0 ? colors.tertiary : (index === 1 ? '#F2F2F7' : colors.secondary) }}
                    >
                        {/* Date Badge */}
                        <View className={`self-start px-3 py-1.5 rounded-full mb-3 ${index === 0 ? 'bg-orange-300/60' : (index === 1 ? 'bg-purple-300' : 'bg-green-400/60')}`}>
                            <ThemedText className="text-xs font-bold text-gray-900">
                                {format(new Date(entry.createdAt), 'dd/MM/yyyy')}
                            </ThemedText>
                        </View>

                        <ThemedText className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {entry.title}
                        </ThemedText>
                        
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="happy-outline" size={16} color="#666" />
                            <ThemedText className="text-gray-700 text-sm ml-1 font-medium">Mood: {entry.moodRating}/10</ThemedText>
                        </View>

                        {imageUrl && (
                            <Image source={{ uri: imageUrl }} className="w-full h-40 rounded-3xl" resizeMode="cover" />
                        )}
                        
                    </TouchableOpacity>
                 )
             })}
        </View>
      </ScrollView>
    </View>
  )
}

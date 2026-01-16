import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { CalendarView } from '@/components/CalendarView'
import { DailyPromptCard } from '@/components/DailyPrompt'
import { JournalEntry } from '@/components/JournalFeedItem'
import { StreakCard } from '@/components/StreakCard'
import { ThemedText } from '@/components/themed-text'
import { useStreak } from '@/hooks/use-streak'
import { generateApiUrl } from '@/lib/utlis/generateApiUrl'
import { useAppUser } from '@/lib/utlis/user'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const { userId, user } = useAppUser()
  const insets = useSafeAreaInsets()
  
  const [entries, setEntries] = useState<JournalEntry[]>([])
  
  const { streak, isActive: streakActive } = useStreak(entries)

  const fetchEntries = useCallback(async () => {
    if (!userId) {
      return
    }

    try {
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
    }
  }, [userId])

  useFocusEffect(
    useCallback(() => {
      fetchEntries()
    }, [fetchEntries])
  )

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(auth)/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header Section */}
        <View 
          className="bg-white dark:bg-gray-800 px-6 pb-6 rounded-b-[32px] shadow-sm z-10"
          style={{ paddingTop: insets.top + 10 }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <ThemedText className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </ThemedText>
              <ThemedText type="title" className="text-3xl">Hi, {user?.fullName?.split(' ')[0] || 'Friend'}!</ThemedText>
            </View>
            <TouchableOpacity 
              onPress={handleSignOut} 
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full"
            >
              <Ionicons name="log-out-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-6 gap-6">
          {/* Calendar at Top */}
          <View>
             <ThemedText type="subtitle" className="mb-3 ml-1">Your Consistency</ThemedText>
             <CalendarView entries={entries} />
          </View>

          {/* Stats & Prompt */}
          <StreakCard streak={streak} isActive={streakActive} />
          
          <DailyPromptCard />
        </View>
      </ScrollView>
    </View>
  )
}

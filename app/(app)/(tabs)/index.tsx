import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Link, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'

import { JournalEntry, JournalFeedItem } from '@/components/JournalFeedItem'
import { StreakCard } from '@/components/StreakCard'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useStreak } from '@/hooks/use-streak'
import { generateApiUrl } from '@/lib/utlis/generateApiUrl'
import { useAppUser } from '@/lib/utlis/user'

export default function HomeScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const { userId, user } = useAppUser()
  
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Use the streak hook - automatically calculates when entries change
  const { streak, isActive: streakActive } = useStreak(entries)

  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const query = `*[_type == "journalEntry" && userId == $userId] | order(createdAt desc)`
      const url = generateApiUrl(query, { userId })
      
      const response = await fetch(url)
      const data = await response.json()
      
      const fetchedEntries: JournalEntry[] = data.result || []
      setEntries(fetchedEntries)
      // Streak is automatically calculated by useStreak hook
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

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(auth)/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {/* Header Section */}
        <View className="h-[250px] w-full bg-[#A1CEDC] dark:bg-[#1D3D47] relative">
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            className="h-[178px] w-[290px] absolute bottom-0 left-0"
          />
        </View>

        <ThemedView className="flex-1 p-8 -mt-6 bg-white dark:bg-gray-900 rounded-t-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <ThemedText type="title">Hi, {user?.fullName?.split(' ')[0] || 'There'}! 👋</ThemedText>
              <ThemedText className="text-gray-500 dark:text-gray-400">Ready to reflect today?</ThemedText>
            </View>
            <TouchableOpacity onPress={handleSignOut} className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full">
              <Ionicons name="log-out-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <StreakCard streak={streak} isActive={streakActive} />
          
          <Link href="/(app)/modal" asChild>
            <TouchableOpacity className="bg-blue-600 dark:bg-blue-500 rounded-xl py-4 flex-row justify-center items-center mb-6 shadow-sm active:bg-blue-700">
              <Ionicons name="add-circle-outline" size={24} color="white" className="mr-2" />
              <ThemedText className="text-white font-bold text-lg ml-2">New Entry</ThemedText>
            </TouchableOpacity>
          </Link>
          
          <View className="flex-row items-center justify-between mb-4">
            <ThemedText type="subtitle">Recent Entries</ThemedText>
            <TouchableOpacity onPress={fetchEntries}>
              <Ionicons name="refresh" size={18} color="#999" />
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
            <View className="items-center justify-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700">
              <Ionicons name="book-outline" size={48} color="#ccc" className="mb-2" />
              <ThemedText className="text-gray-400 text-center">No entries yet.</ThemedText>
              <ThemedText className="text-gray-400 text-center text-sm">Start your journal today!</ThemedText>
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </View>
  )
}

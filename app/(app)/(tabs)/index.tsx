/**
 * Home Screen
 * Main dashboard showing calendar, streak, and daily prompt
 */

import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CalendarView } from '@/components/CalendarView'
import { DailyPromptCard } from '@/components/DailyPrompt'
import { StreakCard } from '@/components/StreakCard'
import { ThemedText } from '@/components/themed-text'
import { useJournalEntries } from '@/hooks/use-journal-entries'
import { useStreak } from '@/hooks/use-streak'
import { useAppUser } from '@/lib/utlis/user'

export default function HomeScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const { userId, user } = useAppUser()
  const insets = useSafeAreaInsets()
  
  // Fetch journal entries using custom hook
  const { entries } = useJournalEntries(userId)
  
  // Calculate streak
  const { streak, isActive: streakActive } = useStreak(entries)

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
              <ThemedText type="title" className="text-3xl">
                Hi, {user?.fullName?.split(' ')[0] || 'Friend'}!
              </ThemedText>
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

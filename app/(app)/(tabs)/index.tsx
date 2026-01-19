import { Ionicons } from '@expo/vector-icons'
import { View, ScrollView, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { format } from 'date-fns'
import { Link } from 'expo-router'

import { DailyPromptCard } from '@/components/DailyPrompt'
import { ThemedText } from '@/components/themed-text'
import { useJournalEntries } from '@/hooks/use-journal-entries'
import { useAppUser } from '@/lib/utlis/user'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useStreak } from '@/hooks/use-streak'

export default function HomeScreen() {
  const { user } = useAppUser()
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  const { entries } = useJournalEntries(user?.id)
  const { streak } = useStreak(entries)
  
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt)
    const today = new Date()
    return entryDate.toDateString() === today.toDateString()
  })

  const recentEntries = entries.slice(0, 5)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 24 }}>
          {/* Header */}
          <View className="mb-8">
            <ThemedText className="text-gray-400 text-sm mb-2">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </ThemedText>
            <ThemedText className="text-4xl font-bold mb-4">
              {getGreeting()}
            </ThemedText>
            <ThemedText className="text-gray-500 text-base">
              Welcome back, {user?.fullName?.split(' ')[0] || 'there'}! 👋
            </ThemedText>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded-3xl p-5">
              <Ionicons name="flame" size={28} color={colors.primary} />
              <ThemedText className="text-3xl font-bold mt-2 mb-1">{streak}</ThemedText>
              <ThemedText className="text-gray-500 text-sm">Day Streak</ThemedText>
            </View>
            <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-3xl p-5">
              <Ionicons name="document-text" size={28} color={colors.secondary} />
              <ThemedText className="text-3xl font-bold mt-2 mb-1">{entries.length}</ThemedText>
              <ThemedText className="text-gray-500 text-sm">Total Entries</ThemedText>
            </View>
          </View>

          {/* Daily Prompt */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText className="text-xl font-bold">Daily Prompt</ThemedText>
              <View className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                <ThemedText className="text-xs text-purple-600 dark:text-purple-300 font-semibold">
                  Today
                </ThemedText>
              </View>
            </View>
            <DailyPromptCard />
          </View>

          {/* Today Entries */}
          {todayEntries.length > 0 && (
            <View className="mb-8">
              <ThemedText className="text-xl font-bold mb-4">Today&apos;s Entries</ThemedText>
              {todayEntries.map((entry) => (
                <Link key={entry._id} href={`/(app)/journal/${entry._id}` as any} asChild>
                  <Pressable className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-5 mb-3 border border-gray-100 dark:border-gray-800">
                    <View className="flex-row items-center justify-between mb-2">
                      <ThemedText className="font-bold text-lg flex-1" numberOfLines={1}>
                        {entry.title}
                      </ThemedText>
                      <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                    </View>
                    <ThemedText className="text-gray-500 text-sm" numberOfLines={2}>
                      Tap to view full entry
                    </ThemedText>
                    <ThemedText className="text-xs text-gray-400 mt-2">
                      {format(new Date(entry.createdAt), 'h:mm a')}
                    </ThemedText>
                  </Pressable>
                </Link>
              ))}
            </View>
          )}

          {/* Recent Entries */}
          {recentEntries.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <ThemedText className="text-xl font-bold">Recent Entries</ThemedText>
                <Link href="/(app)/(tabs)/journal" asChild>
                  <Pressable>
                    <ThemedText className="text-purple-500 font-semibold">View All</ThemedText>
                  </Pressable>
                </Link>
              </View>
              {recentEntries.map((entry) => (
                <Link key={entry._id} href={`/(app)/journal/${entry._id}` as any} asChild>
                  <Pressable className="bg-white dark:bg-gray-900 rounded-3xl p-4 mb-3 border border-gray-100 dark:border-gray-800">
                    <ThemedText className="font-semibold text-base mb-1" numberOfLines={1}>
                      {entry.title}
                    </ThemedText>
                    <ThemedText className="text-xs text-gray-400">
                      {format(new Date(entry.createdAt), 'MMM d, yyyy • h:mm a')}
                    </ThemedText>
                  </Pressable>
                </Link>
              ))}
            </View>
          )}

          {/* Empty State */}
          {entries.length === 0 && (
            <View className="items-center justify-center py-12">
              <Ionicons name="book-outline" size={64} color={colors.icon} />
              <ThemedText className="text-xl font-bold mt-4 mb-2">
                Start Your Journey
              </ThemedText>
              <ThemedText className="text-gray-500 text-center mb-6 px-8">
                No entries yet. Tap the + button to create your first journal entry!
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

import { Ionicons } from '@expo/vector-icons'
import { View, ScrollView, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { Link } from 'expo-router'
import { useMemo } from 'react'

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

  // Get current month days for calendar
  const monthDays = useMemo(() => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    return eachDayOfInterval({ start, end })
  }, [])

  // Check if a day has entries
  const hasEntryOnDay = (day: Date) => {
    return entries.some(entry => 
      isSameDay(new Date(entry.createdAt), day)
    )
  }
  
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
          <View className="mb-6">
            <ThemedText className="text-gray-400 text-sm mb-2">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </ThemedText>
            <ThemedText className="text-4xl font-bold mb-2">
              {getGreeting()}
            </ThemedText>
            <ThemedText className="text-gray-500 text-base">
              Welcome back, {user?.fullName?.split(' ')[0] || 'there'}! 👋
            </ThemedText>
          </View>

          {/* Calendar Strip - Current Month */}
          <View className="mb-8 bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText className="text-lg font-bold">{format(new Date(), 'MMMM yyyy')}</ThemedText>
              <View className="flex-row items-center bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                <Ionicons name="flame" size={14} color={colors.primary} />
                <ThemedText className="text-sm font-bold text-purple-600 dark:text-purple-300 ml-1">
                  {streak} day streak
                </ThemedText>
              </View>
            </View>
            
            {/* Week Day Headers */}
            <View className="flex-row justify-between mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <View key={i} className="w-9 items-center">
                  <ThemedText className="text-xs text-gray-400 font-semibold">{day}</ThemedText>
                </View>
              ))}
            </View>

            {/* Calendar Days Grid */}
            <View className="flex-row flex-wrap">
              {/* Add empty spaces for days before the month starts */}
              {Array.from({ length: monthDays[0].getDay() }).map((_, i) => (
                <View key={`empty-${i}`} className="w-9 h-9 m-0.5" />
              ))}
              
              {/* Render month days */}
              {monthDays.map((day, i) => {
                const hasEntry = hasEntryOnDay(day)
                const today = isToday(day)
                
                return (
                  <View
                    key={i}
                    className={`w-9 h-9 m-0.5 items-center justify-center rounded-full ${
                      today ? 'bg-purple-500' : hasEntry ? 'bg-green-100 dark:bg-green-900/30' : ''
                    }`}
                  >
                    <ThemedText className={`text-sm ${
                      today ? 'text-white font-bold' : hasEntry ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </ThemedText>
                    {hasEntry && !today && (
                      <View className="absolute bottom-1 w-1 h-1 rounded-full bg-green-500" />
                    )}
                  </View>
                )
              })}
            </View>

            {/* Legend */}
            <View className="flex-row items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-purple-500 mr-1" />
                <ThemedText className="text-xs text-gray-500">Today</ThemedText>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-1" />
                <ThemedText className="text-xs text-gray-500">Has entry</ThemedText>
              </View>
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
                  <Pressable className="bg-purple-50 dark:bg-purple-900/20 rounded-[32px] p-5 mb-3">
                    {/* Date Badge */}
                    <View className="self-start bg-purple-200 dark:bg-purple-800 px-3 py-1 rounded-full mb-3">
                      <ThemedText className="text-xs font-semibold text-purple-900 dark:text-purple-100">
                        {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                      </ThemedText>
                    </View>

                    <ThemedText className="font-bold text-xl mb-2" numberOfLines={1}>
                      {entry.title}
                    </ThemedText>
                    
                    {entry.moodRating && (
                      <View className="flex-row items-center">
                        <Ionicons name="happy-outline" size={16} color={colors.primary} />
                        <ThemedText className="text-sm text-gray-500 ml-1">
                          Mood: {entry.moodRating}/10
                        </ThemedText>
                      </View>
                    )}
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
              {recentEntries.map((entry, idx) => (
                <Link key={entry._id} href={`/(app)/journal/${entry._id}` as any} asChild>
                  <Pressable className="bg-white dark:bg-gray-900 rounded-[28px] p-4 mb-3 border border-gray-100 dark:border-gray-800">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <ThemedText className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                        </ThemedText>
                      </View>
                      {entry.moodRating && (
                        <View className="flex-row items-center">
                          <Ionicons name="happy-outline" size={14} color={colors.icon} />
                          <ThemedText className="text-xs text-gray-500 ml-1">
                            {entry.moodRating}/10
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText className="font-semibold text-base" numberOfLines={1}>
                      {entry.title}
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

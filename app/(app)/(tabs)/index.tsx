import { Ionicons } from '@expo/vector-icons'
import { View, ScrollView, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { Link } from 'expo-router'
import { useMemo } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

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
  const isDark = colorScheme === 'dark'
  
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'GOOD MORNING'
    if (hour < 18) return 'GOOD AFTERNOON'
    return 'GOOD EVENING'
  }

  return (
    <View className="flex-1 bg-white dark:bg-[#050505]">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 24 }}>
          {/* Neon Header */}
          <View className="mb-8">
            <ThemedText className="text-cyan-500 dark:text-[#00f2ff] text-xs font-bold tracking-[2px] mb-2 uppercase">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </ThemedText>
            <ThemedText className="text-4xl font-black mb-2 italic tracking-tighter text-black dark:text-white">
              {getGreeting()}
            </ThemedText>
            <ThemedText className="text-gray-500 text-base font-medium">
              Ready to hack your mind, <ThemedText className="text-purple-600 dark:text-[#ff00ff] font-bold">{user?.fullName?.split(' ')[0] || 'User'}</ThemedText>?
            </ThemedText>
          </View>

          {/* Cyber Calendar */}
          <View className="mb-8 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl p-5 border-2 border-gray-100 dark:border-[#27272a] shadow-sm dark:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <View className="flex-row items-center justify-between mb-6">
              <ThemedText className="text-lg font-bold uppercase tracking-widest">{format(new Date(), 'MMMM yyyy')}</ThemedText>
              <View className="flex-row items-center bg-white dark:bg-[#18181b] px-3 py-1 rounded-md border border-gray-200 dark:border-[#333]">
                <Ionicons name="flame" size={14} color={isDark ? '#ff00ff' : '#7c3aed'} />
                <ThemedText className="text-xs font-bold text-white dark:text-[#ff00ff] ml-2 tracking-widest">
                  {streak} DAY STREAK
                </ThemedText>
              </View>
            </View>
            
            {/* Week Day Headers */}
            <View className="flex-row justify-between mb-3">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <View key={i} className="w-9 items-center">
                  <ThemedText className="text-[10px] text-gray-400 font-bold">{day}</ThemedText>
                </View>
              ))}
            </View>

            {/* Calendar Days Grid */}
            <View className="flex-row flex-wrap">
              {Array.from({ length: monthDays[0].getDay() }).map((_, i) => (
                <View key={`empty-${i}`} className="w-9 h-9 m-0.5" />
              ))}
              
              {monthDays.map((day, i) => {
                const hasEntry = hasEntryOnDay(day)
                const today = isToday(day)
                
                return (
                  <View
                    key={i}
                    className={`w-9 h-9 m-0.5 items-center justify-center rounded-lg border ${
                      today 
                        ? 'bg-cyan-500 dark:bg-[#00f2ff] border-cyan-500 dark:border-[#00f2ff]' 
                        : hasEntry 
                          ? 'bg-purple-100 dark:bg-[#1a1a1a] border-purple-200 dark:border-[#8b5cf6]' 
                          : 'border-transparent'
                    }`}
                  >
                    <ThemedText className={`text-xs ${
                      today 
                        ? 'text-white dark:text-black font-black' 
                        : hasEntry 
                          ? 'text-purple-700 dark:text-[#8b5cf6] font-bold' 
                          : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </ThemedText>
                    {hasEntry && !today && (
                      <View className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-500 dark:bg-[#8b5cf6]" />
                    )}
                  </View>
                )
              })}
            </View>
          </View>

          {/* Daily Prompt */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText className="text-lg font-bold uppercase tracking-wider">Daily Protocol</ThemedText>
              <View className="bg-yellow-100 dark:bg-[#1a1a00] px-3 py-1 rounded-sm border border-yellow-200 dark:border-[#ffff00]">
                <ThemedText className="text-[10px] text-yellow-700 dark:text-[#ffff00] font-bold uppercase tracking-widest">
                  Active
                </ThemedText>
              </View>
            </View>
            <DailyPromptCard />
          </View>

          {/* Action Grid */}
          <View className="flex-row gap-4 mb-8">
            <Link href="/(app)/modal" asChild>
              <Pressable className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-800 dark:border-[#333] rounded-2xl p-5 shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
                <LinearGradient
                  colors={isDark ? ['rgba(139,92,246,0.2)', 'transparent'] : ['rgba(124,58,237,0.1)', 'transparent']}
                  className="absolute inset-0 rounded-2xl"
                />
                <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center mb-3">
                  <Ionicons name="add" size={24} color={isDark ? '#8b5cf6' : '#7c3aed'} />
                </View>
                <ThemedText className="font-bold text-lg mb-1 text-white">New Entry</ThemedText>
                <ThemedText className="text-gray-400 text-xs">Initialize log</ThemedText>
              </Pressable>
            </Link>
            
            <Link href="/(app)/(tabs)/journal" asChild>
              <Pressable className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-800 dark:border-[#333] rounded-2xl p-5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                <LinearGradient
                  colors={isDark ? ['rgba(6,182,212,0.2)', 'transparent'] : ['rgba(6,182,212,0.1)', 'transparent']}
                  className="absolute inset-0 rounded-2xl"
                />
                <View className="w-10 h-10 bg-cyan-500/20 rounded-full items-center justify-center mb-3">
                  <Ionicons name="list" size={24} color={isDark ? '#00f2ff' : '#06b6d4'} />
                </View>
                <ThemedText className="font-bold text-lg mb-1 text-white">Archives</ThemedText>
                <ThemedText className="text-gray-400 text-xs">Access database</ThemedText>
              </Pressable>
            </Link>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

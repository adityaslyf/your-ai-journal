import { View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export function StreakCard({ streak, isActive }: { streak: number, isActive: boolean }) {
  return (
    <ThemedView className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-xl flex-row items-center justify-between mb-6 border border-orange-200 dark:border-orange-800">
      <View>
        <ThemedText type="subtitle" className="text-orange-800 dark:text-orange-200">
          Current Streak
        </ThemedText>
        <ThemedText className="text-orange-600 dark:text-orange-300">
          {isActive ? "You're on fire! 🔥" : "Start a streak today!"}
        </ThemedText>
      </View>
      <View className="items-center">
        <ThemedText type="title" className="text-4xl font-bold text-orange-600 dark:text-orange-400">
          {streak}
        </ThemedText>
        <ThemedText className="text-xs font-medium text-orange-800 dark:text-orange-200 uppercase tracking-wider">
          Days
        </ThemedText>
      </View>
    </ThemedView>
  )
}


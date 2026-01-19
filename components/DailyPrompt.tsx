/**
 * DailyPromptCard Component
 * Displays the daily journaling prompt
 */

import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, View } from 'react-native'

import { useDailyPrompt } from '@/hooks/use-daily-prompt'
import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'

export function DailyPromptCard() {
  const { prompt, isLoading } = useDailyPrompt()

  if (isLoading) {
    return (
      <ThemedView className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 justify-center items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
      </ThemedView>
    )
  }

  // Fallback if no prompt is found
  const displayPrompt = prompt?.promptText || "What's one thing you're grateful for today?"
  const isAi = prompt?.aiGenerated

  return (
    <ThemedView className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="bulb-outline" size={20} color="#3B82F6" />
          <ThemedText className="ml-2 font-semibold text-blue-700 dark:text-blue-300">
            Daily Prompt
          </ThemedText>
        </View>
        {isAi && (
          <View className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
            <ThemedText className="text-xs text-blue-700 dark:text-blue-300">AI</ThemedText>
          </View>
        )}
      </View>
      
      <ThemedText className="text-lg font-medium italic text-gray-800 dark:text-gray-100 leading-7">
        "{displayPrompt}"
      </ThemedText>
    </ThemedView>
  )
}

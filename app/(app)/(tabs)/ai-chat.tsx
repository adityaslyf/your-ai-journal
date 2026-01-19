/**
 * AI Chat Screen
 * Chat interface with AI assistant that has journal context
 */

import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { useAIChat } from '@/hooks/use-ai-chat'
import { useAppUser } from '@/lib/utlis/user'

export default function AIChatScreen() {
  const insets = useSafeAreaInsets()
  const { userId } = useAppUser()
  const scrollViewRef = useRef<ScrollView>(null)
  const [input, setInput] = useState('')

  const { messages, isLoading, isStreaming, error, sendMessage, clearError } = useAIChat({
    userId,
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error.message, [
        {
          text: 'OK',
          onPress: clearError,
        },
      ])
    }
  }, [error, clearError])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    const messageText = input.trim()
    setInput('')
    await sendMessage(messageText)
  }

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white dark:bg-gray-900"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText className="mt-4 text-gray-500 dark:text-gray-400">
          Loading conversation...
        </ThemedText>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
        <ThemedText type="title">AI Assistant</ThemedText>
        <View className="flex-row items-center mt-1">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          <ThemedText className="text-gray-500 dark:text-gray-400 text-sm">
            Connected • Has access to your journals
          </ThemedText>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={insets.top}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerClassName="pt-4 pb-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message._id}
              className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                }`}
              >
                {message.role === 'assistant' && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="sparkles"
                      size={14}
                      color={Platform.select({ ios: '#3B82F6', default: '#60A5FA' })}
                    />
                    <ThemedText className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">
                      AI Assistant
                    </ThemedText>
                  </View>
                )}
                <ThemedText
                  className={`leading-6 ${
                    message.role === 'user'
                      ? 'text-white'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message.text}
                </ThemedText>
              </View>
              <ThemedText className="text-xs text-gray-400 mt-1 mx-2">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </ThemedText>
            </View>
          ))}

          {isStreaming && (
            <View className="items-start mb-4">
              <View className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl">
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View
          className="flex-row items-end p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={1000}
            editable={!isStreaming}
            className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 mr-2 max-h-32 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
            style={{ paddingTop: 12 }}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isStreaming}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              input.trim() && !isStreaming
                ? 'bg-blue-600 dark:bg-blue-500'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            {isStreaming ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

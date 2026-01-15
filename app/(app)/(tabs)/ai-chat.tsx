import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function AIChatScreen() {
  const insets = useSafeAreaInsets()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI journaling assistant. I can help you reflect on your day, explore your emotions, or suggest journal prompts. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's interesting! Tell me more about what led to that feeling.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <ThemedText type="title">AI Assistant</ThemedText>
        <ThemedText className="text-gray-500 dark:text-gray-400 text-sm">
          Your personal journaling companion
        </ThemedText>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 p-4" contentContainerClassName="pb-4">
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <ThemedText
                  className={message.isUser ? 'text-white' : 'text-gray-900 dark:text-white'}
                >
                  {message.text}
                </ThemedText>
              </View>
              <ThemedText className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </ThemedText>
            </View>
          ))}

          {isLoading && (
            <View className="items-start mb-4">
              <View className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
                <ActivityIndicator size="small" color="#999" />
              </View>
            </View>
          )}
        </ScrollView>

        <View className="flex-row items-center p-4 border-t border-gray-200 dark:border-gray-800" style={{ paddingBottom: insets.bottom + 16 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 mr-2 max-h-24 text-gray-900 dark:text-white"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full ${
              input.trim() && !isLoading ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

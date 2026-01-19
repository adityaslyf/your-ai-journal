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
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function AIChatScreen() {
  const insets = useSafeAreaInsets()
  const { userId } = useAppUser()
  const scrollViewRef = useRef<ScrollView>(null)
  const [input, setInput] = useState('')
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const { messages, isLoading, isStreaming, error, sendMessage, clearError } = useAIChat({
    userId,
  })

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error.message, [{ text: 'OK', onPress: clearError }])
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
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText className="mt-4 text-gray-500">Connecting to your journal...</ThemedText>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 24, paddingBottom: 20 }} className="bg-white dark:bg-gray-900 z-10">
        <View className="flex-row justify-between items-center">
             <View>
                <ThemedText className="text-3xl font-bold">AI Companion</ThemedText>
                <View className="flex-row items-center mt-1">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <ThemedText className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                        Journal Context Active
                    </ThemedText>
                </View>
             </View>
             <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6"
          contentContainerClassName="pb-40"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && (
             <View className="items-center justify-center mt-20 opacity-50">
                <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
                <ThemedText className="text-gray-400 mt-4 text-center">
                    Start a conversation to reflect on your{'\n'}recent journal entries.
                </ThemedText>
             </View>
          )}

          {messages.map((message, index) => {
            const isUser = message.role === 'user'
            
            return (
              <View
                key={message._id}
                className={`mb-4 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                 {!isUser && (
                     <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-2 self-end mb-1">
                        <Ionicons name="sparkles" size={12} color={colors.primary} />
                     </View>
                 )}

                <View
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    isUser
                      ? 'bg-white border border-gray-100 rounded-tr-sm'
                      : 'bg-gray-50 border border-gray-100 rounded-tl-sm'
                  }`}
                >
                  <ThemedText className={`leading-6 ${isUser ? 'text-gray-900' : 'text-gray-800'}`}>
                    {message.text}
                  </ThemedText>
                  <ThemedText className="text-[10px] mt-2 text-gray-400 text-right">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </ThemedText>
                </View>
              </View>
            )
          })}

          {isStreaming && (
            <View className="flex-row justify-start mb-6">
              <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-2 self-end mb-1">
                <Ionicons name="sparkles" size={12} color={colors.primary} />
              </View>
              <View className="bg-gray-50 p-4 rounded-2xl rounded-tl-sm border border-gray-100">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Input Area - Positioned above tab bar */}
        <View 
            className="absolute left-4 right-4"
            style={{ 
                bottom: 110, // Position above the floating tab bar (70px height + 30px bottom + 10px spacing)
            }}
        >
          <View className="flex-row items-end bg-white dark:bg-gray-800 rounded-[24px] shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700 px-4 py-2">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={1000}
              editable={!isStreaming}
              className="flex-1 min-h-[44px] max-h-[100px] text-gray-900 dark:text-white mr-2 pt-3 pb-3 font-medium"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || isStreaming}
              className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
                input.trim() && !isStreaming
                  ? 'bg-black dark:bg-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {isStreaming ? (
                <ActivityIndicator size="small" color={input.trim() ? "white" : "#999"} />
              ) : (
                <Ionicons name="arrow-up" size={20} color={input.trim() ? "white" : "#999"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

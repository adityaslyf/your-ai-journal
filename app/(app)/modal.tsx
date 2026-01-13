import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { sanityConfig } from '@/lib/utlis/generateApiUrl'
import { useAppUser } from '@/lib/utlis/user'

export default function NewEntryScreen() {
  const router = useRouter()
  const { userId } = useAppUser()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing fields', 'Please fill in title and content')
      return
    }

    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create an entry')
      return
    }

    setIsSubmitting(true)
    try {
      const mutations = [
        {
          create: {
            _type: 'journalEntry',
            title: title.trim(),
            content: [
              {
                _type: 'block',
                _key: Math.random().toString(36).substring(7),
                children: [
                  {
                    _type: 'span',
                    _key: Math.random().toString(36).substring(7),
                    text: content.trim(),
                    marks: [],
                  },
                ],
                markDefs: [],
                style: 'normal',
              },
            ],
            moodRating: mood,
            userId,
            createdAt: new Date().toISOString(),
          },
        },
      ]

      const token = process.env.EXPO_PUBLIC_SANITY_TOKEN

      if (!token) {
        Alert.alert('Configuration Error', 'Sanity token not found. Please check your environment variables.')
        return
      }

      const response = await fetch(
        `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/mutate/${sanityConfig.dataset}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mutations }),
        }
      )

      const result = await response.json()
      
      if (result.error) {
        console.error('Sanity Error:', result.error)
        throw new Error(result.error.description || 'Failed to create entry')
      }

      router.back()
    } catch (error: any) {
      console.error(error)
      Alert.alert('Error', error.message || 'Failed to save entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ThemedView className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800 z-10">
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText className="text-blue-600 dark:text-blue-400">Cancel</ThemedText>
        </TouchableOpacity>
        <ThemedText type="subtitle">New Entry</ThemedText>
        <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <ThemedText className="text-blue-600 dark:text-blue-400 font-semibold">Save</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 p-4"
          contentContainerClassName="pb-24"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6">
            <ThemedText className="mb-2 font-medium opacity-70">Title</ThemedText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Give your day a headline..."
              placeholderTextColor="#9CA3AF"
              className="text-xl font-bold p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white"
            />
          </View>

          <View className="mb-6">
            <ThemedText className="mb-2 font-medium opacity-70">How are you feeling? ({mood}/10)</ThemedText>
            <View className="flex-row justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <TouchableOpacity 
                onPress={() => setMood(Math.max(1, mood - 1))}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
              >
                <Ionicons name="remove" size={24} color="#6B7280" />
              </TouchableOpacity>
              
              <View className="items-center">
                <ThemedText type="title" className="text-3xl">
                  {mood >= 8 ? '😊' : mood >= 5 ? '😐' : '😔'}
                </ThemedText>
                <ThemedText className="text-sm opacity-60">
                  {mood >= 8 ? 'Great' : mood >= 5 ? 'Okay' : 'Low'}
                </ThemedText>
              </View>

              <TouchableOpacity 
                onPress={() => setMood(Math.min(10, mood + 1))}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
              >
                <Ionicons name="add" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <ThemedText className="mb-2 font-medium opacity-70">Journal Entry</ThemedText>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              placeholderTextColor="#9CA3AF"
              multiline
              scrollEnabled={false} // Let the parent ScrollView handle scrolling
              textAlignVertical="top"
              className="min-h-[300px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-base text-gray-900 dark:text-white"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

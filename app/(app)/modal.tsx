import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { SANITY_TOKEN } from '@/lib/constants/sanity'
import { executeMutation } from '@/lib/services/sanity/client'
import { uploadImageToSanity } from '@/lib/utlis/sanity/image'
import { useAppUser } from '@/lib/utlis/user'

export default function NewEntryScreen() {
  const router = useRouter()
  const { userId } = useAppUser()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState(5)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing fields', 'Please fill in title and content')
      return
    }

    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create an entry')
      return
    }

    if (!SANITY_TOKEN) {
      Alert.alert('Configuration Error', 'Sanity token not found. Please check your environment variables.')
      return
    }

    setIsSubmitting(true)
    try {
      let imageAsset = null
      
      if (imageUri) {
        imageAsset = await uploadImageToSanity(imageUri)
      }

      const mutations = [
        {
          create: {
            _type: 'journalEntry',
            title: title.trim(),
            ...(imageAsset && { image: { _type: 'image', asset: imageAsset } }),
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

      await executeMutation(mutations, SANITY_TOKEN)
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
            <ThemedText className="mb-2 font-medium opacity-70">Cover Image</ThemedText>
            {imageUri ? (
              <View className="relative">
                <Image source={{ uri: imageUri }} className="w-full h-48 rounded-lg" resizeMode="cover" />
                <TouchableOpacity
                  onPress={() => setImageUri(null)}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 items-center justify-center"
              >
                <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                <ThemedText className="mt-2 text-gray-500 dark:text-gray-400">Tap to add image</ThemedText>
              </TouchableOpacity>
            )}
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
              scrollEnabled={false}
              textAlignVertical="top"
              className="min-h-[300px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-base text-gray-900 dark:text-white"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

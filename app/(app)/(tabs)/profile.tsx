import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { useAppUser } from '@/lib/utlis/user'

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAppUser()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(auth)/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <ScrollView 
      className="flex-1 bg-white dark:bg-gray-900" 
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="p-6 border-b border-gray-200 dark:border-gray-800">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-blue-600 dark:bg-blue-500 items-center justify-center mb-4">
            <ThemedText type="title" className="text-white text-4xl">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </ThemedText>
          </View>
          <ThemedText type="title">{user?.fullName || 'User'}</ThemedText>
          <ThemedText className="text-gray-500 dark:text-gray-400">
            {user?.email}
          </ThemedText>
        </View>
      </View>

      <View className="p-6">
        <ThemedText type="subtitle" className="mb-4">Settings</ThemedText>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={24} color="#666" />
            <ThemedText className="ml-3">Notifications</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center">
            <Ionicons name="lock-closed-outline" size={24} color="#666" />
            <ThemedText className="ml-3">Privacy</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center">
            <Ionicons name="color-palette-outline" size={24} color="#666" />
            <ThemedText className="ml-3">Appearance</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center">
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <ThemedText className="ml-3">Help & Support</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-between py-4 mt-6"
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <ThemedText className="ml-3 text-red-500">Sign Out</ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

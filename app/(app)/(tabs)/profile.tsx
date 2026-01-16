import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useAppUser } from '@/lib/utlis/user'

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAppUser()
  const colorScheme = useColorScheme()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(auth)/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const MenuOption = ({ icon, label, onPress, isDestructive = false }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-4 bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700 border-b border-gray-100 dark:border-gray-800 last:border-0"
    >
      <View className="flex-row items-center">
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isDestructive ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <Ionicons name={icon} size={18} color={isDestructive ? '#ef4444' : (colorScheme === 'dark' ? '#E5E7EB' : '#4B5563')} />
        </View>
        <ThemedText className={`font-medium ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
          {label}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colorScheme === 'dark' ? '#4B5563' : '#D1D5DB'} />
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView 
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}
      >
        <View className="px-6 mb-8">
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-full bg-blue-600 dark:bg-blue-500 items-center justify-center mr-4 shadow-lg shadow-blue-500/30">
              <ThemedText type="title" className="text-white text-3xl">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </ThemedText>
            </View>
            <View>
              <ThemedText type="title" className="text-2xl">{user?.fullName || 'User'}</ThemedText>
              <ThemedText className="text-gray-500 dark:text-gray-400">
                {user?.email}
              </ThemedText>
              <View className="bg-green-100 dark:bg-green-900/30 self-start px-2 py-0.5 rounded-full mt-2">
                <ThemedText className="text-xs text-green-700 dark:text-green-300 font-medium">Free Plan</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mb-4">
          <ThemedText className="uppercase text-xs text-gray-400 font-bold tracking-widest mb-2 ml-2">Settings</ThemedText>
          <View className="rounded-2xl overflow-hidden shadow-sm">
            <MenuOption icon="notifications-outline" label="Notifications" />
            <MenuOption icon="lock-closed-outline" label="Privacy" />
            <MenuOption icon="color-palette-outline" label="Appearance" />
            <MenuOption icon="star-outline" label="Rate the app" />
          </View>
        </View>

        <View className="px-6">
          <ThemedText className="uppercase text-xs text-gray-400 font-bold tracking-widest mb-2 ml-2">Support</ThemedText>
          <View className="rounded-2xl overflow-hidden shadow-sm">
            <MenuOption icon="help-circle-outline" label="Help & Support" />
            <MenuOption icon="document-text-outline" label="Terms of Service" />
            <MenuOption icon="log-out-outline" label="Sign Out" isDestructive onPress={handleSignOut} />
          </View>
        </View>
        
        <View className="items-center mt-10">
          <ThemedText className="text-xs text-gray-400">Version 1.0.0</ThemedText>
        </View>
      </ScrollView>
    </View>
  )
}

import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, TouchableOpacity, View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { useAppUser } from '@/lib/utlis/user'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAppUser()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(auth)/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Purple Curved Header */}
      <View 
        style={{ 
          backgroundColor: colors.primary, 
          height: 280,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
        }}
      >
        <View className="flex-row justify-between items-start">
            <ThemedText className="text-white text-2xl font-semibold">My profile</ThemedText>
            <View className="flex-row gap-3">
                <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                    <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleSignOut}
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                >
                    <Ionicons name="log-out-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
      </View>

      {/* Overlapping Profile Card */}
      <View className="px-6 -mt-20">
        <View className="bg-white dark:bg-gray-900 rounded-[32px] p-6 shadow-sm flex-row items-center gap-4">
            <View className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden">
                {user?.imageUrl ? (
                    <Image source={{ uri: user.imageUrl }} className="w-full h-full" />
                ) : (
                    <View className="w-full h-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <ThemedText className="text-2xl">{user?.fullName?.charAt(0)}</ThemedText>
                    </View>
                )}
            </View>
            <View>
                <ThemedText className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {user?.fullName || 'User'}
                </ThemedText>
                <ThemedText className="text-gray-500 text-sm">
                    {user?.email}
                </ThemedText>
            </View>
        </View>


        {/* Content Section */}
        <ScrollView className="mt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
            <View className="mb-6">
                <ThemedText className="text-lg font-bold mb-4">About</ThemedText>
                <ThemedText className="text-gray-500 leading-6">
                    Passionate journaler focusing on mindfulness and personal growth. 
                    Tracking daily moods and habits to improve mental well-being.
                </ThemedText>
            </View>

            <View>
                <ThemedText className="text-lg font-bold mb-4">Upcoming Goals</ThemedText>
                
                {/* Goal Card 1 */}
                <View className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 mb-3 flex-row items-center">
                    <View style={{ backgroundColor: colors.secondary }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                        <Ionicons name="flame" size={24} color="#1C1C1E" />
                    </View>
                    <View className="flex-1">
                        <ThemedText className="font-bold text-base">7 Day Streak</ThemedText>
                        <ThemedText className="text-gray-400 text-xs mt-1">Consistency is key</ThemedText>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* Goal Card 2 */}
                <View className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 mb-3 flex-row items-center">
                    <View style={{ backgroundColor: colors.primary }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4 opacity-80">
                         <Ionicons name="book" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                        <ThemedText className="font-bold text-base">100 Entries</ThemedText>
                        <ThemedText className="text-gray-400 text-xs mt-1">Master Journaler</ThemedText>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                 {/* Goal Card 3 */}
                 <View className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 mb-3 flex-row items-center">
                    <View style={{ backgroundColor: colors.tertiary }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                         <Ionicons name="happy" size={24} color="#1C1C1E" />
                    </View>
                    <View className="flex-1">
                        <ThemedText className="font-bold text-base">Mood Tracking</ThemedText>
                        <ThemedText className="text-gray-400 text-xs mt-1">Log 30 days of mood</ThemedText>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
      </View>
    </View>
  )
}

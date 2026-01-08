import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth()

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  // Redirect based on auth state
  if (isSignedIn) {
    return <Redirect href="/(app)/(tabs)" />
  }

  return <Redirect href="/(auth)/sign-in" />
}

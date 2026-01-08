import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return

    // Validate inputs
    if (!emailAddress.trim()) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password')
      return
    }

    setIsLoading(true)

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        Alert.alert('Error', 'Sign in incomplete. Please try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      
      // Better error messages
      const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Sign in failed. Please check your credentials.'
      Alert.alert('Sign In Error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-gray-900">
      <Text className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Sign In</Text>
      
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#9CA3AF"
        onChangeText={setEmailAddress}
        editable={!isLoading}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      />
      
      <TextInput
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={true}
        autoComplete="password"
        onChangeText={setPassword}
        editable={!isLoading}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-6 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      />
      
      <TouchableOpacity 
        onPress={onSignInPress}
        disabled={isLoading}
        className={`rounded-lg py-3 mb-4 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 active:bg-blue-700'}`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {isLoading ? 'Signing in...' : 'Continue'}
        </Text>
      </TouchableOpacity>
      
      <View className="flex-row gap-2 justify-center">
        <Text className="text-gray-600 dark:text-gray-400">Don't have an account?</Text>
        <Link href="/(auth)/sign-up">
          <Text className="text-blue-600 dark:text-blue-400 font-semibold">Sign up</Text>
        </Link>
      </View>
    </View>
  )
}
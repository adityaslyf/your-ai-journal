import { useOAuth, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const onSignUpPress = async () => {
    if (!isLoaded) return

    if (!emailAddress.trim()) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    if (!password.trim() || password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
      
      Alert.alert(
        'Verification Code Sent!', 
        'Check your email for the code.\n\n💡 Development tip: If you don\'t receive an email, check your spam folder or Clerk dashboard.',
        [{ text: 'OK' }]
      )
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Sign up failed. Please try again.'
      Alert.alert('Sign Up Error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the verification code')
      return
    }

    setIsLoading(true)

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
        Alert.alert('Error', 'Verification incomplete. Please try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Verification failed. Please check your code.'
      Alert.alert('Verification Error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
        router.replace('/')
      }
    } catch (err: any) {
      console.error('OAuth error:', err)
      Alert.alert('Sign Up Error', 'Failed to sign up with Google. Please try again.')
    }
  }

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center px-6 bg-white dark:bg-gray-900">
        <Text className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Verify Email</Text>
        <Text className="text-gray-600 dark:text-gray-400 mb-2">
          Enter the verification code sent to:
        </Text>
        <Text className="text-blue-600 dark:text-blue-400 font-semibold mb-6">
          {emailAddress}
        </Text>
        
        <View className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <Text className="text-yellow-800 dark:text-yellow-200 text-sm">
            💡 <Text className="font-semibold">Tip:</Text> Check your spam folder if you don't see the email.
          </Text>
        </View>
        
        <TextInput
          value={code}
          placeholder="Enter 6-digit code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setCode}
          editable={!isLoading}
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-6 text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-center text-2xl tracking-widest"
        />
        
        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className={`rounded-lg py-3 mb-4 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 active:bg-blue-700'}`}>
          <Text className="text-white text-center font-semibold text-lg">
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setPendingVerification(false)}
          className="py-2">
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            ← Back to sign up
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-gray-900">
      <Text className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Sign Up</Text>
      
      {/* Google Sign Up Button */}
      <TouchableOpacity
        onPress={onGoogleSignUp}
        className="flex-row items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 mb-6 active:bg-gray-50 dark:active:bg-gray-700">
        <Text className="text-lg mr-2">🔍</Text>
        <Text className="text-gray-900 dark:text-white font-semibold">Continue with Google</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700" />
        <Text className="mx-4 text-gray-500 dark:text-gray-400">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700" />
      </View>
      
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
        placeholder="Enter password (min 8 characters)"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={true}
        autoComplete="password-new"
        onChangeText={setPassword}
        editable={!isLoading}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-6 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      />
      
      <TouchableOpacity
        onPress={onSignUpPress}
        disabled={isLoading}
        className={`rounded-lg py-3 mb-4 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 active:bg-blue-700'}`}>
        <Text className="text-white text-center font-semibold text-lg">
          {isLoading ? 'Creating account...' : 'Continue'}
        </Text>
      </TouchableOpacity>
      
      <View className="flex-row gap-2 justify-center">
        <Text className="text-gray-600 dark:text-gray-400">Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text className="text-blue-600 dark:text-blue-400 font-semibold">Sign in</Text>
        </Link>
      </View>
    </View>
  )
}
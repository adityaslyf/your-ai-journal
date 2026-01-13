import { useUser } from '@clerk/clerk-expo'

export interface AppUser {
  id: string
  email?: string
  fullName?: string
  imageUrl?: string
}

/**
 * Custom hook to get the current authenticated user in a standardized format
 */
export const useAppUser = () => {
  const { user, isLoaded, isSignedIn } = useUser()

  const appUser: AppUser | null = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        fullName: user.fullName || undefined,
        imageUrl: user.imageUrl,
      }
    : null

  return {
    user: appUser,
    isLoaded,
    isSignedIn,
    userId: user?.id,
  }
}

/**
 * Helper to get the user ID if available, or throw/return null
 */
export const getUserId = (user: any) => {
  return user?.id || null
}


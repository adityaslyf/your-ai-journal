/**
 * Chat API Service
 * All chat-related API calls
 */

import { executeQuery, executeMutation } from '@/lib/services/sanity/client'
import {
  GET_USER_CONVERSATION,
  GET_CONVERSATION_MESSAGES,
  GET_RECENT_JOURNALS_FOR_CONTEXT,
} from '@/lib/services/sanity/queries'
import { SANITY_TOKEN } from '@/lib/constants/sanity'
import type { ChatConversation, ChatMessage, ChatMessageInput, JournalContext } from '@/lib/types'

/**
 * Fetch or create a conversation for the user
 */
export async function fetchOrCreateConversation(
  userId: string
): Promise<ChatConversation> {
  try {
    // Try to fetch existing conversation
    let conversation = await executeQuery<ChatConversation>(
      GET_USER_CONVERSATION,
      { userId }
    )

    // If no conversation exists, create one
    if (!conversation) {
      if (!SANITY_TOKEN) {
        throw new Error('Sanity token not configured')
      }

      const mutations = [
        {
          create: {
            _type: 'chatConversation',
            userId,
            title: 'New Conversation',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ]

      const result = await executeMutation(mutations, SANITY_TOKEN)
      conversation = result.results[0].document as ChatConversation
    }

    return conversation
  } catch (error) {
    console.error('Failed to fetch/create conversation:', error)
    throw error
  }
}

/**
 * Fetch all messages for a conversation
 */
export async function fetchConversationMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  try {
    const messages = await executeQuery<ChatMessage[]>(
      GET_CONVERSATION_MESSAGES,
      { conversationId }
    )
    return messages || []
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    throw error
  }
}

/**
 * Save a message to Sanity
 */
export async function saveMessage(
  message: ChatMessageInput
): Promise<ChatMessage> {
  try {
    if (!SANITY_TOKEN) {
      throw new Error('Sanity token not configured')
    }

    const mutations = [
      {
        create: {
          _type: 'chatMessage',
          conversationId: {
            _type: 'reference',
            _ref: message.conversationId,
          },
          text: message.text,
          role: message.role,
          timestamp: new Date().toISOString(),
        },
      },
    ]

    const result = await executeMutation(mutations, SANITY_TOKEN)
    const savedMessage = result.results[0].document as ChatMessage

    // Update conversation's updatedAt timestamp
    await updateConversationTimestamp(message.conversationId)

    return savedMessage
  } catch (error) {
    console.error('Failed to save message:', error)
    throw error
  }
}

/**
 * Update conversation's updatedAt timestamp
 */
async function updateConversationTimestamp(conversationId: string): Promise<void> {
  try {
    if (!SANITY_TOKEN) {
      return
    }

    const mutations = [
      {
        patch: {
          id: conversationId,
          set: {
            updatedAt: new Date().toISOString(),
          },
        },
      },
    ]

    await executeMutation(mutations, SANITY_TOKEN)
  } catch (error) {
    console.error('Failed to update conversation timestamp:', error)
    // Non-critical, don't throw
  }
}

/**
 * Fetch recent journals for AI context
 */
export async function fetchRecentJournalsForContext(
  userId: string
): Promise<JournalContext[]> {
  try {
    const journals = await executeQuery<JournalContext[]>(
      GET_RECENT_JOURNALS_FOR_CONTEXT,
      { userId }
    )
    return journals || []
  } catch (error) {
    console.error('Failed to fetch journal context:', error)
    return [] // Return empty array on error to allow chat to continue
  }
}

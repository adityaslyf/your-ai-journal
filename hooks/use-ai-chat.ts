/**
 * useAIChat Hook
 * Custom hook for managing AI chat functionality
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  fetchOrCreateConversation,
  fetchConversationMessages,
  saveMessage,
  fetchRecentJournalsForContext,
} from '@/lib/api/chat'
import { generateChatResponseStream } from '@/lib/services/gemini/client'
import type { ChatMessage, JournalContext } from '@/lib/types'

interface UseAIChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: Error | null
  sendMessage: (text: string) => Promise<void>
  clearError: () => void
}

interface UseAIChatOptions {
  userId: string | undefined
}

export function useAIChat({ userId }: UseAIChatOptions): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [journalContext, setJournalContext] = useState<JournalContext[]>([])
  
  const streamingMessageRef = useRef<ChatMessage | null>(null)

  // Initialize conversation and load messages
  useEffect(() => {
    async function initialize() {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch or create conversation
        const conversation = await fetchOrCreateConversation(userId)
        setConversationId(conversation._id)

        // Fetch existing messages
        const existingMessages = await fetchConversationMessages(conversation._id)
        setMessages(existingMessages)

        // Fetch journal context
        const journals = await fetchRecentJournalsForContext(userId)
        setJournalContext(journals)

        // Add welcome message if no messages exist
        if (existingMessages.length === 0) {
          const welcomeMessage: ChatMessage = {
            _id: 'welcome-' + Date.now(),
            text: "Hi! I'm your AI journaling assistant. I have access to your recent journal entries and can help you reflect on your experiences, explore your emotions, or suggest journal prompts. How are you feeling today?",
            role: 'assistant',
            timestamp: new Date().toISOString(),
            conversationId: conversation._id,
          }
          setMessages([welcomeMessage])
          
          // Save welcome message to Sanity
          await saveMessage({
            text: welcomeMessage.text,
            role: 'assistant',
            conversationId: conversation._id,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize chat'))
        console.error('Chat initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [userId])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!userId || !conversationId || !text.trim()) {
        return
      }

      try {
        setError(null)

        // Create user message
        const userMessage: ChatMessage = {
          _id: 'temp-user-' + Date.now(),
          text: text.trim(),
          role: 'user',
          timestamp: new Date().toISOString(),
          conversationId,
        }

        // Add user message to UI immediately
        setMessages((prev) => [...prev, userMessage])

        // Save user message to Sanity
        const savedUserMessage = await saveMessage({
          text: userMessage.text,
          role: 'user',
          conversationId,
        })

        // Update message with real ID if save was successful
        if (savedUserMessage?._id) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === userMessage._id ? { ...msg, _id: savedUserMessage._id } : msg
            )
          )
        }

        // Create empty AI message for streaming
        const aiMessageId = 'temp-ai-' + Date.now()
        const aiMessage: ChatMessage = {
          _id: aiMessageId,
          text: '',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          conversationId,
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsStreaming(true)
        streamingMessageRef.current = aiMessage

        // Prepare chat history for AI
        const chatHistory = [...messages, userMessage].map((msg) => ({
          text: msg.text,
          role: msg.role,
        }))

        // Generate AI response with streaming
        const fullResponse = await generateChatResponseStream(
          chatHistory,
          journalContext,
          (chunk) => {
            // Update streaming message
            if (streamingMessageRef.current) {
              streamingMessageRef.current.text += chunk
              setMessages((prev) =>
                prev.map((msg) =>
                  msg._id === aiMessageId
                    ? { ...msg, text: streamingMessageRef.current!.text }
                    : msg
                )
              )
            }
          }
        )

        setIsStreaming(false)
        streamingMessageRef.current = null

        // Save complete AI response to Sanity
        const savedAiMessage = await saveMessage({
          text: fullResponse,
          role: 'assistant',
          conversationId,
        })

        // Update message with real ID if save was successful
        if (savedAiMessage?._id) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === aiMessageId ? { ...msg, _id: savedAiMessage._id } : msg
            )
          )
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to send message'))
        console.error('Send message error:', err)
        setIsStreaming(false)
        streamingMessageRef.current = null
        
        // Remove the failed AI message
        setMessages((prev) => prev.filter((msg) => !msg._id.startsWith('temp-ai-')))
      }
    },
    [userId, conversationId, messages, journalContext]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearError,
  }
}

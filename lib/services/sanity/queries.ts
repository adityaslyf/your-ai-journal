/**
 * GROQ Queries
 * All Sanity GROQ queries in one place
 */

/**
 * Get all journal entries for a specific user
 */
export const GET_USER_JOURNAL_ENTRIES = `
  *[_type == "journalEntry" && userId == $userId] | order(createdAt desc) {
    _id,
    title,
    moodRating,
    createdAt,
    aiCategories,
    image {
      asset -> {
        _id,
        url
      }
    }
  }
`

/**
 * Get a single journal entry by ID
 */
export const GET_JOURNAL_ENTRY_BY_ID = `
  *[_type == "journalEntry" && _id == $entryId][0] {
    _id,
    title,
    content,
    moodRating,
    createdAt,
    updatedAt,
    userId,
    aiCategories,
    image {
      asset -> {
        _id,
        url
      }
    }
  }
`

/**
 * Get the latest active daily prompt
 */
export const GET_LATEST_DAILY_PROMPT = `
  *[_type == "dailyPrompt" && isActive == true] | order(date desc)[0] {
    _id,
    promptText,
    date,
    aiGenerated
  }
`

/**
 * Get daily prompt for a specific date
 */
export const GET_DAILY_PROMPT_BY_DATE = `
  *[_type == "dailyPrompt" && date == $date && isActive == true][0] {
    _id,
    promptText,
    date,
    aiGenerated
  }
`

/**
 * Get user's most recent conversation
 */
export const GET_USER_CONVERSATION = `
  *[_type == "chatConversation" && userId == $userId] | order(updatedAt desc)[0] {
    _id,
    userId,
    title,
    createdAt,
    updatedAt
  }
`

/**
 * Get all messages for a conversation
 */
export const GET_CONVERSATION_MESSAGES = `
  *[_type == "chatMessage" && conversationId == $conversationId] | order(timestamp asc) {
    _id,
    text,
    role,
    timestamp,
    conversationId
  }
`

/**
 * Get recent journals for AI context (last 15 entries)
 */
export const GET_RECENT_JOURNALS_FOR_CONTEXT = `
  *[_type == "journalEntry" && userId == $userId] | order(createdAt desc)[0...15] {
    title,
    content,
    moodRating,
    createdAt,
    aiCategories
  }
`

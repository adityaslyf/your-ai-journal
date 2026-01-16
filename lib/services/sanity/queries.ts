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

import { category } from './documents/category'
import { chatConversation } from './documents/chat-conversation'
import { chatMessage } from './documents/chat-message'
import { dailyPrompt } from './documents/daily-prompt'
import { journalEntry } from './documents/journal-entry'

export const schemaTypes = [
  journalEntry,
  category,
  dailyPrompt,
  chatConversation,
  chatMessage,
]

import { useMemo } from 'react'

interface JournalEntry {
  _id: string
  createdAt: string
  [key: string]: any
}

interface StreakResult {
  streak: number
  isActive: boolean
  lastEntryDate: string | null
}

export function useStreak(entries: JournalEntry[]): StreakResult {
  return useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        streak: 0,
        isActive: false,
        lastEntryDate: null,
      }
    }

    const uniqueDates = new Set(
      entries.map((entry) => entry.createdAt.split('T')[0])
    )

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const hasEntryToday = uniqueDates.has(today)
    const hasEntryYesterday = uniqueDates.has(yesterday)

    if (!hasEntryToday && !hasEntryYesterday) {
      return {
        streak: 0,
        isActive: false,
        lastEntryDate: Array.from(uniqueDates).sort().reverse()[0] || null,
      }
    }

    let currentStreak = 0
    let checkDate = new Date()

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0]

      if (uniqueDates.has(dateStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        if (dateStr === today && hasEntryYesterday) {
          checkDate.setDate(checkDate.getDate() - 1)
          continue
        }
        break
      }
    }

    return {
      streak: currentStreak,
      isActive: hasEntryToday,
      lastEntryDate: Array.from(uniqueDates).sort().reverse()[0] || null,
    }
  }, [entries])
}

export function getStreakMessage(streak: number, isActive: boolean): string {
  if (streak === 0) {
    return "Start a streak today! 🌱"
  }

  if (isActive) {
    if (streak === 1) {
      return "Great start! Keep going! 🌟"
    } else if (streak < 7) {
      return `${streak} days strong! 💪`
    } else if (streak < 30) {
      return "You're on fire! 🔥"
    } else if (streak < 100) {
      return "Incredible dedication! 🏆"
    } else {
      return "Legendary streak! 👑"
    }
  } else {
    return `${streak} day${streak > 1 ? 's' : ''} - Journal today to keep it going! ⏰`
  }
}

export function getStreakProgress(streak: number, goal: number = 30): number {
  return Math.min(Math.round((streak / goal) * 100), 100)
}

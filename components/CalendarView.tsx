/**
 * CalendarView Component
 * Displays a calendar with journal entry markers
 */

import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { format } from 'date-fns'

import { ThemedView } from './themed-view'
import { ThemedText } from './themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import type { JournalEntryListItem } from '@/lib/types'

interface CalendarViewProps {
  entries: JournalEntryListItem[]
}

export function CalendarView({ entries }: CalendarViewProps) {
  const colorScheme = useColorScheme()
  
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {}
    
    entries.forEach(entry => {
      const dateStr = format(new Date(entry.createdAt), 'yyyy-MM-dd')
      
      marks[dateStr] = {
        marked: true,
        dotColor: colorScheme === 'dark' ? '#60A5FA' : '#2563EB',
        activeOpacity: 0.8,
      }
    })

    const today = format(new Date(), 'yyyy-MM-dd')
    marks[today] = {
      ...marks[today],
      selected: true,
      selectedColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
      selectedTextColor: colorScheme === 'dark' ? '#F9FAFB' : '#111827',
    }

    return marks
  }, [entries, colorScheme])

  return (
    <ThemedView className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
      <View className="flex-row items-center justify-between mb-4">
        <ThemedText type="subtitle">Your Journey</ThemedText>
      </View>
      
      <Calendar
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
          selectedDayBackgroundColor: colorScheme === 'dark' ? '#3B82F6' : '#2563EB',
          selectedDayTextColor: '#ffffff',
          todayTextColor: colorScheme === 'dark' ? '#60A5FA' : '#2563EB',
          dayTextColor: colorScheme === 'dark' ? '#E5E7EB' : '#1F2937',
          textDisabledColor: colorScheme === 'dark' ? '#374151' : '#D1D5DB',
          dotColor: colorScheme === 'dark' ? '#60A5FA' : '#2563EB',
          selectedDotColor: '#ffffff',
          arrowColor: colorScheme === 'dark' ? '#E5E7EB' : '#1F2937',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: colorScheme === 'dark' ? '#E5E7EB' : '#1F2937',
          indicatorColor: colorScheme === 'dark' ? '#60A5FA' : '#2563EB',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13
        }}
        markedDates={markedDates}
        enableSwipeMonths={true}
      />
    </ThemedView>
  )
}

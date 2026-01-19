import { CommentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const chatMessage = defineType({
  name: 'chatMessage',
  title: 'Chat Message',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'conversationId',
      title: 'Conversation',
      type: 'reference',
      to: [{ type: 'chatConversation' }],
      description: 'The conversation this message belongs to',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Message Text',
      type: 'text',
      description: 'The content of the message',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Who sent this message',
      options: {
        list: [
          { title: 'User', value: 'user' },
          { title: 'Assistant', value: 'assistant' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      description: 'When this message was sent',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      text: 'text',
      role: 'role',
      timestamp: 'timestamp',
    },
    prepare({ text, role, timestamp }) {
      const formattedTime = timestamp
        ? new Date(timestamp).toLocaleString()
        : 'No timestamp'
      const preview = text?.substring(0, 60) + (text?.length > 60 ? '...' : '')
      const roleEmoji = role === 'user' ? '👤' : '🤖'

      return {
        title: `${roleEmoji} ${preview}`,
        subtitle: formattedTime,
      }
    },
  },
  orderings: [
    {
      title: 'Timestamp, Old to New',
      name: 'timestampAsc',
      by: [{ field: 'timestamp', direction: 'asc' }],
    },
    {
      title: 'Timestamp, New to Old',
      name: 'timestampDesc',
      by: [{ field: 'timestamp', direction: 'desc' }],
    },
  ],
})

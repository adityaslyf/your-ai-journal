import { MessageSquareIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const chatConversation = defineType({
  name: 'chatConversation',
  title: 'Chat Conversation',
  type: 'document',
  icon: MessageSquareIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'The Clerk user ID who owns this conversation',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Conversation Title',
      type: 'string',
      description: 'Title or summary of the conversation',
      initialValue: 'New Conversation',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      description: 'When this conversation was created',
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: 'When this conversation was last updated',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      userId: 'userId',
      createdAt: 'createdAt',
    },
    prepare({ title, userId, createdAt }) {
      const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString()
        : 'No date'

      return {
        title: title || 'Untitled Conversation',
        subtitle: `User: ${userId?.substring(0, 8)}... • ${formattedDate}`,
      }
    },
  },
  orderings: [
    {
      title: 'Updated Date, New',
      name: 'updatedDateDesc',
      by: [{ field: 'updatedAt', direction: 'desc' }],
    },
    {
      title: 'Created Date, New',
      name: 'createdDateDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})

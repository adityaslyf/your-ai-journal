import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'Name of the category (e.g., Personal, Work, Health, Relationships)',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
      options: {
        source: 'title',
        maxLength: 50,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of this category',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Color associated with this category',
      options: {
        list: [
          { title: 'Red', value: '#ef4444' },
          { title: 'Orange', value: '#f97316' },
          { title: 'Yellow', value: '#eab308' },
          { title: 'Green', value: '#22c55e' },
          { title: 'Blue', value: '#3b82f6' },
          { title: 'Indigo', value: '#6366f1' },
          { title: 'Purple', value: '#a855f7' },
          { title: 'Pink', value: '#ec4899' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color',
    },
    prepare({ title, color }) {
      return {
        title: title || 'Untitled Category',
        subtitle: 'Category',
        media: TagIcon,
      }
    },
  },
})


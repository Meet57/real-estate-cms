import type { CollectionConfig } from 'payload'
import { tr } from 'payload/i18n/tr'

const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    // read: () => true, // public can read all properties
    // create: () => true,
    // update: ({ req: { user }, id }) => {
    //   // Users can only update themselves
    //   if (!user) return false
    //   return user.id === id
    // },
    // delete: () => false, // users cannot delete themselves

    // TODO: Put the comment one when done with development

    create: ({ req: { user } }) => {
      if (!user) return false
      // Only check role if user is from "users" collection
      if (!user || user.collection !== 'users') return false
      return user.role === 'seller' || user.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (!user || user.collection !== 'users') return false
      if (user.role == 'admin') return true
      if (user.role !== 'seller') return false
      return {
        postedBy: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user || user.collection !== 'users') return false
      if (user.role === 'admin') return true
      if (user.role !== 'seller') return false
      return {
        postedBy: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'propertyType',
      type: 'select',
      required: true,
      options: [
        { label: 'Apartment', value: 'apartment' },
        { label: 'House', value: 'house' },
        { label: 'Condo', value: 'condo' },
        { label: 'Land', value: 'land' },
      ],
    },
    {
      name: 'bedrooms',
      type: 'number',
    },
    {
      name: 'bathrooms',
      type: 'number',
    },
    {
      name: 'size',
      type: 'number',
      label: 'Size (sqft)',
    },
    {
      name: 'amenities',
      type: 'relationship',
      relationTo: 'amenities',
      hasMany: true,
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'postedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      // Auto-populate with current user on create
      admin: {
        condition: () => true, // Hide from admin UI
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            // Auto-set postedBy to current user on create
            if (operation === 'create' && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
  ],
}

export default Properties

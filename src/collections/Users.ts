import type { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // enables login, register, JWT
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.role === 'admin') return true // admins can update anyone
      return user.id === id // others can update themselves
    },
    delete: ({ req: { user } }) => !!user && user.role === 'admin', // only admins can delete
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'buyer',
      options: [
        { label: 'Buyer', value: 'buyer' },
        { label: 'Seller', value: 'seller' },
        { label: 'Admin', value: 'admin' },
      ],
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

export default Users

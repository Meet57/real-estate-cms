import type { CollectionConfig } from 'payload'

const Messages: CollectionConfig = {
  slug: 'messages',
  admin: { useAsTitle: 'messageText' },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,

    // For more authentication about the messages

    /**
      read: ({ req: { user } }) => {
        if (!user) return false
        return {
          OR: [
            { sender: { equals: user.id } },
            { receiver: { equals: user.id } },
          ],
        }
      }
     */
  },
  fields: [
    { name: 'sender', type: 'relationship', relationTo: 'users', required: true },
    { name: 'receiver', type: 'relationship', relationTo: 'users', required: true },
    { name: 'property', type: 'relationship', relationTo: 'properties' },
    { name: 'messageText', type: 'textarea', required: true },
  ],
  // TODO: delete handle for the messages after property is deleted
}

export default Messages

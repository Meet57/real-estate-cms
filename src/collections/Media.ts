import type { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  admin: { useAsTitle: 'filename' },
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text', required: true }],
}

export default Media

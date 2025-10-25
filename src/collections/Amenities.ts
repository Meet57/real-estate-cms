import type { CollectionConfig } from 'payload'

const Amenities: CollectionConfig = {
  slug: 'amenities',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'icon', type: 'text' }, // emoji or icon name
  ],
}

export default Amenities
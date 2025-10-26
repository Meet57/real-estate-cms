'use client'
import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../utils/api'
import { useRouter } from 'next/navigation'

interface PropertyFormProps {
  property?: any
  onSaved?: () => void
}

export default function PropertyForm({ property, onSaved }: PropertyFormProps) {
  const { user } = useApp()
  const router = useRouter()
  const [title, setTitle] = useState(property?.title || '')
  const [description, setDescription] = useState(property?.description || '')
  const [price, setPrice] = useState(property?.price || 0)
  const [location, setLocation] = useState(property?.location || '')
  const [propertyType, setPropertyType] = useState(property?.propertyType || 'apartment')
  const [bedrooms, setBedrooms] = useState(property?.bedrooms || 0)
  const [bathrooms, setBathrooms] = useState(property?.bathrooms || 0)
  const [size, setSize] = useState(property?.size || 0)
  const [amenities, setAmenities] = useState<any[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities?.map((a: any) => a.id) || [],
  )
  const [loading, setLoading] = useState(false)

  // Load amenities from Payload
  useEffect(() => {
    api.get('/amenities').then((res) => setAmenities(res.data.docs))
  }, [])

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const payload = {
      title,
      description,
      price,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      size,
      amenities: selectedAmenities,
      postedBy: user.id,
    }

    try {
      if (property && property.id) {
        await api.patch(`/properties/${property.id}`, payload)
        alert('Property updated successfully!')
      } else {
        await api.post('/properties', payload)
        alert('Property created successfully!')
      }

      // Optional callback
      if (onSaved) onSaved()

      // Navigate back to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Failed to save property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {property ? 'Edit Property' : 'New Property'}
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Title</label>
          <input
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Property title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Property description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Price and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Price ($)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Location</label>
            <input
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Property Type, Bedrooms, Bathrooms, Size */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Property Type</label>
            <select
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Bedrooms</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Bathrooms</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Size (sqft)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Amenities</label>
          <div className="flex flex-wrap gap-3">
            {amenities.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a.id)}
                  onChange={() => toggleAmenity(a.id)}
                  className="accent-blue-500"
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded font-semibold hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
        </button>
      </form>
    </div>
  )
}

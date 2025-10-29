// app/properties/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import PropertyCard from '../components/PropertyCard'
import type { Property } from '../context/AppContext'

export default function PropertiesPage() {
  const { fetchProperties, amenities, fetchAmenities } = useApp()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const props = await fetchProperties()
        setProperties(props)
        setFilteredProperties(props)
        await fetchAmenities()
      } catch (err) {
        console.error('Failed to fetch properties', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle amenity selection
  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  // Filter logic
  useEffect(() => {
    let filtered = [...properties]

    // Search by title or location
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(
        (p) => p.amenities && selectedAmenities.every((id) => p.amenities.some((a) => a.id === id)),
      )
    }

    setFilteredProperties(filtered)
  }, [searchTerm, selectedAmenities, properties])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading properties...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Properties</h1>

      <input
        type="text"
        placeholder="Search by title or location..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {amenities.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <button
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              className={`px-3 py-1 rounded border transition ${
                selectedAmenities.includes(amenity.id)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {amenity.name}
            </button>
          ))}
        </div>
      )}

      {filteredProperties.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No properties found matching your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              location={p.location}
              image={p.images?.[0]?.url}
              amenities={p.amenities}
            />
          ))}
        </div>
      )}
    </div>
  )
}

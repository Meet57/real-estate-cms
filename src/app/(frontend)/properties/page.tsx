// app/properties/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import PropertyCard from '../components/PropertyCard'
import type { Property } from '../context/AppContext'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchProperties } = useApp()

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true)
      try {
        const res = await fetchProperties()
        setProperties(res)
      } catch (err) {
        console.error('Failed to fetch properties', err)
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

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
      {properties.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">No properties available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
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

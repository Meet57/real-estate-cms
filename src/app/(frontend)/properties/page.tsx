'use client'
import { useEffect, useState } from 'react'
import { useApp, Property } from '../context/AppContext'
import PropertyCard from '../components/PropertyCard'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const { fetchProperties } = useApp()

  useEffect(() => {
    fetchProperties().then((res) => setProperties(res))
  }, [fetchProperties])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Properties</h1>
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
    </div>
  )
}

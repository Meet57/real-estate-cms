// app/dashboard/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useApp } from '../../context/AppContext'
import type { Property } from '../../context/AppContext'
import PropertyForm from '../PropertyForm'

export default function EditPropertyPage() {
  const params = useParams()
  const id = params?.id as string
  const { fetchPropertyById } = useApp()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const loadProperty = async () => {
      setLoading(true)
      try {
        const data = await fetchPropertyById(id)
        setProperty(data)
      } catch (err) {
        console.error('Failed to load property', err)
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [id, fetchPropertyById])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading property...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Property not found</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PropertyForm property={property} onSaved={() => {}} />
    </div>
  )
}

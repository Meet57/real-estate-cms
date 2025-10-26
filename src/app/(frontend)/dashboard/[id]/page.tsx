'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { api } from '../../utils/api'
import PropertyForm from '../PropertyForm'

export default function EditPropertyPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    api.get(`/properties/${id}`).then((res) => setProperty(res.data))
  }, [id])

  if (!property) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PropertyForm property={property} onSaved={() => {}} />
    </div>
  )
}
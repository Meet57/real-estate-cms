'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '../../utils/api'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    api.get(`/properties/${id}`).then((res) => setProperty(res.data))
  }, [id])

  if (!property) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-gray-600 mb-2">${property.price}</p>
      <p className="text-gray-500 mb-4">{property.location}</p>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {property.images?.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={`Image ${idx + 1}`}
            className="w-full h-64 object-cover rounded"
          />
        ))}
      </div>

      {/* Details */}
      <div className="mb-4">
        <p>
          <strong>Type:</strong> {property.propertyType}
        </p>
        {property.bedrooms && (
          <p>
            <strong>Bedrooms:</strong> {property.bedrooms}
          </p>
        )}
        {property.bathrooms && (
          <p>
            <strong>Bathrooms:</strong> {property.bathrooms}
          </p>
        )}
        {property.size && (
          <p>
            <strong>Size:</strong> {property.size} sqft
          </p>
        )}
        {property.amenities && (
          <p>
            <strong>Amenities:</strong> {property.amenities.map((a) => a.name).join(', ')}
          </p>
        )}
      </div>

      {/* Description */}
      <p className="mb-6">{property.description}</p>

      {/* Seller Info */}
      {property.postedBy && (
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Seller Info</h2>
          <p>
            <strong>Name:</strong> {property.postedBy.name}
          </p>
          <p>
            <strong>Email:</strong> {property.postedBy.email}
          </p>
          {property.postedBy.phone && (
            <p>
              <strong>Phone:</strong> {property.postedBy.phone}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

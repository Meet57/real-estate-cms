// app/properties/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import type { Property } from '../../context/AppContext'

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { user, fetchPropertyById } = useApp()
  const [property, setProperty] = useState<Property | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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

  const isOwner = user?.id === property.postedBy?.id
  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          {
            url: 'https://media.istockphoto.com/id/665094738/vector/city-stylized-background.jpg?s=612x612&w=0&k=20&c=0Pzqqho-pqQr8fKZJkOSXhrqxp0YL9jY0TNCRIIOS-Q=',
          },
        ]

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="p-8 my-8 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left section: Images carousel and property details */}
        <div className="md:col-span-2 space-y-4">
          {/* Simple Image Carousel */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <img
              src={images[currentImageIndex].url}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-1 rounded hover:bg-opacity-50"
                  aria-label="Previous image"
                >
                  {'<'}
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-1 rounded hover:bg-opacity-50"
                  aria-label="Next image"
                >
                  {'>'}
                </button>
              </>
            )}
          </div>

          {/* Property Information */}
          <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-2xl text-green-600 font-semibold">
              ${property.price.toLocaleString()}
            </p>
            <p className="text-gray-500">{property.location}</p>

            <div className="mt-4 space-y-2">
              <p>
                <strong>Type:</strong> {property.propertyType || 'N/A'}
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
                  <strong>Size:</strong> {property.size.toLocaleString()} sqft
                </p>
              )}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <strong>Amenities:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {property.amenities.map((a) => (
                      <span
                        key={a.id}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded"
                      >
                        {a.icon && <span>{a.icon}</span>}
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="mt-4 text-gray-700">{property.description}</p>
          </div>
        </div>

        {/* Right section: Seller info and message */}
        {property.postedBy && (
          <div className="space-y-4 p-4 rounded shadow bg-gray-50">
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

            {!isOwner && user && (
              <Link
                href={`/messages/${property.id}/${property.postedBy.id}`}
                className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
              >
                Message Seller
              </Link>
            )}

            {!user && (
              <Link
                href="/login"
                className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
              >
                Login to Contact Seller
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

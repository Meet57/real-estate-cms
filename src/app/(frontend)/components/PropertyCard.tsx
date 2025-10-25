'use client'
import Link from 'next/link'

interface PropertyCardProps {
  id: string
  title: string
  price: number
  location: string
  image?: string
}

export default function PropertyCard({ id, title, price, location, image }: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <div className="border rounded shadow overflow-hidden hover:shadow-lg transition duration-200 cursor-pointer">
        {image && <img src={image} alt={title} className="w-full h-48 object-cover" />}
        <div className="p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-600">${price}</p>
          <p className="text-gray-500">{location}</p>
        </div>
      </div>
    </Link>
  )
}

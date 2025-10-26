'use client'
import Link from 'next/link'

interface Amenity {
  id: string
  name: string
  icon?: React.ReactNode
}

interface ButtonProps {
  label: string
  onClick: () => void
  color?: string
}

interface PropertyCardProps {
  id: string
  title: string
  price: number
  location: string
  image?: string
  amenities?: Amenity[]
  buttons?: ButtonProps[]
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  image,
  amenities = [],
  buttons = [],
}: PropertyCardProps) {
  return (
    <div className="rounded shadow hover:shadow-lg overflow-hidden bg-white transition duration-200">
      <Link href={`/properties/${id}`} className="block cursor-pointer">
        <img
          src={
            image ||
            'https://media.istockphoto.com/id/665094738/vector/city-stylized-background.jpg?s=612x612&w=0&k=20&c=0Pzqqho-pqQr8fKZJkOSXhrqxp0YL9jY0TNCRIIOS-Q='
          }
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-1">{title}</h2>
          <p className="text-gray-600 mb-1">${price}</p>
          <p className="text-gray-500 mb-2">{location}</p>

          {/* Amenities badges */}
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <span
                key={a.id}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
              >
                {a.icon && <span>{a.icon}</span>}
                {a.name}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Optional buttons below */}
      {buttons.length > 0 && (
        <div className="p-4 border-t flex gap-2 flex-wrap">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={`px-4 py-2 rounded font-semibold text-white ${
                btn.color || 'bg-blue-500'
              } hover:opacity-90 transition`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

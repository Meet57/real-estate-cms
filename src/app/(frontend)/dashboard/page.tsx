'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '../context/AppContext'
import PropertyCard from '../components/PropertyCard'

export default function DashboardPage() {
  const { user, myProperties, fetchMyProperties, deleteProperty } = useApp()

  useEffect(() => {
    if (user) fetchMyProperties()
  }, [user])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this property?')
    if (!confirmed) return
    await deleteProperty(id)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
        <Link
          href="/dashboard/new"
          className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
        >
          List New Property
        </Link>
      </div>

      {/* Properties Grid */}
      {myProperties.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">You haven’t listed any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties.map((p) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              location={p.location}
              image={p.images?.[0]?.url}
              amenities={p.amenities}
              buttons={[
                {
                  label: 'Edit',
                  onClick: () => (window.location.href = `/dashboard/${p.id}`),
                  color: 'bg-blue-500',
                },
                {
                  label: 'Delete',
                  onClick: () => handleDelete(p.id),
                  color: 'bg-red-500',
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  )
}

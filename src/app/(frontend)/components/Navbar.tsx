'use client'
import Link from 'next/link'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { user, logout } = useApp()

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        Real Estate CMS
      </Link>

      <div className="space-x-4 flex items-center">
        <Link href="/properties" className="hover:text-gray-300">
          Properties
        </Link>

        {user ? (
          <>
            {user.role === 'seller' && (
              <Link href="/messages" className="hover:text-gray-300">
                Messages
              </Link>
            )}
            <span className="text-sm text-gray-300">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm">
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  )
}

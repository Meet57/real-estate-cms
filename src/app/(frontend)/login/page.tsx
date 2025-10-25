'use client'
import { useApp } from '../context/AppContext'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const { login, loading } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={loading} className="bg-blue-500 text-white p-2 rounded">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}

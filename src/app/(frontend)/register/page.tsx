'use client'
import { useApp } from '../context/AppContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const { register, loading } = useApp()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register({ name, email, password, phone, role })
    router.push('/login')
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          pattern="[0-9]{10}"
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value as 'buyer' | 'seller')}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button disabled={loading} className="bg-green-500 text-white p-2 rounded">
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

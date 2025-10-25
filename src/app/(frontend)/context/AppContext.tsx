'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api, setToken } from '../utils/api'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller' | 'admin'
}

interface Property {
  id: string
  title: string
  price: number
  location: string
  description: string
}

interface AppContextProps {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  fetchProperties: () => Promise<Property[]>
  createProperty: (data: any) => Promise<void>
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setAuthToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Load user from localStorage (for persistence)
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setAuthToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // 🔐 Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await api.post('/users/login', { email, password })
      const { token, user } = res.data
      setToken(token)
      setAuthToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/properties')
    } catch (err) {
      alert('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // 🧍 Register new user
  const register = async (data: any) => {
    setLoading(true)
    try {
      await api.post('/users', data)
      alert('Registration successful! You can now log in.')
      router.push('/login')
    } catch (err) {
      alert('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // 🏠 Fetch all properties
  const fetchProperties = async (): Promise<Property[]> => {
    const res = await api.get('/properties')
    return res.data.docs
  }

  // 🏗️ Create new property (for sellers)
  const createProperty = async (data: any) => {
    try {
      await api.post('/properties', data)
      alert('Property uploaded successfully!')
    } catch (err) {
      alert('Failed to upload property')
    }
  }

  // 🚪 Logout
  const logout = () => {
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <AppContext.Provider
      value={{ user, token, loading, login, register, logout, fetchProperties, createProperty }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}

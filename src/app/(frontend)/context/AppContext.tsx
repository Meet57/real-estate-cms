'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api, setToken } from '../utils/api'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller' | 'admin'
}

export interface Amenity {
  id: string
  name: string
  icon?: string // optional, since not required in Payload
}

export interface Property {
  id: string
  title: string
  price: number
  location: string
  description: string
  postedBy?: { id: string }
  amenities: Amenity[] // references the Amenity type
}

interface AppContextProps {
  user: User | null
  token: string | null
  loading: boolean
  myProperties: Property[]
  messages: Message[]
  amenities: Amenity[]
  myPropertyMessages: Record<string, { property: Message['property']; chats: Message[] }>
  myChats: Record<string, { property: Message['property']; chats: Message[] }>
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  fetchPropertyById: (id: string) => Promise<Property | null>
  fetchProperties: () => Promise<Property[]>
  fetchMyProperties: () => Promise<void>
  createProperty: (data: any) => Promise<void>
  updateProperty: (id: string, data: any) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
  fetchMessages: () => Promise<void>
  fetchAmenities: () => Promise<Amenity[]>
}

// --- add below other imports ---
interface Message {
  id: string
  messageText: string
  sender: { id: string; name: string }
  receiver: { id: string; name: string }
  property: { id: string; title: string; postedBy?: { id: string; name: string } }
  createdAt: string
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setAuthToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [myPropertyMessages, setMyPropertyMessages] = useState<any>({})
  const [myChats, setMyChats] = useState<any>({})
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [myProperties, setMyProperties] = useState<Property[]>([])
  const router = useRouter()

  // Load user from localStorage (persist login)
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setAuthToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (user) fetchMessages()
  }, [user])

  // 🔐 Login
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
      await fetchMyProperties() // load user properties
      router.push('/properties')
    } catch {
      alert('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // 🧍 Register
  const register = async (data: any) => {
    setLoading(true)
    try {
      await api.post('/users', data)
      alert('Registration successful! You can now log in.')
      router.push('/login')
    } catch {
      alert('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!user) return

    try {
      const res = await api.get('/messages')
      const all: Message[] = res.data.docs
      setMessages(all)

      // 1️⃣ Group messages about my properties
      const byMyProperty: Record<string, { property: Message['property']; chats: Message[] }> = {}
      all.forEach((msg) => {
        if (msg.property?.postedBy?.id === user.id) {
          const propId = msg.property.id
          if (!byMyProperty[propId]) {
            byMyProperty[propId] = { property: msg.property, chats: [] }
          }
          byMyProperty[propId].chats.push(msg)
        }
      })
      setMyPropertyMessages(byMyProperty)

      // 2️⃣ Group messages where I’m the buyer
      const byMyChats: Record<string, { property: Message['property']; chats: Message[] }> = {}
      all.forEach((msg) => {
        const involved = msg.sender.id === user.id || msg.receiver.id === user.id
        const notMine = msg.property?.postedBy?.id !== user.id
        if (involved && notMine) {
          const propId = msg.property.id
          if (!byMyChats[propId]) {
            byMyChats[propId] = { property: msg.property, chats: [] }
          }
          byMyChats[propId].chats.push(msg)
        }
      })
      setMyChats(byMyChats)
    } catch (err) {
      console.error('Failed to fetch messages', err)
    }
  }

  // 🏠 Fetch all properties
  const fetchProperties = async (): Promise<Property[]> => {
    const res = await api.get('/properties')
    return res.data.docs
  }

  // 🏠 Fetch single property by ID
  const fetchPropertyById = async (id: string): Promise<Property | null> => {
    try {
      const res = await api.get(`/properties/${id}`)
      return res.data
    } catch (err) {
      console.error(`Failed to fetch property with id ${id}`, err)
      return null
    }
  }

  // 🏠 Fetch only user's properties
  const fetchMyProperties = async () => {
    if (!user) return
    try {
      const res = await api.get('/properties')
      const myProps = res.data.docs.filter((p: Property) => p.postedBy?.id === user.id)
      setMyProperties(myProps)
    } catch (err) {
      console.error('Failed to fetch user properties', err)
    }
  }

  // 🏗️ Create property
  const createProperty = async (data: any) => {
    try {
      await api.post('/properties', data)
      alert('Property uploaded successfully!')
      await fetchMyProperties()
    } catch {
      alert('Failed to upload property')
    }
  }

  // ✏️ Update property
  const updateProperty = async (id: string, data: any) => {
    try {
      await api.put(`/properties/${id}`, data)
      alert('Property updated successfully!')
      await fetchMyProperties()
    } catch {
      alert('Failed to update property')
    }
  }

  // ❌ Delete property
  const deleteProperty = async (id: string) => {
    try {
      await api.delete(`/properties/${id}`)
      setMyProperties((prev) => prev.filter((p) => p.id !== id))
      alert('Property deleted successfully!')
    } catch {
      alert('Failed to delete property')
    }
  }

  // ⚙️ Fetch amenities
  const fetchAmenities = async (): Promise<Amenity[]> => {
    try {
      if (amenities.length == 0) {
        const res = await api.get('/amenities')
        setAmenities(() => res.data.docs)
        return amenities
      } else {
        return amenities
      }
    } catch (err) {
      console.error('Failed to fetch amenities', err)
      return []
    }
  }

  // Auto-fetch user’s properties when user logs in
  useEffect(() => {
    if (user) fetchMyProperties()
  }, [user])

  // 🚪 Logout
  const logout = () => {
    setUser(null)
    setAuthToken(null)
    setMyProperties([])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loading,
        myProperties,
        login,
        register,
        logout,
        fetchProperties,
        amenities,
        fetchAmenities,
        fetchPropertyById,
        fetchMyProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        messages,
        myPropertyMessages,
        myChats,
        fetchMessages,
      }}
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

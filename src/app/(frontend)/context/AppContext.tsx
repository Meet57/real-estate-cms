'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, setToken } from '../utils/api'
import { useRouter } from 'next/navigation'

// Types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'buyer' | 'seller' | 'admin'
}

export interface Amenity {
  id: string
  name: string
  icon?: string
}

export interface PropertyImage {
  url: string
  alt?: string
}

export interface Property {
  id: string
  title: string
  price: number
  location: string
  description: string
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
  size?: number
  images?: PropertyImage[]
  postedBy?: { id: string; name: string; email: string; phone?: string }
  amenities: Amenity[]
}

export interface Message {
  id: string
  messageText: string
  sender: { id: string; name: string }
  receiver: { id: string; name: string }
  property: { id: string; title: string; postedBy?: { id: string; name: string } }
  createdAt: string
}

interface GroupedMessages {
  property: Message['property']
  chats: Message[]
}

interface AppContextProps {
  user: User | null
  token: string | null
  loading: boolean
  myProperties: Property[]
  messages: Message[]
  amenities: Amenity[]
  myPropertyMessages: Record<string, GroupedMessages>
  myChats: Record<string, GroupedMessages>
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
  uploadMedia: (
    files: File | File[],
    metadata?: Record<string, any>,
    onProgress?: (percent: number) => void,
  ) => Promise<string[]>
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setAuthToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [myPropertyMessages, setMyPropertyMessages] = useState<Record<string, GroupedMessages>>({})
  const [myChats, setMyChats] = useState<Record<string, GroupedMessages>>({})
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [myProperties, setMyProperties] = useState<Property[]>([])
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setAuthToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Fetch messages when user logs in
  useEffect(() => {
    if (user) {
      fetchMessages()
      fetchMyProperties()
    }
  }, [user?.id])

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await api.post('/users/login', { email, password })
      const { token: newToken, user: newUser } = res.data
      setToken(newToken)
      setAuthToken(newToken)
      setUser(newUser)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      router.push('/properties')
    } catch {
      alert('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // Register
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

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!user) return

    try {
      const res = await api.get('/messages')
      const all: Message[] = res.data.docs
      setMessages(all)

      // Group messages about my properties
      const byMyProperty: Record<string, GroupedMessages> = {}
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

      // Group messages where I'm the buyer
      const byMyChats: Record<string, GroupedMessages> = {}
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
  }, [user?.id])

  // Fetch all properties
  const fetchProperties = async (): Promise<Property[]> => {
    const res = await api.get('/properties')
    return res.data.docs
  }

  // Fetch single property by ID
  const fetchPropertyById = async (id: string): Promise<Property | null> => {
    try {
      const res = await api.get(`/properties/${id}`)
      return res.data
    } catch (err) {
      console.error(`Failed to fetch property with id ${id}`, err)
      return null
    }
  }

  // Fetch user's properties
  const fetchMyProperties = useCallback(async () => {
    if (!user) return
    try {
      const res = await api.get('/properties')
      const myProps = res.data.docs.filter((p: Property) => p.postedBy?.id === user.id)
      setMyProperties(myProps)
    } catch (err) {
      console.error('Failed to fetch user properties', err)
    }
  }, [user?.id])

  // Create property
  const createProperty = async (data: any) => {
    try {
      await api.post('/properties', data)
      alert('Property uploaded successfully!')
      await fetchMyProperties()
    } catch {
      alert('Failed to upload property')
    }
  }

  // Update property
  const updateProperty = async (id: string, data: any) => {
    try {
      await api.patch(`/properties/${id}`, data)
      alert('Property updated successfully!')
      await fetchMyProperties()
    } catch {
      alert('Failed to update property')
    }
  }

  // Delete property
  const deleteProperty = async (id: string) => {
    try {
      await api.delete(`/properties/${id}`)
      setMyProperties((prev) => prev.filter((p) => p.id !== id))
      alert('Property deleted successfully!')
    } catch {
      alert('Failed to delete property')
    }
  }

  // Fetch amenities
  const fetchAmenities = useCallback(async (): Promise<Amenity[]> => {
    try {
      if (amenities.length === 0) {
        const res = await api.get('/amenities')
        const fetchedAmenities = res.data.docs
        setAmenities(fetchedAmenities)
        return fetchedAmenities
      }
      return amenities
    } catch (err) {
      console.error('Failed to fetch amenities', err)
      return []
    }
  }, [amenities.length])

  const uploadMedia = async (
    files: File | File[],
    metadata: Record<string, any> = {},
    onProgress?: (percent: number) => void,
  ): Promise<string[]> => {
    try {
      const fileArray = Array.isArray(files) ? files : [files]
      const uploadedIds: string[] = []

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        const formData = new FormData()

        formData.append('file', file)
        // Set alt to filename if not provided in metadata
        const payload = { ...metadata, alt: metadata.alt || file.name }
        formData.append('_payload', JSON.stringify(payload))

        const res = await api.post('/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            if (event.total && onProgress) {
              const percentCompleted = Math.round((event.loaded * 100) / event.total)
              const overall = Math.round(((i + percentCompleted / 100) / fileArray.length) * 100)
              onProgress(overall)
            }
          },
        })

        uploadedIds.push(res.data.doc.id)
      }

      return uploadedIds
    } catch (err) {
      console.error('Failed to upload media', err)
      return []
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    setAuthToken(null)
    setMyProperties([])
    setMessages([])
    setMyPropertyMessages({})
    setMyChats({})
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
        uploadMedia,
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

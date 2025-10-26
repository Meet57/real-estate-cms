// app/messages/page.tsx
'use client'

import Link from 'next/link'
import { useApp } from '../context/AppContext'
import { useEffect } from 'react'
import type { Message } from '../context/AppContext'

export default function MessagesPage() {
  const { user, myPropertyMessages, myChats, fetchMessages } = useApp()

  useEffect(() => {
    if (user) {
      fetchMessages()
    }
  }, [user, fetchMessages])

  // Helper to safely get the latest chat in a group
  const getLastChat = (chats: Message[]): Message | null => {
    if (!chats || chats.length === 0) return null
    // Sort by date descending and get the most recent
    const sorted = [...chats].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return sorted[0]
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Please log in to view messages.</p>
        <Link href="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      {/* Inquiries about my properties */}
      {Object.keys(myPropertyMessages).length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Inquiries About My Properties
          </h2>
          {Object.values(myPropertyMessages).map((group) => {
            const lastChat = getLastChat(group.chats)
            if (!lastChat) return null
            const otherUser = lastChat.sender.id === user.id ? lastChat.receiver : lastChat.sender

            return (
              <div key={group.property.id} className="mb-6 border rounded shadow p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">{group.property.title}</h3>
                <Link
                  href={`/messages/${group.property.id}/${otherUser.id}`}
                  className="block border rounded p-3 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{otherUser.name}</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(lastChat.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate mt-1">{lastChat.messageText}</p>
                </Link>
              </div>
            )
          })}
        </section>
      )}

      {/* My chats with other sellers */}
      {Object.keys(myChats).length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            My Conversations With Sellers
          </h2>
          {Object.values(myChats).map((group) => {
            const lastChat = getLastChat(group.chats)
            if (!lastChat) return null
            const otherUser = lastChat.sender.id === user.id ? lastChat.receiver : lastChat.sender

            return (
              <div key={group.property.id} className="mb-6 border rounded shadow p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">{group.property.title}</h3>
                <Link
                  href={`/messages/${group.property.id}/${otherUser.id}`}
                  className="block border rounded p-3 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{otherUser.name}</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(lastChat.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate mt-1">{lastChat.messageText}</p>
                </Link>
              </div>
            )
          })}
        </section>
      )}

      {Object.keys(myPropertyMessages).length === 0 && Object.keys(myChats).length === 0 && (
        <p className="text-gray-600 text-center mt-10">
          No messages yet. Start chatting with property owners!
        </p>
      )}
    </div>
  )
}

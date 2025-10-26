// app/messages/[propertyId]/[userId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useApp } from '../../../context/AppContext'
import { api } from '../../../utils/api'

interface ChatMessage {
  id: string
  messageText: string
  sender: { id: string; name: string }
  receiver: { id: string; name: string }
  property: { id: string; title: string }
  createdAt: string
}

export default function ChatPage() {
  const params = useParams()
  const propertyId = params?.propertyId as string
  const userId = params?.userId as string

  const { user } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch messages for this conversation
  useEffect(() => {
    if (!user || !propertyId || !userId) return

    const fetchChatMessages = async () => {
      try {
        const res = await api.get('/messages')
        const filtered = res.data.docs.filter(
          (m: ChatMessage) =>
            m.property.id === propertyId &&
            ((m.sender.id === user.id && m.receiver.id === userId) ||
              (m.sender.id === userId && m.receiver.id === user.id)),
        )
        setMessages(filtered)
      } catch (err) {
        console.error('Failed to fetch messages', err)
      }
    }

    fetchChatMessages()
  }, [user, propertyId, userId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !user) return

    setLoading(true)
    try {
      await api.post('/messages', {
        messageText: text,
        sender: user.id,
        receiver: userId,
        property: propertyId,
      })
      setText('')

      // Refresh messages
      const res = await api.get('/messages')
      const filtered = res.data.docs.filter(
        (m: ChatMessage) =>
          m.property.id === propertyId &&
          ((m.sender.id === user.id && m.receiver.id === userId) ||
            (m.sender.id === userId && m.receiver.id === user.id)),
      )
      setMessages(filtered)
    } catch (err) {
      console.error('Failed to send message', err)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      {/* Messages Container */}
      <div className="border rounded p-4 mb-4 h-[400px] overflow-y-auto flex flex-col-reverse gap-2 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded max-w-[70%] ${
                m.sender.id === user?.id
                  ? 'bg-blue-500 text-white self-end ml-auto'
                  : 'bg-white border self-start'
              }`}
            >
              <p className="break-words">{m.messageText}</p>
              <span
                className={`text-xs ${m.sender.id === user?.id ? 'text-blue-100' : 'text-gray-400'}`}
              >
                {new Date(m.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 rounded hover:bg-blue-600 transition disabled:opacity-50"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

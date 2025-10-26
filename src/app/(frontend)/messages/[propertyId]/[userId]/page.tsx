'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useApp } from '../../../context/AppContext'
import { api } from '../../../utils/api'

interface Message {
  id: string
  messageText: string
  sender: { id: string; name: string }
  receiver: { id: string; name: string }
  createdAt: string
}

export default function ChatPage() {
  const { propertyId, userId } = useParams()
  const { user } = useApp()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (!user) return
    api.get('/messages').then((res) => {
      // Filter messages for this property between these two users
      const filtered = res.data.docs.filter(
        (m: Message) =>
          m.property.id === propertyId &&
          ((m.sender.id === user.id && m.receiver.id === userId) ||
            (m.sender.id === userId && m.receiver.id === user.id)),
      )
      setMessages(filtered)
    })
  }, [user, propertyId, userId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return

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
        (m: Message) =>
          m.property.id === propertyId &&
          ((m.sender.id === user.id && m.receiver.id === userId) ||
            (m.sender.id === userId && m.receiver.id === user.id)),
      )
      setMessages(filtered)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="border rounded p-4 mb-4 h-[400px] overflow-y-auto flex flex-col-reverse gap-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded ${m.sender.id === user?.id ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}
          >
            <p>{m.messageText}</p>
            <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </form>
    </div>
  )
}

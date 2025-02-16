'use client'

import { useState } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you analyze the suspicious login attempts from IP 192.168.1.100?',
    timestamp: '2024-02-16T10:00:00Z',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Based on the logs, this IP has attempted to login 50 times in the last hour with different usernames. This pattern suggests a brute force attack. I recommend:\n\n1. Block this IP immediately\n2. Check if any login attempts were successful\n3. Review authentication logs for other suspicious IPs',
    timestamp: '2024-02-16T10:00:05Z',
  },
]

const ChatMessage = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-blue-50 dark:bg-blue-900'
            : 'bg-gray-50 dark:bg-gray-700'
        }`}
      >
        <div className="flex flex-col gap-2">
          <p className="whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 self-end">
            {new Date(message.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
          You
        </div>
      )}
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    setInput('')

    // モックのアシスタント応答
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: 'I am analyzing your request. This is a mock response for now.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="flex flex-col h-[calc(100vh-4rem)] gap-6">
        <div className="flex-1 w-full overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
} 
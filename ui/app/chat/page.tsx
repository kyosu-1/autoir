'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  suggested_actions?: Array<{
    type: 'playbook' | 'link' | 'command'
    title: string
    description: string
    action: string
  }>
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
    content: 'Based on the logs, this IP has attempted to login 50 times in the last hour with different usernames. This pattern suggests a brute force attack. I recommend taking immediate action to block this IP and investigate any successful logins.',
    timestamp: '2024-02-16T10:00:05Z',
    suggested_actions: [
      {
        type: 'playbook',
        title: 'Block Malicious IP',
        description: 'Execute playbook to block IP 192.168.1.100 across all firewalls',
        action: 'execute_playbook:1?ip_address=192.168.1.100&reason=brute_force_attempt',
      },
      {
        type: 'command',
        title: 'Check Successful Logins',
        description: 'Search for successful logins from this IP',
        action: 'search_logs:authentication success AND source.ip:192.168.1.100',
      },
      {
        type: 'link',
        title: 'View Similar Incidents',
        description: 'View past incidents involving brute force attempts',
        action: '/incidents?type=brute_force',
      },
    ],
  },
]

const ActionButton = ({ action }: { action: NonNullable<ChatMessage['suggested_actions']>[number] }) => {
  const handleClick = () => {
    // TODO: 各アクションタイプに応じた処理
    console.log('Execute action:', action)
  }

  const iconClass = {
    playbook: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    link: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
    command: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  }[action.type]

  return (
    <button
      onClick={handleClick}
      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
    >
      <div className="mt-1">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconClass} />
        </svg>
      </div>
      <div className="flex-1">
        <div className="font-medium">{action.title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {action.description}
        </div>
      </div>
    </button>
  )
}

const ChatMessage = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
          AI
        </div>
      )}
      <div className="max-w-[80%] space-y-4">
        <div
          className={`rounded-lg p-4 ${
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
        {message.suggested_actions && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Suggested Actions
            </h3>
            <div className="space-y-2">
              {message.suggested_actions.map((action, index) => (
                <ActionButton key={index} action={action} />
              ))}
            </div>
          </div>
        )}
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
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [input, setInput] = useState('')

  const handleAnalyze = () => {
    router.push('/chat/analysis')
  }

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
        content: 'I am analyzing your request. Here are my findings and recommendations.',
        timestamp: new Date().toISOString(),
        suggested_actions: [
          {
            type: 'playbook',
            title: 'Run Security Scan',
            description: 'Execute a comprehensive security scan on the affected systems',
            action: 'execute_playbook:3?target=affected_systems',
          },
          {
            type: 'link',
            title: 'View Documentation',
            description: 'Read our security response playbook',
            action: '/docs/security-response',
          },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="flex flex-col h-[calc(100vh-4rem)] gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">LLMアシスタント</h1>
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            詳細分析を表示
          </button>
        </div>
        <div className="flex-1 w-full overflow-y-auto space-y-6 pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="インシデントについて質問してください..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  )
} 
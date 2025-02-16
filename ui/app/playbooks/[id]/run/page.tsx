'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PlaybookExecution {
  id: string
  playbook_id: string
  status: 'preparing' | 'awaiting_approval' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  current_step?: {
    id: string
    name: string
    type: 'approval' | 'action' | 'notification'
    status: 'pending' | 'running' | 'completed' | 'failed'
    approvers?: string[]
    approved_by?: string[]
  }
  steps: Array<{
    id: string
    name: string
    type: 'approval' | 'action' | 'notification'
    status: 'pending' | 'running' | 'completed' | 'failed'
    started_at?: string
    completed_at?: string
    result?: {
      success: boolean
      message: string
      details?: Record<string, string>
    }
  }>
  parameters: Record<string, string>
  started_at: string
  logs: Array<{
    timestamp: string
    level: 'info' | 'warning' | 'error'
    message: string
  }>
}

const mockExecution: PlaybookExecution = {
  id: '1',
  playbook_id: '1',
  status: 'awaiting_approval',
  progress: 33,
  current_step: {
    id: 'step1',
    name: 'Get approval for IP block',
    type: 'approval',
    status: 'running',
    approvers: ['admin'],
    approved_by: [],
  },
  steps: [
    {
      id: 'step1',
      name: 'Get approval for IP block',
      type: 'approval',
      status: 'running',
      started_at: '2024-02-16T10:00:00Z',
    },
    {
      id: 'step2',
      name: 'Block IP on Firewall',
      type: 'action',
      status: 'pending',
    },
    {
      id: 'step3',
      name: 'Send Slack notification',
      type: 'notification',
      status: 'pending',
    },
  ],
  parameters: {
    ip_address: '192.168.1.100',
    reason: 'Suspicious brute force attempts',
  },
  started_at: '2024-02-16T10:00:00Z',
  logs: [
    {
      timestamp: '2024-02-16T10:00:00Z',
      level: 'info',
      message: 'Playbook execution started',
    },
    {
      timestamp: '2024-02-16T10:00:01Z',
      level: 'info',
      message: 'Waiting for approval from admin',
    },
  ],
}

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = {
    preparing: 'bg-gray-100 text-gray-800',
    awaiting_approval: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    pending: 'bg-gray-100 text-gray-800',
  }[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status.toUpperCase()}
    </span>
  )
}

const LogEntry = ({ entry }: { entry: PlaybookExecution['logs'][number] }) => {
  const colorClass = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  }[entry.level]

  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-gray-500 shrink-0">
        {new Date(entry.timestamp).toLocaleTimeString()}
      </span>
      <span className={colorClass}>{entry.message}</span>
    </div>
  )
}

export default function PlaybookRun() {
  const [execution, setExecution] = useState(mockExecution)

  const handleApprove = () => {
    // TODO: API呼び出し
    setExecution({
      ...execution,
      status: 'running',
      current_step: {
        ...execution.current_step!,
        approved_by: ['admin'],
        status: 'completed',
      },
      logs: [
        ...execution.logs,
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Approved by admin',
        },
      ],
    })
  }

  const handleCancel = () => {
    if (!confirm('実行をキャンセルしてもよろしいですか？')) return

    // TODO: API呼び出し
    setExecution({
      ...execution,
      status: 'cancelled',
      logs: [
        ...execution.logs,
        {
          timestamp: new Date().toISOString(),
          level: 'warning',
          message: 'Execution cancelled by user',
        },
      ],
    })
  }

  // 実行状況の定期更新
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: API呼び出しで最新状態を取得
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">実行モニタリング</h1>
          <div className="flex gap-2">
            {execution.status === 'awaiting_approval' && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                承認
              </button>
            )}
            {['preparing', 'awaiting_approval', 'running'].includes(execution.status) && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                キャンセル
              </button>
            )}
            <Link
              href={`/playbooks/${execution.playbook_id}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Playbookに戻る
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">実行状況</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">ステータス</div>
                  <StatusBadge status={execution.status} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">進捗</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${execution.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {execution.progress}%
                  </div>
                </div>
                {execution.current_step && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">現在のステップ</div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-medium">{execution.current_step.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Type: {execution.current_step.type}
                      </div>
                      {execution.current_step.type === 'approval' && (
                        <div className="mt-2 text-sm">
                          <div>承認者: {execution.current_step.approvers?.join(', ')}</div>
                          {execution.current_step.approved_by && execution.current_step.approved_by.length > 0 && (
                            <div>
                              承認済み: {execution.current_step.approved_by.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">実行パラメータ</h2>
              <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm font-mono">
                {JSON.stringify(execution.parameters, null, 2)}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">実行ログ</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {execution.logs.map((log, index) => (
                  <LogEntry key={index} entry={log} />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">ステップ一覧</h2>
              <div className="space-y-4">
                {execution.steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{step.name}</div>
                      <div className="text-sm text-gray-500">Type: {step.type}</div>
                    </div>
                    <StatusBadge status={step.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
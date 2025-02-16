'use client'

import { useState } from 'react'
import Link from 'next/link'

interface PlaybookRun {
  id: string
  playbook_id: string
  status: 'running' | 'completed' | 'failed'
  started_at: string
  completed_at?: string
  parameters: Record<string, string>
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
  triggered_by: string
}

const mockRuns: PlaybookRun[] = [
  {
    id: '1',
    playbook_id: '1',
    status: 'completed',
    started_at: '2024-02-16T10:00:00Z',
    completed_at: '2024-02-16T10:05:00Z',
    parameters: {
      ip_address: '192.168.1.100',
      reason: 'Suspicious brute force attempts',
    },
    steps: [
      {
        id: 'step1',
        name: 'Get approval for IP block',
        type: 'approval',
        status: 'completed',
        started_at: '2024-02-16T10:00:00Z',
        completed_at: '2024-02-16T10:02:00Z',
        result: {
          success: true,
          message: 'Approved by admin',
        },
      },
      {
        id: 'step2',
        name: 'Block IP on Firewall',
        type: 'action',
        status: 'completed',
        started_at: '2024-02-16T10:02:00Z',
        completed_at: '2024-02-16T10:03:00Z',
        result: {
          success: true,
          message: 'IP blocked successfully',
          details: {
            firewall_rule_id: 'rule123',
          },
        },
      },
      {
        id: 'step3',
        name: 'Send Slack notification',
        type: 'notification',
        status: 'completed',
        started_at: '2024-02-16T10:03:00Z',
        completed_at: '2024-02-16T10:03:01Z',
        result: {
          success: true,
          message: 'Notification sent to #security-alerts',
        },
      },
    ],
    triggered_by: 'john.doe',
  },
]

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = {
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
  }[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status.toUpperCase()}
    </span>
  )
}

const StepIcon = ({ type }: { type: string }) => {
  const iconPath = {
    approval: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    action: 'M13 10V3L4 14h7v7l9-11h-7z',
    notification: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  }[type]

  return (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
    </svg>
  )
}

export default function PlaybookHistory() {
  const [selectedRun, setSelectedRun] = useState<PlaybookRun | null>(mockRuns[0])

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">実行履歴</h1>
          <Link
            href="/playbooks/1"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Playbookに戻る
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">実行一覧</h2>
              <div className="space-y-2">
                {mockRuns.map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setSelectedRun(run)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedRun?.id === run.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">実行 #{run.id}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(run.started_at).toLocaleString()}
                        </div>
                      </div>
                      <StatusBadge status={run.status} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedRun && (
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">実行詳細</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">開始時刻</div>
                      <div>{new Date(selectedRun.started_at).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">完了時刻</div>
                      <div>
                        {selectedRun.completed_at
                          ? new Date(selectedRun.completed_at).toLocaleString()
                          : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">実行者</div>
                      <div>{selectedRun.triggered_by}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">ステータス</div>
                      <div>
                        <StatusBadge status={selectedRun.status} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">実行パラメータ</h3>
                    <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm font-mono">
                      {JSON.stringify(selectedRun.parameters, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">ステップ実行状況</h2>
                <div className="space-y-4">
                  {selectedRun.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <StepIcon type={step.type} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{step.name}</h3>
                            <p className="text-sm text-gray-500">
                              {step.started_at &&
                                `開始: ${new Date(step.started_at).toLocaleString()}`}
                              {step.completed_at &&
                                ` / 完了: ${new Date(step.completed_at).toLocaleString()}`}
                            </p>
                          </div>
                          <StatusBadge status={step.status} />
                        </div>
                        {step.result && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm">{step.result.message}</p>
                            {step.result.details && (
                              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-sm font-mono">
                                {JSON.stringify(step.result.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

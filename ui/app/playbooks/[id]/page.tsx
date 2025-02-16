'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Playbook {
  id: string
  name: string
  description: string
  definition: {
    steps: Array<{
      id: string
      type: 'approval' | 'action' | 'notification'
      name: string
      config: {
        approvers?: string[]
        action?: string
        parameters?: Record<string, string>
        channel?: string
        message?: string
      }
    }>
  }
  created_by: string
  created_at: string
  last_run?: {
    timestamp: string
    status: 'success' | 'failure'
  }
}

const mockPlaybooks: Record<string, Playbook> = {
  '1': {
    id: '1',
    name: 'Block Malicious IP',
    description: 'Blocks an IP address across all firewalls and sends notification',
    definition: {
      steps: [
        {
          id: 'step1',
          type: 'approval',
          name: 'Get approval for IP block',
          config: {
            approvers: ['admin'],
          },
        },
        {
          id: 'step2',
          type: 'action',
          name: 'Block IP on Firewall',
          config: {
            action: 'firewall.block_ip',
            parameters: {
              ip: '${ip_address}',
              reason: '${reason}',
            },
          },
        },
        {
          id: 'step3',
          type: 'notification',
          name: 'Send Slack notification',
          config: {
            channel: '#security-alerts',
            message: 'IP ${ip_address} has been blocked. Reason: ${reason}',
          },
        },
      ],
    },
    created_by: 'John Doe',
    created_at: '2024-02-16T10:00:00Z',
    last_run: {
      timestamp: '2024-02-16T11:00:00Z',
      status: 'success',
    },
  },
  '2': {
    id: '2',
    name: 'Isolate Compromised Host',
    description: 'Isolates a potentially compromised host and initiates investigation',
    definition: {
      steps: [
        {
          id: 'step1',
          type: 'approval',
          name: 'Get approval for host isolation',
          config: {
            approvers: ['admin', 'security-lead'],
          },
        },
        {
          id: 'step2',
          type: 'action',
          name: 'Isolate host in EDR',
          config: {
            action: 'edr.isolate_host',
            parameters: {
              host_id: '${host_id}',
              isolation_level: '${isolation_level}',
            },
          },
        },
        {
          id: 'step3',
          type: 'action',
          name: 'Collect host forensics',
          config: {
            action: 'edr.collect_forensics',
            parameters: {
              host_id: '${host_id}',
              collection_type: 'full',
            },
          },
        },
        {
          id: 'step4',
          type: 'notification',
          name: 'Notify security team',
          config: {
            channel: '#security-incidents',
            message: 'Host ${host_id} has been isolated for investigation. Forensics collection initiated.',
          },
        },
      ],
    },
    created_by: 'Jane Smith',
    created_at: '2024-02-16T09:00:00Z',
    last_run: {
      timestamp: '2024-02-16T15:30:00Z',
      status: 'success',
    },
  },
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

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = {
    success: 'bg-green-100 text-green-800',
    failure: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status.toUpperCase()}
    </span>
  )
}

export default function PlaybookDetail() {
  const params = useParams()
  const router = useRouter()
  const playbookId = params.id as string
  const [playbook] = useState(mockPlaybooks[playbookId])
  const [isExecuting, setIsExecuting] = useState(false)
  const [parameters, setParameters] = useState<Record<string, string>>({})

  if (!playbook) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Playbook not found</h1>
        </div>
      </div>
    )
  }

  const handleExecute = () => {
    setIsExecuting(true)
    // TODO: API呼び出し
    console.log('Execute playbook with parameters:', parameters)
    router.push(`/playbooks/${playbook.id}/run`)
  }

  // パラメータフォームの内容を動的に生成
  const renderParameterInputs = () => {
    const allParameters = new Set<string>()
    playbook.definition.steps.forEach(step => {
      if (step.config.parameters) {
        Object.keys(step.config.parameters).forEach(param => {
          allParameters.add(param)
        })
      }
    })

    return Array.from(allParameters).map(param => {
      if (param === 'isolation_level') {
        return (
          <div key={param}>
            <label className="block text-sm font-medium mb-2">Isolation Level</label>
            <select
              value={parameters[param] || ''}
              onChange={(e) => setParameters({ ...parameters, [param]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              <option value="full">Full Isolation</option>
              <option value="network">Network Isolation</option>
              <option value="process">Process Isolation</option>
            </select>
          </div>
        )
      }

      return (
        <div key={param}>
          <label className="block text-sm font-medium mb-2">
            {param.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </label>
          <input
            type="text"
            value={parameters[param] || ''}
            onChange={(e) => setParameters({ ...parameters, [param]: e.target.value })}
            placeholder={`例: ${param === 'ip_address' ? '192.168.1.100' : param === 'host_id' ? 'DESKTOP-ABC123' : ''}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )
    })
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{playbook.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{playbook.description}</p>
          </div>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isExecuting ? 'Executing...' : 'Execute Playbook'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Steps</h2>
              <div className="space-y-4">
                {playbook.definition.steps.map((step, index) => (
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
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Type: {step.type}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">Step {index + 1}</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {step.config.approvers && (
                          <p className="text-sm">
                            Approvers: {step.config.approvers.join(', ')}
                          </p>
                        )}
                        {step.config.action && (
                          <p className="text-sm">
                            Action: {step.config.action}
                          </p>
                        )}
                        {step.config.parameters && (
                          <div className="text-sm">
                            <p className="font-medium">Parameters:</p>
                            <ul className="list-disc list-inside pl-4">
                              {Object.entries(step.config.parameters).map(([key, value]) => (
                                <li key={key}>
                                  {key}: {value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {step.config.channel && (
                          <p className="text-sm">
                            Channel: {step.config.channel}
                          </p>
                        )}
                        {step.config.message && (
                          <p className="text-sm">
                            Message: {step.config.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Execution Parameters</h2>
              <div className="space-y-4">
                {renderParameterInputs()}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">実行履歴</h2>
              <div className="space-y-4">
                {playbook.last_run ? (
                  <div className="space-y-2">
                    <Link
                      href={`/playbooks/${playbook.id}/run`}
                      className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          最終実行: {new Date(playbook.last_run.timestamp).toLocaleString()}
                        </span>
                        <StatusBadge status={playbook.last_run.status} />
                      </div>
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">実行履歴なし</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
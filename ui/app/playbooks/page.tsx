'use client'

import { useState } from 'react'
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

const mockPlaybooks: Playbook[] = [
  {
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
  {
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
            },
          },
        },
        {
          id: 'step3',
          type: 'notification',
          name: 'Notify team',
          config: {
            channel: '#security-incidents',
            message: 'Host ${host_id} has been isolated for investigation.',
          },
        },
      ],
    },
    created_by: 'Jane Smith',
    created_at: '2024-02-16T09:00:00Z',
  },
]

const StatusBadge = ({ status }: { status: 'success' | 'failure' }) => {
  const colorClass = {
    success: 'bg-green-100 text-green-800',
    failure: 'bg-red-100 text-red-800',
  }[status]

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status.toUpperCase()}
    </span>
  )
}

export default function Playbooks() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Playbooks</h1>
          <Link
            href="/playbooks/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create New Playbook
          </Link>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search playbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {mockPlaybooks.map((playbook) => (
            <Link
              key={playbook.id}
              href={`/playbooks/${playbook.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{playbook.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {playbook.description}
                    </p>
                  </div>
                  {playbook.last_run && (
                    <StatusBadge status={playbook.last_run.status} />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {playbook.definition.steps.map((step) => (
                    <span
                      key={step.id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {step.name}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>Created by: {playbook.created_by}</span>
                    <span>•</span>
                    <span>{new Date(playbook.created_at).toLocaleString()}</span>
                  </div>
                  {playbook.last_run && (
                    <div>
                      Last run: {new Date(playbook.last_run.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


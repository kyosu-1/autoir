'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChangeEvent } from 'react'

interface Incident {
  id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'NEW' | 'TRIAGE' | 'CONTAIN' | 'RECOVER' | 'CLOSED'
  detected_at: string
}

interface Alert {
  id: string
  source: string
  title: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: string
  detected_at: string
}

// モックデータ
const mockStats = {
  activeIncidents: 12,
  newAlerts: 25,
  resolvedToday: 5,
  mttr: '2.5h', // Mean Time To Resolve
  severityDistribution: {
    CRITICAL: 2,
    HIGH: 5,
    MEDIUM: 8,
    LOW: 15,
  },
  sourceDistribution: {
    'Azure Sentinel': 12,
    'CrowdStrike EDR': 8,
    'Firewall': 6,
    'Manual': 4,
  },
  recentActivity: [
    {
      id: '1',
      type: 'INCIDENT_CREATED',
      content: 'New incident: Suspicious outbound traffic detected',
      timestamp: '2024-02-16T11:30:00Z',
    },
    {
      id: '2',
      type: 'INCIDENT_CLOSED',
      content: 'Resolved: Brute force attack attempt',
      timestamp: '2024-02-16T11:15:00Z',
    },
    {
      id: '3',
      type: 'POSTMORTEM_PUBLISHED',
      content: 'Postmortem published for incident #1234',
      timestamp: '2024-02-16T11:00:00Z',
    },
  ],
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Suspicious Login Attempts',
    description: 'Multiple failed login attempts from unknown IP',
    severity: 'HIGH',
    status: 'NEW',
    detected_at: '2024-02-16T10:00:00Z',
  },
  {
    id: '2',
    title: 'Malware Detection',
    description: 'Potential malware detected on host ABC-123',
    severity: 'CRITICAL',
    status: 'TRIAGE',
    detected_at: '2024-02-16T09:30:00Z',
  },
]

const mockAlerts: Alert[] = [
  {
    id: '1',
    source: 'CrowdStrike EDR',
    title: 'Suspicious Process Execution',
    severity: 'HIGH',
    status: 'NEW',
    detected_at: '2024-02-16T10:05:00Z',
  },
  {
    id: '2',
    source: 'Azure Sentinel',
    title: 'Brute Force Attack Detected',
    severity: 'MEDIUM',
    status: 'NEW',
    detected_at: '2024-02-16T09:45:00Z',
  },
]

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
    TRIAGE: 'bg-yellow-100 text-yellow-800',
    CONTAIN: 'bg-orange-100 text-orange-800',
    RECOVER: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
  }[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  )
}

const StatCard = ({ title, value, trend }: { title: string; value: string | number; trend?: { value: number; isPositive: boolean } }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <div className="mt-2 flex items-baseline">
      <p className="text-2xl font-semibold">{value}</p>
      {trend && (
        <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </span>
      )}
    </div>
  </div>
)

const ActivityItem = ({ activity }: { activity: { type: string; content: string; timestamp: string } }) => {
  const iconClass = {
    INCIDENT_CREATED: 'bg-blue-100 text-blue-800',
    INCIDENT_CLOSED: 'bg-green-100 text-green-800',
    POSTMORTEM_PUBLISHED: 'bg-purple-100 text-purple-800',
  }[activity.type]

  return (
    <div className="flex items-start gap-4">
      <div className={`w-8 h-8 rounded-full ${iconClass} flex items-center justify-center`}>
        {activity.type === 'INCIDENT_CREATED' && '!'}
        {activity.type === 'INCIDENT_CLOSED' && '✓'}
        {activity.type === 'POSTMORTEM_PUBLISHED' && 'P'}
      </div>
      <div className="flex-1">
        <p className="text-sm">{activity.content}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AutoIR Dashboard</h1>
          <Link
            href="/chat"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
            Ask LLM
          </Link>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Active Incidents"
            value={mockStats.activeIncidents}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="New Alerts"
            value={mockStats.newAlerts}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Resolved Today"
            value={mockStats.resolvedToday}
          />
          <StatCard
            title="Avg. Resolution Time"
            value={mockStats.mttr}
          />
        </div>

        {/* 分布グラフ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Severity Distribution</h3>
            <div className="space-y-2">
              {Object.entries(mockStats.severityDistribution).map(([severity, count]) => (
                <div key={severity} className="flex items-center">
                  <span className="w-20 text-sm">{severity}</span>
                  <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        severity === 'CRITICAL'
                          ? 'bg-red-500'
                          : severity === 'HIGH'
                          ? 'bg-orange-500'
                          : severity === 'MEDIUM'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}
                      style={{ width: `${(count / 30) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Alert Sources</h3>
            <div className="space-y-2">
              {Object.entries(mockStats.sourceDistribution).map(([source, count]) => (
                <div key={source} className="flex items-center">
                  <span className="w-32 text-sm truncate">{source}</span>
                  <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(count / 30) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 検索バー */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search incidents and alerts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* インシデント/アラートリスト */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="border-b dark:border-gray-700">
                <nav className="flex">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 0
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Incidents
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 1
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    Alerts
                  </button>
                </nav>
              </div>

              <div className="p-4">
                {activeTab === 0 ? (
                  <div className="space-y-4">
                    {mockIncidents.map((incident) => (
                      <Link
                        href={`/incidents/${incident.id}`}
                        key={incident.id}
                        className="block"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h2 className="text-lg font-semibold">{incident.title}</h2>
                              <div className="flex gap-2">
                                <SeverityBadge severity={incident.severity} />
                                <StatusBadge status={incident.status} />
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {incident.description}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Detected: {new Date(incident.detected_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h2 className="text-lg font-semibold">{alert.title}</h2>
                            <div className="flex gap-2">
                              <SeverityBadge severity={alert.severity} />
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                {alert.source}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Detected: {new Date(alert.detected_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 最近のアクティビティ */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {mockStats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

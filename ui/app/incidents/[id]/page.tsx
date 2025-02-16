'use client'

import Link from 'next/link'

interface TimelineEvent {
  id: string
  type: 'DETECTION' | 'STATUS_CHANGE' | 'ACTION' | 'COMMENT'
  content: string
  timestamp: string
  user?: string
}

interface Incident {
  id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'NEW' | 'TRIAGE' | 'CONTAIN' | 'RECOVER' | 'CLOSED'
  detected_at: string
  timeline: TimelineEvent[]
}

const mockIncident: Incident = {
  id: '1',
  title: 'Suspicious Login Attempts',
  description: 'Multiple failed login attempts from unknown IP',
  severity: 'HIGH',
  status: 'NEW',
  detected_at: '2024-02-16T10:00:00Z',
  timeline: [
    {
      id: '1',
      type: 'DETECTION',
      content: 'Alert received from Azure Sentinel',
      timestamp: '2024-02-16T10:00:00Z',
    },
    {
      id: '2',
      type: 'STATUS_CHANGE',
      content: 'Status changed to NEW',
      timestamp: '2024-02-16T10:01:00Z',
      user: 'System',
    },
    {
      id: '3',
      type: 'COMMENT',
      content: 'Investigating the source IP addresses',
      timestamp: '2024-02-16T10:05:00Z',
      user: 'John Doe',
    },
  ],
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

const TimelineEvent = ({ event }: { event: TimelineEvent }) => {
  const bgColorClass = {
    DETECTION: 'bg-blue-50 dark:bg-blue-900/50',
    STATUS_CHANGE: 'bg-yellow-50 dark:bg-yellow-900/50',
    ACTION: 'bg-green-50 dark:bg-green-900/50',
    COMMENT: 'bg-gray-50 dark:bg-gray-800',
  }[event.type]

  return (
    <div className={`rounded-lg p-4 ${bgColorClass}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="font-semibold">{event.type}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(event.timestamp).toLocaleString()}
          </span>
        </div>
        <p>{event.content}</p>
        {event.user && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By: {event.user}
          </p>
        )}
      </div>
    </div>
  )
}

export default function IncidentDetail() {
  // const params = useParams()
  const incident = mockIncident // 実際のAPIでは、params.idを使用して取得

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{incident.title}</h1>
            <div className="flex gap-2 items-center">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              <span className="text-sm text-gray-500">
                ID: {incident.id}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {incident.status === 'CLOSED' ? (
              <Link
                href={`/postmortems/new?incident_id=${incident.id}`}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create Postmortem
              </Link>
            ) : null}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
              Ask LLM
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p>{incident.description}</p>
          </div>
          <div className="border-t dark:border-gray-700 pt-4">
            <h2 className="font-semibold mb-2">Details</h2>
            <p>
              Detected at: {new Date(incident.detected_at).toLocaleString()}
            </p>
          </div>
          {incident.status === 'CLOSED' && (
            <div className="border-t dark:border-gray-700 pt-4">
              <h2 className="font-semibold mb-2">Postmortem</h2>
              <div className="flex items-center gap-4">
                <Link
                  href={`/postmortems?incident_id=${incident.id}`}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Postmortem Reports
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Timeline</h2>
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Comment
            </button>
          </div>
          <div className="space-y-4">
            {incident.timeline.map((event) => (
              <TimelineEvent key={event.id} event={event} />
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-2">
            <textarea
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
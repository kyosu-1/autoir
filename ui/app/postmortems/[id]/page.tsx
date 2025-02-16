'use client'

import { useState } from 'react'
// import { useParams } from 'next/navigation'

interface PostmortemReport {
  id: string
  incident_id: string
  incident_title: string
  summary: string
  root_cause: string
  timeline: string
  lessons_learned: string
  created_by: string
  created_at: string
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED'
}

const mockPostmortem: PostmortemReport = {
  id: '1',
  incident_id: '1',
  incident_title: 'Suspicious Login Attempts',
  summary: 'Multiple failed login attempts from unknown IP addresses were detected, indicating a potential brute force attack.',
  root_cause: 'Weak password policy and lack of rate limiting on authentication endpoints.',
  timeline: '- 10:00 AM: Initial detection\n- 10:05 AM: Investigation started\n- 10:30 AM: IP blocked\n- 11:00 AM: Security measures implemented',
  lessons_learned: '1. Implement rate limiting on auth endpoints\n2. Enforce stronger password requirements\n3. Set up automated IP blocking for suspicious activities',
  created_by: 'John Doe',
  created_at: '2024-02-16T12:00:00Z',
  status: 'PUBLISHED',
}

export default function PostmortemDetail() {
  // const params = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [report, setReport] = useState(mockPostmortem)

  const handleSave = () => {
    setIsEditing(false)
    // TODO: API call to save changes
  }

  const handleStatusChange = (newStatus: PostmortemReport['status']) => {
    setReport({ ...report, status: newStatus })
    // TODO: API call to update status
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{report.incident_title}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Incident ID: {report.incident_id}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit Report
                </button>
                <div className="relative">
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Change Status
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden">
                    {['DRAFT', 'REVIEW', 'PUBLISHED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status as PostmortemReport['status'])}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              {isEditing ? (
                <textarea
                  value={report.summary}
                  onChange={(e) => setReport({ ...report, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{report.summary}</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Root Cause</h2>
              {isEditing ? (
                <textarea
                  value={report.root_cause}
                  onChange={(e) => setReport({ ...report, root_cause: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{report.root_cause}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              {isEditing ? (
                <textarea
                  value={report.timeline}
                  onChange={(e) => setReport({ ...report, timeline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={6}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 font-mono text-sm">
                  {report.timeline}
                </pre>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Lessons Learned</h2>
              {isEditing ? (
                <textarea
                  value={report.lessons_learned}
                  onChange={(e) => setReport({ ...report, lessons_learned: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={6}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 font-mono text-sm">
                  {report.lessons_learned}
                </pre>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Created by: {report.created_by}</span>
            <span>•</span>
            <span>Created at: {new Date(report.created_at).toLocaleString()}</span>
            <span>•</span>
            <span>Status: {report.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 
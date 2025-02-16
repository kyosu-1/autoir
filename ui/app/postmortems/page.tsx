'use client'

import { useState } from 'react'
import Link from 'next/link'

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

const mockPostmortems: PostmortemReport[] = [
  {
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
  },
  {
    id: '2',
    incident_id: '2',
    incident_title: 'Malware Detection',
    summary: 'Potential malware detected on host ABC-123, requiring immediate investigation and containment.',
    root_cause: 'Under investigation',
    timeline: '- 09:30 AM: Malware detected\n- 09:35 AM: Host isolated\n- 09:45 AM: Investigation initiated',
    lessons_learned: 'Draft in progress',
    created_by: 'Jane Smith',
    created_at: '2024-02-16T10:00:00Z',
    status: 'DRAFT',
  },
]

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = {
    DRAFT: 'bg-yellow-100 text-yellow-800',
    REVIEW: 'bg-blue-100 text-blue-800',
    PUBLISHED: 'bg-green-100 text-green-800',
  }[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  )
}

export default function Postmortems() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Postmortem Reports</h1>
          <Link
            href="/postmortems/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create New Report
          </Link>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search reports..."
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
          {mockPostmortems.map((report) => (
            <Link
              key={report.id}
              href={`/postmortems/${report.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{report.incident_title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Incident ID: {report.incident_id}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">{report.summary}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>By: {report.created_by}</span>
                    <span>•</span>
                    <span>Created: {new Date(report.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Details</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Incident {
  id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'NEW' | 'TRIAGE' | 'CONTAIN' | 'RECOVER' | 'CLOSED'
  detected_at: string
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Suspicious Login Attempts',
    description: 'Multiple failed login attempts from unknown IP',
    severity: 'HIGH',
    status: 'CLOSED',
    detected_at: '2024-02-16T10:00:00Z',
  },
  {
    id: '2',
    title: 'Malware Detection',
    description: 'Potential malware detected on host ABC-123',
    severity: 'CRITICAL',
    status: 'CLOSED',
    detected_at: '2024-02-16T09:30:00Z',
  },
]

export default function NewPostmortem() {
  const router = useRouter()
  const [selectedIncident, setSelectedIncident] = useState<string>('')
  const [formData, setFormData] = useState({
    summary: '',
    root_cause: '',
    timeline: '',
    lessons_learned: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API call to create postmortem
    router.push('/postmortems')
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create New Postmortem Report</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Select Incident</h2>
            <div className="space-y-4">
              {mockIncidents.map((incident) => (
                <label
                  key={incident.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedIncident === incident.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="incident"
                    value={incident.id}
                    checked={selectedIncident === incident.id}
                    onChange={(e) => setSelectedIncident(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{incident.title}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(incident.detected_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {incident.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Root Cause Analysis</label>
              <textarea
                value={formData.root_cause}
                onChange={(e) => setFormData({ ...formData, root_cause: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timeline</label>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                List the sequence of events in chronological order
              </div>
              <textarea
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
                rows={6}
                required
                placeholder="- HH:MM Event description&#10;- HH:MM Another event"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lessons Learned</label>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                What can we improve to prevent similar incidents?
              </div>
              <textarea
                value={formData.lessons_learned}
                onChange={(e) => setFormData({ ...formData, lessons_learned: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
                rows={6}
                required
                placeholder="1. Improvement suggestion&#10;2. Another suggestion"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
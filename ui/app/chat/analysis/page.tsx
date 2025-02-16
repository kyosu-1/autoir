'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AnalysisResult {
  summary: string
  severity_assessment: {
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    reasoning: string
  }
  similar_cases: Array<{
    id: string
    title: string
    similarity: number
    key_findings: string
    resolution: string
  }>
  recommended_actions: Array<{
    type: 'playbook' | 'investigation' | 'mitigation'
    title: string
    description: string
    confidence: number
    playbook_id?: string
  }>
  evidence_analysis: Array<{
    source: string
    findings: string
    confidence: number
  }>
  timeline_analysis: {
    anomalies: string[]
    patterns: string[]
    recommendations: string[]
  }
}

const mockAnalysis: AnalysisResult = {
  summary: 'Multiple suspicious process executions detected match characteristics of a known malware family. Detection on critical servers suggests potential lateral movement.',
  severity_assessment: {
    level: 'HIGH',
    reasoning: '1) Detection on critical servers 2) Multiple hosts affected 3) Match with known malicious patterns',
  },
  similar_cases: [
    {
      id: 'INC-2024-001',
      title: 'Malware Infection Incident (Jan 2024)',
      similarity: 0.85,
      key_findings: 'Similar process execution patterns, matching C2 communication',
      resolution: 'Host isolation, malware removal, EDR policy enhancement',
    },
  ],
  recommended_actions: [
    {
      type: 'playbook',
      title: 'Isolate Compromised Host',
      description: 'Isolate infected host and collect forensics',
      confidence: 0.9,
      playbook_id: '2',
    },
    {
      type: 'investigation',
      title: 'Network Traffic Analysis',
      description: 'Investigate C2 communication traces in the last 24 hours',
      confidence: 0.8,
    },
  ],
  evidence_analysis: [
    {
      source: 'EDR Logs',
      findings: 'Execution of suspicious_process.exe, registry modifications, privilege escalation attempts',
      confidence: 0.95,
    },
    {
      source: 'Network Logs',
      findings: 'Communication attempts with known C2 servers',
      confidence: 0.85,
    },
  ],
  timeline_analysis: {
    anomalies: [
      'Administrative process execution during off-hours',
      'Unusual network port usage',
    ],
    patterns: [
      'C2 communication established within 30 minutes post-infection',
      'Simultaneous infection attempts on multiple hosts',
    ],
    recommendations: [
      'Immediate EDR policy enhancement',
      'Preventive monitoring of similar hosts',
    ],
  },
}

const SeverityBadge = ({ level }: { level: string }) => {
  const colorClass = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  }[level] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {level}
    </span>
  )
}

const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
  const colorClass = confidence > 0.8
    ? 'bg-green-100 text-green-800'
    : confidence > 0.6
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {Math.round(confidence * 100)}% Confidence
    </span>
  )
}

export default function Analysis() {
  const [analysis] = useState(mockAnalysis)

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Incident Analysis</h1>
          <Link
            href="/chat"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ask LLM
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">Analysis Summary</h2>
                <SeverityBadge level={analysis.severity_assessment.level} />
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {analysis.summary}
                </p>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Severity Assessment Reasoning</h3>
                  <p className="text-sm text-gray-600">
                    {analysis.severity_assessment.reasoning}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recommended Actions</h2>
              <div className="space-y-4">
                {analysis.recommended_actions.map((action, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{action.title}</h3>
                        <span className="text-xs text-gray-500">
                          {action.type}
                        </span>
                      </div>
                      <ConfidenceBadge confidence={action.confidence} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {action.description}
                    </p>
                    {action.playbook_id && (
                      <Link
                        href={`/playbooks/${action.playbook_id}`}
                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <span>Playbookを表示</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Similar Cases</h2>
              <div className="space-y-4">
                {analysis.similar_cases.map((case_) => (
                  <div
                    key={case_.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{case_.title}</h3>
                        <p className="text-sm text-gray-500">{case_.id}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        Similarity: {Math.round(case_.similarity * 100)}%
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Main Findings:</span>
                        {case_.key_findings}
                      </p>
                      <p>
                        <span className="font-medium">Resolution:</span>
                        {case_.resolution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Evidence Analysis</h2>
              <div className="space-y-4">
                {analysis.evidence_analysis.map((evidence, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{evidence.source}</h3>
                      <ConfidenceBadge confidence={evidence.confidence} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {evidence.findings}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Timeline Analysis</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Detected Anomalies</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {analysis.timeline_analysis.anomalies.map((anomaly, index) => (
                      <li key={index} className="text-gray-600">{anomaly}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Behavior Patterns</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {analysis.timeline_analysis.patterns.map((pattern, index) => (
                      <li key={index} className="text-gray-600">{pattern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Recommended Actions</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {analysis.timeline_analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-600">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
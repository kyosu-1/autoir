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
  summary: '複数のホストで検出された不審なプロセス実行は、既知のマルウェアファミリーの特徴と一致します。特に重要なサーバーでの検出があり、横断的な感染の可能性が示唆されます。',
  severity_assessment: {
    level: 'HIGH',
    reasoning: '1) 重要サーバーでの検出 2) 複数ホストへの影響 3) 既知の危険なマルウェアパターンとの一致',
  },
  similar_cases: [
    {
      id: 'INC-2024-001',
      title: 'マルウェア感染インシデント（2024年1月）',
      similarity: 0.85,
      key_findings: '同様のプロセス実行パターン、類似のC2通信',
      resolution: 'ホスト隔離、マルウェア駆除、EDRポリシー強化',
    },
  ],
  recommended_actions: [
    {
      type: 'playbook',
      title: 'Isolate Compromised Host',
      description: '感染が確認されたホストの隔離とフォレンジック収集',
      confidence: 0.9,
      playbook_id: '2',
    },
    {
      type: 'investigation',
      title: 'Network Traffic Analysis',
      description: '過去24時間のC2通信痕跡の調査',
      confidence: 0.8,
    },
  ],
  evidence_analysis: [
    {
      source: 'EDR Logs',
      findings: 'suspicious_process.exe の実行、レジストリ変更、特権昇格の試行',
      confidence: 0.95,
    },
    {
      source: 'Network Logs',
      findings: '既知のC2サーバーとの通信試行',
      confidence: 0.85,
    },
  ],
  timeline_analysis: {
    anomalies: [
      '深夜時間帯での管理者権限プロセスの実行',
      '通常とは異なるネットワークポートの使用',
    ],
    patterns: [
      '感染後30分以内でのC2通信確立',
      '複数ホストへの同時感染試行',
    ],
    recommendations: [
      'EDRポリシーの即時強化',
      '類似ホストの予防的監視強化',
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
      {Math.round(confidence * 100)}% 信頼度
    </span>
  )
}

export default function Analysis() {
  const [analysis] = useState(mockAnalysis)

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">インシデント分析</h1>
          <Link
            href="/chat"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            LLMに質問する
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">分析サマリー</h2>
                <SeverityBadge level={analysis.severity_assessment.level} />
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {analysis.summary}
                </p>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">重大度判定理由</h3>
                  <p className="text-sm text-gray-600">
                    {analysis.severity_assessment.reasoning}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">推奨アクション</h2>
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
              <h2 className="text-lg font-semibold mb-4">類似事例</h2>
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
                        類似度: {Math.round(case_.similarity * 100)}%
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">主な発見：</span>
                        {case_.key_findings}
                      </p>
                      <p>
                        <span className="font-medium">解決方法：</span>
                        {case_.resolution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">証跡分析</h2>
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
              <h2 className="text-lg font-semibold mb-4">タイムライン分析</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">検出された異常</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {analysis.timeline_analysis.anomalies.map((anomaly, index) => (
                      <li key={index} className="text-gray-600">{anomaly}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">行動パターン</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {analysis.timeline_analysis.patterns.map((pattern, index) => (
                      <li key={index} className="text-gray-600">{pattern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">推奨対策</h3>
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
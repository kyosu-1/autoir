'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PlaybookStep {
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
}

export default function NewPlaybook() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<PlaybookStep[]>([])

  const handleAddStep = (type: PlaybookStep['type']) => {
    const newStep: PlaybookStep = {
      id: `step${steps.length + 1}`,
      type,
      name: '',
      config: {},
    }
    setSteps([...steps, newStep])
  }

  const handleUpdateStep = (index: number, updates: Partial<PlaybookStep>) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], ...updates }
    setSteps(newSteps)
  }

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) return

    const newSteps = [...steps]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]]
    setSteps(newSteps)
  }

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // TODO: APIコール
    console.log({
      name,
      description,
      definition: { steps },
    })
    router.push('/playbooks')
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create New Playbook</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name || steps.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Create Playbook
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: Block Malicious IP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="例: Blocks an IP address across all firewalls and sends notification"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Steps</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddStep('approval')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Add Approval
              </button>
              <button
                onClick={() => handleAddStep('action')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Add Action
              </button>
              <button
                onClick={() => handleAddStep('notification')}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                Add Notification
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Step Name</label>
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => handleUpdateStep(index, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="例: Get approval for IP block"
                      />
                    </div>

                    {step.type === 'approval' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Approvers</label>
                        <input
                          type="text"
                          value={step.config.approvers?.join(', ') || ''}
                          onChange={(e) => handleUpdateStep(index, {
                            config: {
                              ...step.config,
                              approvers: e.target.value.split(',').map(s => s.trim()),
                            },
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="例: admin, security-lead"
                        />
                      </div>
                    )}

                    {step.type === 'action' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Action</label>
                          <input
                            type="text"
                            value={step.config.action || ''}
                            onChange={(e) => handleUpdateStep(index, {
                              config: { ...step.config, action: e.target.value },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例: firewall.block_ip"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Parameters</label>
                          <textarea
                            value={JSON.stringify(step.config.parameters || {}, null, 2)}
                            onChange={(e) => {
                              try {
                                const parameters = JSON.parse(e.target.value)
                                handleUpdateStep(index, {
                                  config: { ...step.config, parameters },
                                })
                              } catch (error) {
                                console.error(error)
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            rows={4}
                            placeholder={'例:\n{\n  "ip": "${ip_address}",\n  "reason": "${reason}"\n}'}
                          />
                        </div>
                      </>
                    )}

                    {step.type === 'notification' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Channel</label>
                          <input
                            type="text"
                            value={step.config.channel || ''}
                            onChange={(e) => handleUpdateStep(index, {
                              config: { ...step.config, channel: e.target.value },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例: #security-alerts"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Message</label>
                          <textarea
                            value={step.config.message || ''}
                            onChange={(e) => handleUpdateStep(index, {
                              config: { ...step.config, message: e.target.value },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="例: IP ${ip_address} has been blocked. Reason: ${reason}"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleMoveStep(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemoveStep(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {steps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ステップを追加してPlaybookを作成してください
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
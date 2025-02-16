'use client'

import { useState } from 'react'

interface AddIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (integration: {
    type: string
    name: string
    config: Record<string, string>
  }) => void
}

const INTEGRATION_TYPES = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications and receive commands via Slack',
    configFields: [
      {
        key: 'webhook_url',
        label: 'Webhook URL',
        placeholder: 'https://hooks.slack.com/services/xxx/yyy/zzz',
        type: 'text',
      },
    ],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Send notifications and receive commands via Teams',
    configFields: [
      {
        key: 'webhook_url',
        label: 'Webhook URL',
        placeholder: 'https://your-tenant.webhook.office.com/xxx',
        type: 'text',
      },
    ],
  },
  {
    id: 'siem',
    name: 'SIEM Integration',
    description: 'Connect to your SIEM system (Splunk, Azure Sentinel, etc.)',
    configFields: [
      {
        key: 'api_key',
        label: 'API Key',
        placeholder: 'Your SIEM API key',
        type: 'password',
      },
      {
        key: 'base_url',
        label: 'Base URL',
        placeholder: 'https://api.your-siem.com',
        type: 'text',
      },
    ],
  },
  {
    id: 'edr',
    name: 'EDR Integration',
    description: 'Connect to your EDR solution (CrowdStrike, etc.)',
    configFields: [
      {
        key: 'api_key',
        label: 'API Key',
        placeholder: 'Your EDR API key',
        type: 'password',
      },
      {
        key: 'base_url',
        label: 'Base URL',
        placeholder: 'https://api.your-edr.com',
        type: 'text',
      },
    ],
  },
]

export default function AddIntegrationModal({
  isOpen,
  onClose,
  onAdd,
}: AddIntegrationModalProps) {
  const [selectedType, setSelectedType] = useState('')
  const [name, setName] = useState('')
  const [config, setConfig] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      type: selectedType,
      name,
      config,
    })
    onClose()
    // Reset form
    setSelectedType('')
    setName('')
    setConfig({})
  }

  if (!isOpen) return null

  const selectedIntegrationType = INTEGRATION_TYPES.find((type) => type.id === selectedType)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Add New Integration</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Integration Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTEGRATION_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="integrationType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {type.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {selectedType && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Integration Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`e.g., Production ${selectedIntegrationType?.name}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Configuration</h3>
                  {selectedIntegrationType?.configFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={config[field.key] || ''}
                        onChange={(e) =>
                          setConfig({ ...config, [field.key]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedType || !name}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Integration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 
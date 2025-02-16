'use client'

import { useState } from 'react'

interface IntegrationConfig {
  id: string
  type: 'slack' | 'teams' | 'siem' | 'edr' | 'firewall'
  name: string
  enabled: boolean
  config: {
    webhook_url?: string
    api_key?: string
    base_url?: string
  }
}

const mockIntegrations: IntegrationConfig[] = [
  {
    id: '1',
    type: 'slack',
    name: 'Slack Workspace',
    enabled: true,
    config: {
      webhook_url: 'https://hooks.slack.com/services/xxx/yyy/zzz',
    },
  },
  {
    id: '2',
    type: 'siem',
    name: 'Azure Sentinel',
    enabled: true,
    config: {
      api_key: '********',
      base_url: 'https://api.sentinel.azure.com',
    },
  },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('integrations')

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b dark:border-gray-700">
            <nav className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'integrations'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('integrations')}
              >
                Integrations
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
            </nav>
          </div>

          <div className="p-4">
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">External Integrations</h2>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Add Integration
                  </button>
                </div>

                <div className="space-y-4">
                  {mockIntegrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{integration.name}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {integration.type.toUpperCase()}
                            </span>
                            {integration.enabled && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {integration.config.webhook_url && (
                              <div>Webhook URL: {integration.config.webhook_url}</div>
                            )}
                            {integration.config.base_url && (
                              <div>Base URL: {integration.config.base_url}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Slack Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Send incident updates to Slack channels
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
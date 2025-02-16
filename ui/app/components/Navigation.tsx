'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              AutoIR
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/postmortems"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/postmortems')
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Postmortems
              </Link>
              <Link
                href="/playbooks"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/playbooks')
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Playbooks
              </Link>
              <Link
                href="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/settings')
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/chat"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
              Ask LLM
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 
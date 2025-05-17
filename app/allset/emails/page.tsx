'use client'

import { useEffect, useState } from 'react'
import type { EmailRecord } from '@/types/email'

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/allset/emails')
        if (!res.ok) throw new Error('Failed to fetch emails')
        const data = await res.json()
        setEmails(data.emails)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchEmails()
  }, [])

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8">
      <h1 className="mb-8 text-center text-3xl font-bold dark:text-white">Email Subscribers</h1>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300">
                  Subscribed At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400 dark:text-gray-600">
                    No emails found.
                  </td>
                </tr>
              ) : (
                emails.map((email) => (
                  <tr key={email.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {email.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {email.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(email.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

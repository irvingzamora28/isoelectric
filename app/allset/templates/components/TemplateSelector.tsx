'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Define Template interface here to avoid server component imports in client component
interface Template {
  id: string
  name: string
  description: string
  image?: string
  elements?: string[]
  colors?: string
}

export default function TemplateSelector() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [activeTemplate, setActiveTemplate] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch available templates
  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true)
        const response = await fetch('/api/allset/templates', {
          // Add cache: 'no-store' to avoid stale data
          cache: 'no-store' as RequestCache,
        })

        if (!response.ok) {
          throw new Error('Failed to fetch templates')
        }

        const data = await response.json()

        if (data.success) {
          setTemplates(data.availableTemplates)
          setActiveTemplate(data.activeTemplate)
        } else {
          throw new Error(data.message || 'Failed to fetch templates')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // Handle template change
  const handleTemplateChange = async (templateId: string) => {
    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/allset/templates/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update template')
      }

      const data = await response.json()

      if (data.success) {
        setActiveTemplate(data.activeTemplate)
        setSuccess(`Template changed to "${templates.find((t) => t.id === templateId)?.name}"`)
      } else {
        throw new Error(data.message || 'Failed to update template')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="border-t-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-slate-300"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Site Template</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-red-800 dark:text-red-400">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-green-800 dark:text-green-400">{success}</div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select the template to use for your site. Changes will be applied immediately.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`cursor-pointer rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                  activeTemplate === template.id
                    ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                onClick={() => !updating && handleTemplateChange(template.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    if (!updating) {
                      handleTemplateChange(template.id)
                    }
                  }
                }}
                disabled={updating}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{template.name}</h3>
                  {activeTemplate === template.id && (
                    <span className="bg-primary-500 rounded-full px-2 py-1 text-xs font-medium text-white">
                      Active
                    </span>
                  )}
                </div>

                {/* Template image */}
                {template.image && (
                  <div className="relative mt-3 h-40 w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        <Image
                          src={template.image}
                          alt={`${template.name} preview`}
                          width={400}
                          height={200}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>

                {/* Template elements */}
                {template.elements && template.elements.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                      Features
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {template.elements.map((element, index) => (
                        <li key={index} className="flex items-start text-xs">
                          <span className="text-primary-500 dark:text-primary-400 mt-0.5 mr-1.5">
                            •
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">{element}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Template colors */}
                {template.colors && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                      Color Scheme
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      {template.colors}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

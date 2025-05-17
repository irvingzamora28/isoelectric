'use client'

import { useState, useEffect } from 'react'
import { LandingContent } from '@/lib/llm/types'
import Image from 'next/image'

// Simple inline ImageUploader placeholder
const ImageUploader = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => (
  <div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Image URL"
      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
    {/* You can replace this with a real uploader */}
    {value && (
      <Image src={value} alt="Preview" width={200} height={200} className="mt-2 max-h-32 rounded" />
    )}
  </div>
)

interface FormEditorProps {
  content: LandingContent
  onSave: (content: LandingContent) => void
  isSaving: boolean
}

export default function FormEditor({ content, onSave, isSaving }: FormEditorProps) {
  const [formData, setFormData] = useState<LandingContent>(content)
  const [activeSection, setActiveSection] = useState<string>('hero')

  useEffect(() => {
    setFormData(content)
  }, [content])

  const handleChange = <T extends keyof LandingContent>(
    section: T,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => {
      const sectionData = { ...(prev[section] as unknown as Record<string, unknown>) }
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value,
        },
      } as LandingContent
    })
  }

  const handleNestedChange = <T extends keyof LandingContent>(
    section: T,
    subsection: string,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => {
      const sectionData = { ...(prev[section] as unknown as Record<string, unknown>) }
      const subsectionData = { ...((sectionData[subsection] as Record<string, unknown>) || {}) }

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subsection]: {
            ...subsectionData,
            [field]: value,
          },
        },
      } as LandingContent
    })
  }

  // Helper: get value at nested path
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getValueAtPath(obj: any, path: string): any {
    if (!path) return obj
    return path.split('.').reduce((acc, key) => {
      if (acc == null) return undefined
      // If acc is array and key is numeric, treat as array index
      if (Array.isArray(acc) && !isNaN(Number(key))) {
        return (acc as unknown[])[Number(key)]
      }
      return (acc as Record<string, unknown>)[key]
    }, obj)
  }
  // Helper: set value at nested path (immutably), preserving arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setValueAtPath(obj: any, path: string, value: any): any {
    if (!path) return value
    const keys = path.split('.')
    const lastKey = keys.pop()!
    // Shallow clone root (array or object)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root: any = Array.isArray(obj) ? [...obj] : { ...obj }
    let curr = root
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const nextKey = keys[i + 1]
      // If nextKey is numeric, treat as array
      if (!isNaN(Number(nextKey))) {
        curr[key] = Array.isArray(curr[key]) ? [...curr[key]] : []
      } else {
        curr[key] = curr[key] !== undefined ? { ...curr[key] } : {}
      }
      curr = curr[key]
    }
    // Now set the value
    if (Array.isArray(curr) && !isNaN(Number(lastKey))) {
      curr[Number(lastKey)] = value
    } else {
      curr[lastKey] = value
    }
    return root
  }

  // Generic handler to set any field at a dot-path
  const handleFieldChange = (path: string, value: unknown) => {
    setFormData((prev: LandingContent) => setValueAtPath(prev, path, value) as LandingContent)
  }

  // Add a new item to an array at a nested path
  const handleArrayAdd = (path: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => {
      const arr = getValueAtPath(prev, path) || []
      let newItem
      if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null) {
        newItem = Object.fromEntries(Object.keys(arr[0]).map((k) => [k, '']))
      } else {
        newItem = ''
      }
      const newArr = [...arr, newItem]
      return setValueAtPath(prev, path, newArr)
    })
  }

  // Remove an item from an array at a nested path
  const handleArrayRemove = (path: string, idx: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => {
      const arr = getValueAtPath(prev, path) || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newArr = arr.filter((_: any, i: number) => i !== idx)
      return setValueAtPath(prev, path, newArr)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
      <div className="mb-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(formData).map((sectionKey) => (
            <button
              key={sectionKey}
              type="button"
              onClick={() => setActiveSection(sectionKey)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                activeSection === sectionKey
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((sectionKey) => {
            if (activeSection !== sectionKey) return null
            const section = formData[sectionKey as keyof typeof formData]

            // Recursive field renderer
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const renderField = (fieldKey: string, value: any, parentKeys: string[] = []) => {
              const fullKey = [...parentKeys, fieldKey].join('.')
              const label = fieldKey
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())

              if (typeof value === 'string') {
                if (fieldKey === 'description') {
                  return (
                    <div key={fullKey}>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                      </label>
                      <textarea
                        value={getValueAtPath(formData, fullKey)}
                        onChange={(e) => handleFieldChange(fullKey, e.target.value)}
                        rows={3}
                        className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )
                }
                if (fieldKey === 'image') {
                  return (
                    <div key={fullKey}>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                      </label>
                      <ImageUploader
                        value={getValueAtPath(formData, fullKey)}
                        onChange={(url) => handleFieldChange(fullKey, url)}
                      />
                    </div>
                  )
                }
                return (
                  <div key={fullKey}>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={getValueAtPath(formData, fullKey)}
                      onChange={(e) => handleFieldChange(fullKey, e.target.value)}
                      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )
              }
              if (typeof value === 'number') {
                return (
                  <div key={fullKey}>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={getValueAtPath(formData, fullKey)}
                      onChange={(e) => handleFieldChange(fullKey, Number(e.target.value))}
                      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )
              }
              if (typeof value === 'boolean') {
                return (
                  <div key={fullKey}>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                    <input
                      type="checkbox"
                      checked={getValueAtPath(formData, fullKey)}
                      onChange={(e) => handleFieldChange(fullKey, e.target.checked)}
                      className="text-primary-600 focus:border-primary-500 focus:ring-primary-500 focus:ring-opacity-50 rounded border-gray-300 shadow-sm focus:ring"
                    />
                  </div>
                )
              }
              if (Array.isArray(value)) {
                return (
                  <div key={fullKey + '-array'} className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {getValueAtPath(formData, fullKey).map((item: any, idx: number) => (
                      <div key={idx} className="relative mb-2 ml-4 border-l-2 border-gray-200 pl-4">
                        <button
                          type="button"
                          className="absolute top-1 left-[-30px] text-red-500 hover:text-red-700"
                          onClick={() => handleArrayRemove(fullKey, idx)}
                          aria-label="Remove item"
                        >
                          &times;
                        </button>
                        {typeof item === 'object' && item !== null ? (
                          Object.entries(item).map(([k, v]) =>
                            renderField(k, v, [...parentKeys, fieldKey, String(idx)])
                          )
                        ) : (
                          <input
                            type="text"
                            value={getValueAtPath(
                              formData,
                              [...parentKeys, fieldKey, String(idx)].join('.')
                            )}
                            onChange={(e) =>
                              handleFieldChange(
                                [...parentKeys, fieldKey, String(idx)].join('.'),
                                e.target.value
                              )
                            }
                            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-primary-600 hover:bg-primary-700 mt-2 rounded px-2 py-1 text-xs text-white"
                      onClick={() => handleArrayAdd(fullKey)}
                    >
                      Add Item
                    </button>
                  </div>
                )
              }
              if (typeof value === 'object' && value !== null) {
                return (
                  <div key={fullKey + '-object'} className="ml-2 border-l-2 border-gray-200 pl-4">
                    <div className="mb-1 font-medium text-gray-600 dark:text-gray-400">{label}</div>
                    {Object.entries(value).map(([k, v]) =>
                      renderField(k, v, [...parentKeys, fieldKey])
                    )}
                  </div>
                )
              }
              return null
            }

            return (
              <div key={sectionKey} className="space-y-4">
                <h3 className="text-lg font-medium">
                  {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </h3>
                {Object.entries(section).map(([fieldKey, value]) =>
                  renderField(fieldKey, value, [sectionKey])
                )}
              </div>
            )
          })}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

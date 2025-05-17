'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'AllSet Template',
    siteDescription: 'A modern template for Next.js applications',
    adminEmail: 'admin@example.com',
  })

  // Logo state
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [logoFileName, setLogoFileName] = useState<string>('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          setLogoPreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    const formData = new FormData()
    if (logoFile) {
      formData.append('logo', logoFile)
    }

    // POST to /api/logo
    const resp = await fetch('/api/logo', {
      method: 'POST',
      body: formData,
    })
    const data = await resp.json()
    if (data.success) {
      setSaveMessage('Logo updated!')
      setLogoPreview(data.logoUrl)
      setLogoFileName('')
      setLogoFile(null)
    } else {
      setSaveMessage('Error updating logo: ' + (data.error || 'Unknown error'))
    }
    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">General Settings</h2>

            {/* Logo Settings */}
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="siteLogo"
              >
                Logo
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  id="siteLogo"
                  className="file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 block text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                />
                <span className="text-xs text-gray-400">{logoFileName}</span>
              </div>

              {logoPreview && (
                <div className="mt-4">
                  <span className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                    Preview:
                  </span>
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    width={64}
                    height={64}
                    className="h-16 w-auto rounded shadow"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="siteName"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={generalSettings.siteName}
                onChange={handleChange}
                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="siteDescription"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Site Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={generalSettings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="adminEmail"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Admin Email
              </label>
              <input
                type="email"
                id="adminEmail"
                name="adminEmail"
                value={generalSettings.adminEmail}
                onChange={handleChange}
                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Theme Settings</h2>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme Color
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use the Theme Color Manager below to change the primary color for the entire
                website.
              </p>

              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-sm font-medium text-slate-800 dark:text-gray-100">
                  Theme Color Manager
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Use our dedicated theme color manager to easily set and preview theme colors for
                  the entire site.
                </p>
                <div className="mt-3">
                  <a
                    href="/theme-setter.html"
                    target="_blank"
                    className="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
                    </svg>
                    Open Theme Color Manager
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Security Settings</h2>

            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="twoFactor"
                  name="twoFactor"
                  type="checkbox"
                  className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="twoFactor"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="loginNotifications"
                  name="loginNotifications"
                  type="checkbox"
                  className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  defaultChecked
                />
                <label
                  htmlFor="loginNotifications"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Email Notifications for New Logins
                </label>
              </div>
            </div>
          </div>

          {saveMessage && (
            <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
              <div className="flex">
                <div className="text-sm font-medium text-green-800 dark:text-green-400">
                  {saveMessage}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

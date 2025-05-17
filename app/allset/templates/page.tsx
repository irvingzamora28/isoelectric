'use client'

import { Suspense } from 'react'
import TemplateSelector from './components/TemplateSelector'

function TemplatesContent() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Template Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your site's layout templates</p>
      </div>

      <TemplateSelector />
    </>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplatesContent />
    </Suspense>
  )
}

'use client'

import { usePathname } from 'next/navigation'

export default function AdminLayoutWrapper({
  children,
  regularContent,
}: {
  children: React.ReactNode
  regularContent: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/allset')

  if (isAdmin) {
    // For admin routes, just render the children
    // The admin layout is handled by app/allset/layout.tsx
    return <>{children}</>
  }

  // For non-admin routes, render the regular content
  return <>{regularContent}</>
}

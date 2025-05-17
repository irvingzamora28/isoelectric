'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/allset/logout', {
        method: 'POST',
      })
      router.push('/allset/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Don't show the admin layout on the login page
  if (pathname === '/allset/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-slate-100 shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-primary-600 dark:text-primary-400 text-xl font-bold">
                  AllSet Admin
                </h1>
              </div>
              <nav className="ml-6 hidden md:block">
                <div className="flex space-x-4">
                  <NavLink href="/allset" exact>
                    Dashboard
                  </NavLink>
                  <NavLink href="/allset/posts">Posts</NavLink>
                  <NavLink href="/allset/emails">Emails</NavLink>
                  <NavLink href="/allset/landing-content">Landing Content</NavLink>
                  <NavLink href="/allset/templates">Templates</NavLink>
                  <NavLink href="/allset/settings">Settings</NavLink>
                </div>
              </nav>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="border-b border-gray-200 bg-slate-100 py-2 md:hidden dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between space-x-2 overflow-x-auto">
            <NavLink href="/allset" exact className="whitespace-nowrap">
              Dashboard
            </NavLink>
            <NavLink href="/allset/posts" className="whitespace-nowrap">
              Posts
            </NavLink>
            <NavLink href="/allset/emails" className="whitespace-nowrap">
              Emails
            </NavLink>
            <NavLink href="/allset/landing-content" className="whitespace-nowrap">
              Landing Content
            </NavLink>
            <NavLink href="/allset/templates" className="whitespace-nowrap">
              Templates
            </NavLink>
            <NavLink href="/allset/settings" className="whitespace-nowrap">
              Settings
            </NavLink>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="mt-auto bg-slate-100 py-4 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AllSet Admin Panel
          </p>
        </div>
      </footer>
    </div>
  )
}

// Helper component for navigation links
function NavLink({
  href,
  children,
  exact = false,
  className = '',
}: {
  href: string
  children: React.ReactNode
  exact?: boolean
  className?: string
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname?.startsWith(href)

  const baseClasses = 'px-3 py-2 rounded-md text-sm font-medium'
  const activeClasses = 'bg-primary-100 text-slate-50 dark:bg-primary-900 dark:text-primary-300'
  const inactiveClasses =
    'text-gray-600 hover:bg-gray-100 hover:text-slate-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'

  return (
    <Link
      href={href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`}
    >
      {children}
    </Link>
  )
}

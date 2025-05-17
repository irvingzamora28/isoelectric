'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  primaryColor: string
  setPrimaryColor: (color: string) => void
  saveTheme: () => Promise<void>
  isSaving: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  initialColor = '#3b82f6',
}: {
  children: ReactNode
  initialColor?: string
}) {
  // State for the current primary color
  const [primaryColor, setPrimaryColor] = useState(initialColor)
  const [isSaving, setIsSaving] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try both localStorage keys
      const storedColor =
        localStorage.getItem('site-theme-color') || localStorage.getItem('theme-color')

      if (storedColor && storedColor !== primaryColor) {
        setPrimaryColor(storedColor)
        // Apply theme color directly to DOM for static export mode
        applyThemeColorToDom(storedColor)
      } else if (primaryColor) {
        // Apply initial color from server
        applyThemeColorToDom(primaryColor)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to run only once on mount

  // Function to save theme settings
  const saveTheme = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Saving theme with color:', primaryColor)
    }
    setIsSaving(true)
    try {
      // Save to localStorage for immediate access on page load
      localStorage.setItem('site-theme-color', primaryColor)
      localStorage.setItem('theme-color', primaryColor) // Also save with the key used in theme-setter.html

      // Update CSS variables immediately
      document.documentElement.style.setProperty('--color-primary-500', primaryColor)

      // Apply all theme color variables
      applyThemeColorToDom(primaryColor)

      // Try to save to server for persistence across devices
      try {
        const response = await fetch('/api/theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ primaryColor }),
        })

        if (!response.ok) {
          console.warn('Server API not available, using localStorage only')
        } else if (process.env.NODE_ENV === 'development') {
          console.log('Theme saved successfully to server')
        }
      } catch (apiError) {
        console.warn('Server API not available, using localStorage only')
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Theme saved successfully to localStorage')
      }

      // Force a page reload to apply the new theme from the CSS file
      // This is necessary because we're updating a CSS file on the server
      window.location.reload()
    } catch (error) {
      console.error('Error saving theme:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Function to apply theme color directly to DOM
  function applyThemeColorToDom(color: string) {
    // Create or update the style element
    let styleEl = document.getElementById('theme-style')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'theme-style'
      document.head.appendChild(styleEl)
    }

    // Generate CSS variables for the theme color
    const cssVariables = generateThemeCssVariables(color)
    styleEl.textContent = cssVariables
  }

  // Function to generate CSS variables for a theme color
  function generateThemeCssVariables(color: string) {
    // Helper function to adjust color brightness
    function adjustColor(hex: string, factor: number) {
      // Convert hex to RGB
      let r = parseInt(hex.slice(1, 3), 16)
      let g = parseInt(hex.slice(3, 5), 16)
      let b = parseInt(hex.slice(5, 7), 16)

      // Adjust brightness
      r = Math.round(r + (255 - r) * factor)
      g = Math.round(g + (255 - g) * factor)
      b = Math.round(b + (255 - b) * factor)

      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    return `
      :root {
        --color-primary-50: ${adjustColor(color, 0.95)} !important;
        --color-primary-100: ${adjustColor(color, 0.9)} !important;
        --color-primary-200: ${adjustColor(color, 0.8)} !important;
        --color-primary-300: ${adjustColor(color, 0.7)} !important;
        --color-primary-400: ${adjustColor(color, 0.6)} !important;
        --color-primary-500: ${color} !important;
        --color-primary-600: ${adjustColor(color, 0.4)} !important;
        --color-primary-700: ${adjustColor(color, 0.3)} !important;
        --color-primary-800: ${adjustColor(color, 0.2)} !important;
        --color-primary-900: ${adjustColor(color, 0.1)} !important;
        --color-primary-950: ${adjustColor(color, 0.05)} !important;
      }
    `
  }
  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, saveTheme, isSaving }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

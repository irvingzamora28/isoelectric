import fs from 'fs/promises'
import path from 'path'

// Path to the theme settings file
const themeFilePath = path.join(process.cwd(), 'data', 'theme.json')

// Default theme settings
const defaultTheme = {
  primaryColor: '#3b82f6', // Default blue color
}

// Load theme settings from file
export async function getThemeSettings() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    try {
      await fs.access(dataDir)
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(dataDir, { recursive: true })
    }

    try {
      const fileData = await fs.readFile(themeFilePath, 'utf-8')
      return JSON.parse(fileData)
    } catch (error) {
      // If file doesn't exist or can't be parsed, return default theme
      return defaultTheme
    }
  } catch (error) {
    console.error('Error loading theme settings:', error)
    return defaultTheme
  }
}

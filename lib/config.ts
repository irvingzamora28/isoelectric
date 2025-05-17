import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

export interface Template {
  id: string
  name: string
  description: string
}

export interface SiteConfig {
  activeTemplate: string
  availableTemplates: Template[]
}

const CONFIG_PATH = path.join(process.cwd(), 'data/config/site.json')

/**
 * Get the site configuration (cached for performance)
 */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  try {
    const configData = await fs.readFile(CONFIG_PATH, 'utf8')
    return JSON.parse(configData) as SiteConfig
  } catch (error) {
    console.error('Error reading site config:', error)
    // Return default config if file doesn't exist or is invalid
    return {
      activeTemplate: 'Main',
      availableTemplates: [
        {
          id: 'Main',
          name: 'Default Template',
          description: 'The default layout with standard spacing and container widths',
        },
      ],
    }
  }
})

/**
 * Update the site configuration
 */
export async function updateSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
  try {
    // Read current config
    const currentConfig = await getSiteConfig()

    // Merge with new config
    const updatedConfig = {
      ...currentConfig,
      ...config,
    }

    // Write updated config
    await fs.writeFile(CONFIG_PATH, JSON.stringify(updatedConfig, null, 2), 'utf8')

    return updatedConfig
  } catch (error) {
    console.error('Error updating site config:', error)
    throw new Error('Failed to update site configuration')
  }
}

/**
 * Update the active template
 */
export async function updateActiveTemplate(templateId: string): Promise<SiteConfig> {
  const config = await getSiteConfig()

  // Verify the template exists
  const templateExists = config.availableTemplates.some((t) => t.id === templateId)
  if (!templateExists) {
    throw new Error(`Template with ID "${templateId}" does not exist`)
  }

  return updateSiteConfig({ activeTemplate: templateId })
}

/**
 * Add a new template to the available templates
 */
export async function addTemplate(template: Template): Promise<SiteConfig> {
  const config = await getSiteConfig()

  // Check if template with this ID already exists
  if (config.availableTemplates.some((t) => t.id === template.id)) {
    throw new Error(`Template with ID "${template.id}" already exists`)
  }

  const updatedTemplates = [...config.availableTemplates, template]
  return updateSiteConfig({ availableTemplates: updatedTemplates })
}

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { llmService } from '@/lib/llm'
import { BlogTitleSuggestion } from '@/lib/llm/types'
import siteMetadata from '@/data/siteMetadata'

// For static export, we need to handle this differently
export const dynamic = 'error'

// Path to the landing content file
const landingContentFilePath = path.join(process.cwd(), 'data', 'landingContent.json')

export async function POST(request: NextRequest) {
  try {
    // Load the landing content
    const landingContent = await fs.readFile(landingContentFilePath, 'utf-8')

    // Use the site's language setting
    const contentLanguage = siteMetadata.language
    console.log(`API: Generating blog titles in site language: ${contentLanguage}`)

    // Generate blog titles using the LLM service with the site language
    const result = await llmService.generateBlogTitles(landingContent, contentLanguage)

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 })
    }

    // Parse the generated titles
    let titleSuggestions: BlogTitleSuggestion[]
    try {
      titleSuggestions = JSON.parse(result.content) as BlogTitleSuggestion[]
    } catch (error) {
      console.error('Error parsing generated blog titles:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to parse generated blog titles' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      titles: titleSuggestions,
    })
  } catch (error: unknown) {
    console.error('Error generating blog titles:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'An error occurred while generating blog titles',
      },
      { status: 500 }
    )
  }
}

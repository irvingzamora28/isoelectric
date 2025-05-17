import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// For static export, we need to handle this differently
export const dynamic = 'error'

// Path to the landing content file
const landingContentFilePath = path.join(process.cwd(), 'data', 'landingContent.json')

// Load landing content from file
async function loadLandingContent() {
  try {
    const fileData = await fs.readFile(landingContentFilePath, 'utf-8')
    return JSON.parse(fileData)
  } catch (error) {
    console.error('Error loading landing content:', error)
    throw new Error('Failed to load landing content')
  }
}

// Save landing content to file
async function saveLandingContent(content: unknown) {
  try {
    await fs.writeFile(landingContentFilePath, JSON.stringify(content, null, 2), 'utf-8')
    console.log('Landing content saved successfully')
  } catch (error) {
    console.error('Error writing landing content file:', error)
    throw error
  }
}

export async function GET() {
  console.log('GET /api/allset/landing-content - Loading landing content')
  try {
    const content = await loadLandingContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error in GET /api/allset/landing-content:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to load landing content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /api/allset/landing-content - Saving landing content')
  try {
    const contentData = await request.json()

    // Basic validation - ensure it's a valid object
    if (!contentData || typeof contentData !== 'object') {
      console.log('POST /api/allset/landing-content - Invalid content data')
      return NextResponse.json({ success: false, message: 'Invalid content data' }, { status: 400 })
    }

    // Save the content data to the file
    await saveLandingContent(contentData)

    console.log('POST /api/allset/landing-content - Content saved successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Landing content update error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating landing content' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { updateActiveTemplate } from '@/lib/config'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function POST(request: NextRequest) {
  try {
    const { templateId } = await request.json()

    if (!templateId) {
      return NextResponse.json(
        { success: false, message: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Update the active template
    const updatedConfig = await updateActiveTemplate(templateId)

    return NextResponse.json({
      success: true,
      activeTemplate: updatedConfig.activeTemplate,
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}

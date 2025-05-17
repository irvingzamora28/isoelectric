import { NextResponse } from 'next/server'
import { getAllEmails } from '@/lib/subscription'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function GET() {
  try {
    const emails = await getAllEmails()
    return NextResponse.json({ emails })
  } catch (error) {
    console.error('API /api/allset/emails error:', error)
    return NextResponse.json({ emails: [], error: 'Failed to fetch emails' }, { status: 500 })
  }
}

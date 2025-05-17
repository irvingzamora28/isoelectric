import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body
    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required.' }, { status: 400 })
    }
    await db.insertContactSubmission({ name: name || '', email, message })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API /api/allset/contact error:', error)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || typeof email !== 'string' || !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    await db.insertEmail(email)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    console.error('Error subscribing email:', err)
    if (isSqliteConstraintError(err)) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

function isSqliteConstraintError(err: unknown): err is { code: string } {
  return (
    err instanceof Error &&
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code?: unknown }).code === 'string' &&
    (err as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE'
  )
}

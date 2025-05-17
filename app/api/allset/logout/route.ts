import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // Clear the authentication cookie
  const cookieStore = await cookies()
  cookieStore.delete('allset_auth')

  return NextResponse.json({ success: true })
}

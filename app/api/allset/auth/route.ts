import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    // Check if credentials match
    if (username === adminUsername && password === adminPassword) {
      // Set a secure cookie for authentication
      const cookieStore = await cookies()
      cookieStore.set('allset_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'strict',
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred during authentication' },
      { status: 500 }
    )
  }
}

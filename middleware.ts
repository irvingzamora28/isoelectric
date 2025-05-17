import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Check if the path is for the admin panel (starts with /allset)
  if (pathname.startsWith('/allset') && pathname !== '/allset/login') {
    // Check if the user is authenticated
    const authCookie = request.cookies.get('allset_auth')

    // If not authenticated, redirect to login
    if (!authCookie || authCookie.value !== 'true') {
      const url = new URL('/allset/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: ['/allset/:path*'],
}

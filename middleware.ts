import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// List of paths that don't require authentication
const publicPaths = ["/", "/login", "/signup", "/api/auth/login", "/api/auth/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify token
    verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    // Redirect to login if token is invalid
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}


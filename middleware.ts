import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add the Feature-Policy header to allow payment requests
  response.headers.set("Feature-Policy", "payment 'self' https://js.stripe.com")

  // Add the Permissions-Policy header (modern replacement for Feature-Policy)
  response.headers.set("Permissions-Policy", "payment=(self 'https://js.stripe.com')")

  return response
}

export const config = {
  matcher: ["/paywall", "/api/create-subscription"],
}


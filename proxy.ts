import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") return NextResponse.next();
  return NextResponse.redirect(new URL("/gl", request.url));
}

export const config = {
  matcher: ["/"],
};

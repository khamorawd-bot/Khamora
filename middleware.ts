import { NextResponse, type NextRequest } from "next/server";

// Barreira leve: só checa se existe cookie. A validação real da sessão acontece no servidor (lib/auth.ts).
export function middleware(request: NextRequest) {
  if (request.headers.get("x-forwarded-proto") === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && path !== "/admin/login" && !request.cookies.get("sf_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { apiClient } from "@/lib/api-client";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Protect all routes except auth, api, next static, etc.
  if (
    !url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/_next") &&
    !url.pathname.startsWith("/images") &&
    !url.pathname.startsWith("/sign-in") &&
    url.pathname !== "/favicon.ico"
  ) {
    const tokenName = request.cookies.has("__Secure-better-auth.session_token")
      ? "__Secure-better-auth.session_token"
      : "better-auth.session_token";

    const sessionToken = request.cookies.get(tokenName)?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
      const apiUrl = env.NEXT_PUBLIC_API_URL.replace("://localhost:", "://127.0.0.1:");
      const apiRes = await apiClient.get(`${apiUrl}/api/auth/get-session`, {
        headers: {
          Cookie: `${tokenName}=${sessionToken}`,
          "User-Agent": request.headers.get("user-agent") || "NextJs-Proxy",
          Host: new URL(env.NEXT_PUBLIC_API_URL).host,
        },
        validateStatus: () => true, // Do not throw on error statuses
      });

      if (apiRes.status !== 200) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      const session = apiRes.data;

      if (!session?.user || !["admin", "super_admin"].includes(session.user.role)) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    } catch (error) {
      console.error("[PROXY AUTH ERROR]:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|sign-in).*)"],
};

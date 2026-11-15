import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/constants/app";
import { AppRoute, PUBLIC_ROUTES } from "@/constants/routes";
import { verifySessionToken } from "@/lib/session-token";

/**
 * Cek optimistik: halaman butuh sesi valid. Otorisasi sebenarnya
 * tetap dilakukan di setiap route handler (server/http/handler.ts).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const userId = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  if (!userId && !isPublic) {
    return NextResponse.redirect(new URL(AppRoute.Login, req.url));
  }
  if (userId && isPublic) {
    return NextResponse.redirect(new URL(AppRoute.Home, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

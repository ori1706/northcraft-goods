import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function applyCors(req: NextRequest, res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  const reqHeaders = req.headers.get("Access-Control-Request-Headers");
  res.headers.set("Access-Control-Allow-Headers", reqHeaders ?? "Content-Type");
}

export function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    applyCors(req, res);
    return res;
  }
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api")) {
    applyCors(req, res);
  }
  return res;
}

export const config = {
  matcher: "/api/:path*",
};

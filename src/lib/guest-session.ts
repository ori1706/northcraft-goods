import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { GUEST_COOKIE } from "./cart-json";

const YEAR_SEC = 60 * 60 * 24 * 365;

export function guestCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "none";
  path: string;
  maxAge: number;
} {
  const prod = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? "none" : "lax",
    path: "/",
    maxAge: YEAR_SEC,
  };
}

export function setGuestCookie(res: NextResponse, sid: string) {
  res.cookies.set(GUEST_COOKIE, sid, guestCookieOptions());
}

export async function getOrCreateGuestId(res: NextResponse): Promise<string> {
  const jar = await cookies();
  let sid = jar.get(GUEST_COOKIE)?.value;
  if (!sid) {
    sid = uuidv4();
    setGuestCookie(res, sid);
  }
  return sid;
}

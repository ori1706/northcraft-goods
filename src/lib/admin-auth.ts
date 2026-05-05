import { createHmac, timingSafeEqual } from "crypto";

const DAY_MS = 86_400_000;

function signPayload(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function createAdminToken(secret: string): Promise<string> {
  const exp = Date.now() + 7 * DAY_MS;
  const payload = JSON.stringify({ exp });
  const sig = signPayload(secret, payload);
  return Buffer.from(JSON.stringify({ payload, sig }), "utf8").toString("base64url");
}

export async function verifyAdminToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as {
      payload: string;
      sig: string;
    };
    const expected = signPayload(secret, decoded.payload);
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(decoded.sig, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const { exp } = JSON.parse(decoded.payload) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

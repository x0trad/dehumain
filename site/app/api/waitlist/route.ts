import { getDb } from "@/db";
import { waitlistEntries } from "@/db/schema";

const HANDLE = /^[A-Za-z0-9_]{1,15}$/;
const WALLET = /^0x[a-fA-F0-9]{40}$/;

function cardCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `DH-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { xHandle?: string; walletAddress?: string; completed?: boolean; website?: string; openedAt?: number };
    if (payload.website) return Response.json({ ok: true }, { status: 201 });
    if (!payload.completed) return Response.json({ error: "Complete and confirm the X steps first." }, { status: 400 });
    if (!payload.openedAt || Date.now() - payload.openedAt < 2500) return Response.json({ error: "Please review the steps before joining." }, { status: 400 });
    const xHandle = payload.xHandle?.trim().replace(/^@/, "").toLowerCase() ?? "";
    const walletAddress = payload.walletAddress?.trim().toLowerCase() ?? "";
    if (!HANDLE.test(xHandle)) return Response.json({ error: "Enter a valid X username." }, { status: 400 });
    if (!WALLET.test(walletAddress)) return Response.json({ error: "Enter a valid EVM wallet address." }, { status: 400 });
    const code = cardCode();
    await getDb().insert(waitlistEntries).values({ xHandle, walletAddress, cardCode: code, eligibilityStatus: "pending_verification", createdAt: new Date() });
    return Response.json({ ok: true, cardCode: code, xHandle: `@${xHandle}`, status: "pending_verification" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    if (message.includes("UNIQUE constraint failed")) return Response.json({ error: "That X account or wallet is already registered." }, { status: 409 });
    console.error("waitlist submission failed", error);
    return Response.json({ error: "Waitlist is temporarily unavailable. Your details were not submitted." }, { status: 500 });
  }
}

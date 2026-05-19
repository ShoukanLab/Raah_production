import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Resend sends delivery/bounce/complaint events to this endpoint.
// Configure the webhook URL in your Resend dashboard → Webhooks.

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const authHeader = req.headers.get("x-resend-secret");
  if (authHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Type-narrow to access event fields
  const event = payload as { type?: string; data?: unknown };

  switch (event.type) {
    case "email.delivered":
      // TODO: log successful delivery
      console.log("[Resend] email.delivered", event.data);
      break;
    case "email.bounced":
      // TODO: mark customer email as invalid in Supabase
      console.warn("[Resend] email.bounced", event.data);
      break;
    case "email.complained":
      // TODO: suppress future sends
      console.warn("[Resend] email.complained", event.data);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

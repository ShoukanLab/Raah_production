import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export const dynamic = "force-dynamic";

// Sanity calls this endpoint on document publish/unpublish.
// Configure in Sanity → API → Webhooks with secret = SANITY_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string;
      slug?: { current: string };
    }>(req, process.env.SANITY_WEBHOOK_SECRET);

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ error: "Missing _type" }, { status: 400 });
    }

    if (body._type === "show") {
      revalidateTag("shows");
      revalidatePath("/shows");
      if (body.slug?.current) {
        revalidatePath(`/shows/${body.slug.current}`);
      }
    }

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

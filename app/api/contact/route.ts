import { NextRequest, NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/resend";

export const dynamic = "force-dynamic";

interface ContactBody {
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: string;
  message: string;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ success: boolean; error?: string }>> {
  try {
    const body: ContactBody = await req.json();

    if (!body.firstName?.trim()) {
      return NextResponse.json(
        { success: false, error: "First name is required." },
        { status: 400 }
      );
    }

    if (!body.lastName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Last name is required." },
        { status: 400 }
      );
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!body.inquiryType?.trim()) {
      return NextResponse.json(
        { success: false, error: "Please select an inquiry type." },
        { status: 400 }
      );
    }

    if (!body.message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    await sendContactNotification({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      inquiryType: body.inquiryType.trim(),
      message: body.message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(
      "Contact form email failed to send:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

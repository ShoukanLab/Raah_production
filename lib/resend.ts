import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "tickets@raah.production";
export const FROM_NAME = process.env.RESEND_FROM_NAME ?? "Raah Production";
export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;

// ─── Email helpers ────────────────────────────────────────────────────────────

export interface OrderConfirmationData {
  to: string;
  customerName: string;
  orderNumber: string;
  showName: string;
  showDate: string;
  venue: string;
  ticketCount: number;
  totalAmount: string;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Your tickets for ${data.showName} — Order #${data.orderNumber}`,
    html: buildOrderConfirmationHtml(data),
  });
}

function buildOrderConfirmationHtml(data: OrderConfirmationData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Order Confirmation</title>
      </head>
      <body style="background:#0A0A0A;color:#E8D5B0;font-family:Georgia,serif;padding:40px 20px;">
        <div style="max-width:600px;margin:0 auto;">
          <h1 style="color:#C9A96E;font-size:2rem;margin-bottom:4px;">Raah Production</h1>
          <hr style="border:none;border-top:1px solid #C9A96E;margin:16px 0;" />
          <h2 style="font-size:1.25rem;font-weight:400;">Order Confirmed</h2>
          <p>Hello ${data.customerName},</p>
          <p>Your tickets for <strong style="color:#C9A96E;">${data.showName}</strong> are confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#C9A96E;">Order</td>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">#${data.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#C9A96E;">Show</td>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.showName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#C9A96E;">Date</td>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.showDate}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#C9A96E;">Venue</td>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.venue}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#C9A96E;">Tickets</td>
              <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;text-align:right;">${data.ticketCount}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#C9A96E;font-weight:bold;">Total</td>
              <td style="padding:8px 0;text-align:right;font-weight:bold;">${data.totalAmount}</td>
            </tr>
          </table>
          <p style="color:#E8D5B0;opacity:0.6;font-size:0.875rem;">
            Your tickets will be sent separately closer to the event date.
            If you have any questions, reply to this email.
          </p>
          <hr style="border:none;border-top:1px solid #1A1A1A;margin:24px 0;" />
          <p style="color:#E8D5B0;opacity:0.4;font-size:0.75rem;text-align:center;">
            Raah Production &bull; Premium Live Music Experiences
          </p>
        </div>
      </body>
    </html>
  `;
}

// ─── Contact form notifications ─────────────────────────────────────────────────

export const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? FROM_EMAIL;

export interface ContactNotificationData {
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: string;
  message: string;
}

export async function sendContactNotification(data: ContactNotificationData) {
  return resend.emails.send({
    from: FROM,
    to: CONTACT_TO_EMAIL,
    reply_to: data.email,
    subject: `[Contact] ${data.inquiryType} — ${data.firstName} ${data.lastName}`,
    html: buildContactNotificationHtml(data),
  });
}

function buildContactNotificationHtml(data: ContactNotificationData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Contact Form Submission</title>
      </head>
      <body style="background:#0A0A0A;color:#E8D5B0;font-family:Georgia,serif;padding:40px 20px;">
        <div style="max-width:600px;margin:0 auto;">
          <h1 style="color:#C9A96E;font-size:2rem;margin-bottom:4px;">New Contact Form Submission</h1>
          <hr style="border:none;border-top:1px solid #C9A96E;margin:16px 0;" />
          <p><strong style="color:#C9A96E;">From:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong style="color:#C9A96E;">Email:</strong> <a href="mailto:${data.email}" style="color:#E8D5B0;">${data.email}</a></p>
          <p><strong style="color:#C9A96E;">Inquiry Type:</strong> ${data.inquiryType}</p>
          <hr style="border:none;border-top:1px solid #1A1A1A;margin:24px 0;" />
          <h3 style="color:#C9A96E;font-weight:400;">Message</h3>
          <p style="white-space:pre-wrap;line-height:1.6;">${data.message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          <hr style="border:none;border-top:1px solid #1A1A1A;margin:24px 0;" />
          <p style="color:#E8D5B0;opacity:0.4;font-size:0.75rem;text-align:center;">
            Raah Production Contact Form
          </p>
        </div>
      </body>
    </html>
  `;
}

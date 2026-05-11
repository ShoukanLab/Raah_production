import { TicketConfirmation } from "@/emails/TicketConfirmation";
import { resend, FROM } from "@/lib/resend";
import { createServiceRoleClient } from "@/lib/supabase/server";

interface OrderWithDetails {
  orderId: string;
  customerEmail: string;
  customerName: string;
  showName: string;
  showDate: string;
  showTime: string;
  venue: string;
  ticketType: string;
  ticketQuantity: number;
  totalAmount: string;
}

async function fetchOrderDetails(orderId: string): Promise<OrderWithDetails | null> {
  const supabase = createServiceRoleClient();
  const { data: supabaseData } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      customers (id, email, first_name, last_name),
      shows (id, name, date, venue),
      order_items (
        quantity,
        price_at_purchase,
        ticket_types (id, name)
      )
    `
    )
    .eq("id", orderId)
    .single() as any;

  if (!supabaseData) {
    return null;
  }

  const customer = supabaseData.customers as any;
  const show = supabaseData.shows as any;
  const orderItems = supabaseData.order_items as any[];

  if (!customer || !show || !orderItems || orderItems.length === 0) {
    return null;
  }

  const firstItem = orderItems[0];
  const ticketType = firstItem.ticket_types as any;
  const totalAmount = orderItems
    .reduce((sum, item) => sum + Number(item.price_at_purchase) * item.quantity, 0)
    .toFixed(2);

  const showDateObj = new Date(show.date);
  const formattedDate = showDateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = showDateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const customerName = customer.first_name
    ? `${customer.first_name} ${customer.last_name || ""}`.trim()
    : customer.email;

  return {
    orderId,
    customerEmail: customer.email,
    customerName,
    showName: show.name,
    showDate: formattedDate,
    showTime: formattedTime,
    venue: show.venue,
    ticketType: ticketType.name,
    ticketQuantity: firstItem.quantity,
    totalAmount: `$${totalAmount} CAD`,
  };
}

export async function sendConfirmation(orderId: string): Promise<any> {
  try {
    const orderDetails = await fetchOrderDetails(orderId);

    if (!orderDetails) {
      throw new Error(`Order ${orderId} not found or incomplete`);
    }

    const calendarUrl = createGoogleCalendarUrl({
      title: orderDetails.showName,
      date: orderDetails.showDate,
      time: orderDetails.showTime,
      venue: orderDetails.venue,
    });

    return resend.emails.send({
      from: FROM,
      to: orderDetails.customerEmail,
      subject: `Your tickets for ${orderDetails.showName} — Order #${orderId}`,
      react: (
        <TicketConfirmation
          customerName={orderDetails.customerName}
          orderNumber={orderId}
          showName={orderDetails.showName}
          showDate={orderDetails.showDate}
          showTime={orderDetails.showTime}
          venue={orderDetails.venue}
          ticketType={orderDetails.ticketType}
          ticketQuantity={orderDetails.ticketQuantity}
          totalAmount={orderDetails.totalAmount}
          calendarUrl={calendarUrl}
        />
      ),
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    throw error;
  }
}

function createGoogleCalendarUrl({
  title,
  date,
  time,
  venue,
}: {
  title: string;
  date: string;
  time: string;
  venue: string;
}): string {
  const baseUrl = "https://calendar.google.com/calendar/render";
  const eventTitle = encodeURIComponent(title);
  const eventDetails = encodeURIComponent(`${title}\nVenue: ${venue}`);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle,
    details: eventDetails,
  });

  return `${baseUrl}?${params.toString()}`;
}

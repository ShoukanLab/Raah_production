import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface TicketConfirmationProps {
  customerName: string;
  orderNumber: string;
  showName: string;
  showDate: string;
  showTime: string;
  venue: string;
  ticketType: string;
  ticketQuantity: number;
  totalAmount: string;
  calendarUrl: string;
}

export function TicketConfirmation({
  customerName,
  orderNumber,
  showName,
  showDate,
  showTime,
  venue,
  ticketType,
  ticketQuantity,
  totalAmount,
  calendarUrl,
}: TicketConfirmationProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://raahproduction.ca";

  return (
    <Html>
      <Head />
      <Preview>Your tickets for {showName} are confirmed</Preview>
      <Body
        style={{
          backgroundColor: "#0A0A0A",
          color: "#E8D5B0",
          fontFamily: "Georgia, serif",
          padding: "40px 20px",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Header */}
          <Section style={{ marginBottom: "24px" }}>
            <Text
              style={{
                fontSize: "2rem",
                color: "#C9A96E",
                margin: "0 0 8px 0",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Raah Production
            </Text>
            <Hr
              style={{
                borderTop: "1px solid #C9A96E",
                margin: "16px 0",
              }}
            />
          </Section>

          {/* Main Heading */}
          <Section style={{ marginBottom: "32px" }}>
            <Text
              style={{
                fontSize: "1.5rem",
                color: "#FFFFFF",
                margin: "0 0 12px 0",
                fontWeight: "400",
              }}
            >
              Your Tickets Are Confirmed
            </Text>
            <Text style={{ margin: "0", lineHeight: "1.6" }}>
              Hello {customerName},
            </Text>
            <Text style={{ margin: "8px 0 0 0", lineHeight: "1.6" }}>
              Your tickets for <strong style={{ color: "#C9A96E" }}>{showName}</strong> are
              confirmed. We look forward to seeing you at the show!
            </Text>
          </Section>

          {/* Order Details Table */}
          <Section
            style={{
              marginBottom: "32px",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <Row style={{ borderBottom: "1px solid #1A1A1A" }}>
              <Text
                style={{
                  padding: "12px 0",
                  color: "#C9A96E",
                  margin: "0",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Order Reference
              </Text>
              <Text
                style={{
                  padding: "12px 0",
                  textAlign: "right",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                #{orderNumber}
              </Text>
            </Row>

            <Row style={{ borderBottom: "1px solid #1A1A1A" }}>
              <Text
                style={{
                  padding: "12px 0",
                  color: "#C9A96E",
                  margin: "0",
                  fontSize: "0.875rem",
                }}
              >
                Event
              </Text>
              <Text style={{ padding: "12px 0", textAlign: "right", margin: "0" }}>
                {showName}
              </Text>
            </Row>

            <Row style={{ borderBottom: "1px solid #1A1A1A" }}>
              <Text
                style={{
                  padding: "12px 0",
                  color: "#C9A96E",
                  margin: "0",
                  fontSize: "0.875rem",
                }}
              >
                Date
              </Text>
              <Text style={{ padding: "12px 0", textAlign: "right", margin: "0" }}>
                {showDate} at {showTime}
              </Text>
            </Row>

            <Row style={{ borderBottom: "1px solid #1A1A1A" }}>
              <Text
                style={{
                  padding: "12px 0",
                  color: "#C9A96E",
                  margin: "0",
                  fontSize: "0.875rem",
                }}
              >
                Venue
              </Text>
              <Text style={{ padding: "12px 0", textAlign: "right", margin: "0" }}>
                {venue}
              </Text>
            </Row>

            <Row style={{ borderBottom: "1px solid #1A1A1A" }}>
              <Text
                style={{
                  padding: "12px 0",
                  color: "#C9A96E",
                  margin: "0",
                  fontSize: "0.875rem",
                }}
              >
                Ticket Type
              </Text>
              <Text style={{ padding: "12px 0", textAlign: "right", margin: "0" }}>
                {ticketType}
              </Text>
            </Row>

            <Row style={{ borderBottom: "1px solid #1A1A1A" }}>
              <Text
                style={{
                  padding: "12px 0",
                  color: "#C9A96E",
                  margin: "0",
                  fontSize: "0.875rem",
                }}
              >
                Quantity
              </Text>
              <Text style={{ padding: "12px 0", textAlign: "right", margin: "0" }}>
                {ticketQuantity}
              </Text>
            </Row>

            <Row>
              <Text
                style={{
                  padding: "12px 0",
                  color: "#C9A96E",
                  margin: "0",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  padding: "12px 0",
                  textAlign: "right",
                  margin: "0",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {totalAmount}
              </Text>
            </Row>
          </Section>

          {/* Add to Calendar Button */}
          <Section style={{ marginBottom: "32px", textAlign: "center" }}>
            <Button
              href={calendarUrl}
              style={{
                backgroundColor: "#C9A96E",
                color: "#0A0A0A",
                padding: "12px 24px",
                borderRadius: "2px",
                fontSize: "0.875rem",
                fontWeight: "600",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add to Calendar
            </Button>
          </Section>

          {/* Info Text */}
          <Section style={{ marginBottom: "32px" }}>
            <Text
              style={{
                fontSize: "0.875rem",
                color: "#E8D5B0",
                opacity: 0.6,
                lineHeight: "1.6",
                margin: "0",
              }}
            >
              Your tickets will be sent separately closer to the event date. Arrive early to
              allow time for check-in. If you have any questions, please visit our website or
              reply to this email.
            </Text>
          </Section>

          {/* Divider */}
          <Hr
            style={{
              borderTop: "1px solid #1A1A1A",
              margin: "24px 0",
            }}
          />

          {/* Footer */}
          <Section style={{ marginBottom: "0", textAlign: "center" }}>
            <Text
              style={{
                fontSize: "0.75rem",
                color: "#E8D5B0",
                opacity: 0.4,
                margin: "0",
              }}
            >
              Raah Production • Premium Live Music Experiences
            </Text>
            <Text
              style={{
                fontSize: "0.75rem",
                color: "#E8D5B0",
                opacity: 0.4,
                margin: "4px 0 0 0",
              }}
            >
              <Link href={baseUrl} style={{ color: "#C9A96E", textDecoration: "underline" }}>
                raahproduction.ca
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

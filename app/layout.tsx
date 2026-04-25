import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Raah Production",
    template: "%s | Raah Production",
  },
  description:
    "Premium live music experiences. Discover upcoming shows, secure your tickets, and lose yourself in the sound.",
  keywords: ["live music", "concerts", "shows", "tickets", "Raah Production"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Raah Production",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-void text-champagne">
        {children}
      </body>
    </html>
  );
}

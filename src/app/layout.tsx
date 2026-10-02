import type { Metadata } from "next";
import "./globals.css";
import { SalonProvider } from "@/context/SalonContext";

export const metadata: Metadata = {
  title: "Baraka | Modern Barbershop Management & Online Booking",
  description:
    "The modern operating platform for premier barbershops. Manage appointments, barbers, services, and seamless instant customer bookings.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0F17] text-slate-100 antialiased selection:bg-brand-500 selection:text-black">
        <SalonProvider>{children}</SalonProvider>
      </body>
    </html>
  );
}

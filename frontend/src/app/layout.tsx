// UI shared between routes
import type { Metadata } from "next";
import "./globals.css";
// self-host google font, served from deployment domain, not per request
import { Inter } from "next/font/google";

// only consider or include the Latin subset of characters
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "rememberry",
  description: "rememberry",
};

// top-most layout, defines globally shared UI

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* children prop refers to the page component that the client sees atm */}
      <body className={`${inter.className}`}>{children}</body>
      {/* condition needed to check the authentication status */}
    </html>
  );
}

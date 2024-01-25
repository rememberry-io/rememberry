// UI shared between routes
import "./globals.css";
// self-host google font, served from deployment domain, not per request
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import TestGetUser from "./testcomponents/TestGetUser"
import { Suspense } from "react";
import Loading from "./loading";

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
      <body className={`${inter.className}`}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
      </body>
      {/* condition needed to check the authentication status */}
    </html>
  );
}

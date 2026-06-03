import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAKTAVA | AI-Powered Blood Intelligence Platform",
  description: "RAKTAVA is an intelligent blood management and patient support platform that leverages AI, clinical rules, and healthcare analytics to improve blood availability, patient prioritization, and medical decision support.",
  keywords: [
    "Blood Management",
    "Blood Bank",
    "Healthcare AI",
    "Medical Intelligence",
    "Patient Support",
    "Clinical Analytics",
    "RAKTAVA"
  ]
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


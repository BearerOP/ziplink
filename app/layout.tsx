"use client"

import type React from "react"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/components/wallet-context"
import { Toaster } from "sonner"
import { GoogleOAuthProvider } from "@react-oauth/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

// Google OAuth Client ID - get from Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&display=swap" />
      </head>
      <body className="font-sans antialiased">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <WalletProvider>
            {children}
            <Toaster richColors closeButton position="bottom-right" />
          </WalletProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}

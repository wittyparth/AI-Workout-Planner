import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "sonner"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "FitFlow AI - Professional Fitness Companion",
  description: "Professional AI-powered fitness experience with advanced workout tracking and analytics",
  generator: "v0.app",
  keywords: ["fitness", "AI", "professional", "workout", "health", "analytics"],
  authors: [{ name: "FitFlow AI Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5E6AD2" },
    { media: "(prefers-color-scheme: dark)", color: "#6366F1" },
  ],
  openGraph: {
    title: "FitFlow AI - Professional Fitness Companion",
    description: "Professional AI-powered fitness experience",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`font-body ${inter.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/20`}
      >
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="spinner-linear w-8 h-8"></div>
          </div>
        }>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </ThemeProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
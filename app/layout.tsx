import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "FitScore - Sistema de Avaliação Profissional",
  description: "Sistema profissional de avaliação de compatibilidade cultural e técnica para processos seletivos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <body suppressHydrationWarning className="font-sans bg-background text-foreground">{children}</body>
    </html>
  )
}

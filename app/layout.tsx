import type { Metadata } from "next"
import "./globals.css"
import type React from "react"
import { AnimatePresence } from "framer-motion"

export const metadata: Metadata = {
  title: "Talkie App",
  description: "Traduza conversas em tempo real",
  icons: [
    {
      rel: "preload",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1055-MCM8ubEejbZlb0DZCzjMc6zAV5Aj5z.jpeg",
      as: "image",
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </body>
    </html>
  )
}


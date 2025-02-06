"use client"

import { useEffect, useState } from "react"
import { Camera, MessageSquare, Mic } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import React from "react"
import { Popup } from "./Popup"

// Avatar Component
function Avatar({ letter }: { letter: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-[#6E56CF] text-white flex items-center justify-center font-medium text-base">
      {letter}
    </div>
  )
}

// FeatureCard Component
function FeatureCard({ action, title, description, icon }: any) {
  return (
    <motion.button
      className="w-full h-[80px] bg-white border border-[#E5E7EB] rounded-2xl flex items-center gap-3 hover:shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition-shadow duration-200"
      onClick={action}
      whileTap={{ scale: 0.98 }}
    >
      <div className="ml-4 w-[56px] h-[56px] rounded-xl bg-[#F4F1FF] flex items-center justify-center flex-shrink-0">
        {React.cloneElement(icon, { className: "h-[20px] w-[20px] text-[#6E56CF]" })}
      </div>
      <div className="flex-grow text-left pr-4">
        <h3 className="text-[18px] font-semibold mb-0.5 text-black">{title}</h3>
        <p className="text-[15px] text-[#6B7280]">{description}</p>
      </div>
    </motion.button>
  )
}

// Header Component
function Header({ userInitial }: { userInitial: string }) {
  const router = useRouter()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-between items-center px-4 py-3 bg-[#FAFAFA] border-b border-[#F3F4F6]"
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-talkie-QvhaSsqHqZpYOw8VvR9meXGRg85PMw.svg"
        alt="Talkie Logo"
        width={140}
        height={44}
        priority
        className="w-auto h-8"
      />
      <button onClick={() => router.push("/paywall")}>
        <Avatar letter={userInitial} />
      </button>
    </motion.header>
  )
}

// Main Home Component
export default function Home() {
  const router = useRouter()
  const [userInitial, setUserInitial] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const userName = localStorage.getItem("userName") || ""
    setUserInitial(userName.charAt(0).toUpperCase())
  }, [])

  const cards = [
    {
      icon: <Mic className="h-6 w-6 text-[#6E56CF]" />,
      title: "Tradutor de voz",
      description: "Traduza conversas em tempo real",
      url: "/transcription",
    },
    {
      icon: <Camera className="h-6 w-6 text-[#6E56CF]" />,
      title: "Tradutor de imagens",
      description: "Traduza texto de imagens",
      url: "/image",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-[#6E56CF]" />,
      title: "Tradutor de texto",
      description: "Traduza textos em geral",
      url: "/chat",
    },
  ]

  const handleCardClick = () => {
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setTimeout(() => {
      router.push("/paywall")
    }, 300) // Pequeno atraso para a animação de fechamento do popup
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sf-pro">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]">
        <Header userInitial={userInitial} />
      </div>

      <main className="flex-1 px-4 pt-[68px] pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-[28px] font-bold text-black mb-1">Escolha uma opção para começar</h1>
          <p className="text-[16px] text-[#6B7280]">Tradução de voz, imagem e texto</p>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <FeatureCard
                action={handleCardClick}
                title={card.title}
                description={card.description}
                icon={card.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 py-5 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent"
      >
        <p className="text-center text-[14px] text-[#6B7280]">Feito com ❤️ em Boston</p>
      </motion.footer>

      <Popup message="Para usar o app é necessário assinar um plano" isVisible={showPopup} onClose={handleClosePopup} />
    </div>
  )
}


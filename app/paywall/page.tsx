"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"
import { typography } from "@/styles/typography"
import { motion, AnimatePresence } from "framer-motion"
import StripePaymentDrawer from "@/components/StripePaymentDrawer"

export default function Paywall() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isOpen, setIsOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const monthlyPrice = 20
  const yearlyPrice = 200
  const yearlyMonthlyEquivalent = yearlyPrice / 12
  const yearlyDiscount = 40

  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty("--app-height", `${window.innerHeight}px`)
    }
    setAppHeight()
    window.addEventListener("resize", setAppHeight)
    return () => window.removeEventListener("resize", setAppHeight)
  }, [])

  useEffect(() => {
    setIsOpen(true)
  }, [])

  const handleUpgrade = () => {
    setIsDrawerOpen(true)
  }

  const handleBillingCycleChange = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-b from-[#F4F1FF] via-[#FAFAFA] to-[#FAFAFA] text-gray-900 overflow-hidden flex flex-col"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
        >
          <div className="flex-1 overflow-auto pb-[120px]">
            <div className="min-h-full flex flex-col">
              <div className="absolute top-4 left-4 z-20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-talkie-QvhaSsqHqZpYOw8VvR9meXGRg85PMw.svg"
                  alt="Talkie Logo"
                  width={150}
                  height={48}
                  priority
                  className="w-auto h-10"
                />
              </div>

              <div className="relative h-72 w-full flex-shrink-0 overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1055-MCM8ubEejbZlb0DZCzjMc6zAV5Aj5z.jpeg"
                  alt="Pessoa sorridente usando aplicativo de áudio"
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                  priority
                  className="filter brightness-105 contrast-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#F4F1FF] via-transparent to-transparent"
                  style={{ height: "20%" }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent"
                  style={{ top: "70%" }}
                />
              </div>

              <main className="flex-1 px-4 -mt-32 relative z-10">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-100 rounded-full p-1 flex gap-2 shadow-lg">
                    <button
                      onClick={() => handleBillingCycleChange("yearly")}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        billingCycle === "yearly" ? "bg-[#6E56CF] text-white" : "text-gray-600"
                      }`}
                    >
                      Anual -$40
                    </button>
                    <button
                      onClick={() => handleBillingCycleChange("monthly")}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        billingCycle === "monthly" ? "bg-[#6E56CF] text-white" : "text-gray-600"
                      }`}
                    >
                      Mensal
                    </button>
                  </div>
                </div>

                <h1 className={typography.h1}>Escolha um plano</h1>

                <p className="text-xl text-center mb-8">
                  <span className="text-gray-600">
                    <span className="text-3xl font-semibold text-[#6E56CF]">
                      ${billingCycle === "monthly" ? monthlyPrice.toFixed(2) : yearlyMonthlyEquivalent.toFixed(2)}
                    </span>{" "}
                    por mês
                  </span>
                  {billingCycle === "yearly" ? (
                    <span className="block text-sm mt-1 text-gray-500">
                      Cobrado anualmente como{" "}
                      <span className="text-[#6E56CF] font-medium">${yearlyPrice.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span className="block text-sm mt-1 text-gray-500">Cancele quando quiser</span>
                  )}
                </p>

                <div className="space-y-6 mb-8">
                  <Feature text="Traduza conversas em tempo real" />
                  <Feature text="Capture e traduza textos em imagens" />
                  <Feature text="Tradução ilimitada em mais de 30 idiomas" />
                  <Feature text="Experiência premium sem anúncios" />
                </div>
              </main>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 px-4 pb-[21px] pt-5 bg-transparent">
            <div className="bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent absolute inset-0 z-0"></div>
            <div className="relative z-10">
              <Button
                onClick={handleUpgrade}
                disabled={isLoading}
                className={`w-full h-12 bg-[#6E56CF] hover:bg-[#6E56CF]/90 text-white rounded-xl ${typography.button}`}
              >
                {isLoading
                  ? "Processando..."
                  : billingCycle === "monthly"
                    ? "Começar plano mensal"
                    : "Começar plano anual"}
              </Button>
              <p className={typography.disclaimer}>Cancele a qualquer momento. Sem compromisso.</p>
            </div>
          </div>
        </motion.div>
      )}
      <StripePaymentDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} planType={billingCycle} />
    </AnimatePresence>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-600">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6E56CF] flex items-center justify-center">
        <Check className="w-3 h-3 text-white" />
      </div>
      <span>{text}</span>
    </div>
  )
}


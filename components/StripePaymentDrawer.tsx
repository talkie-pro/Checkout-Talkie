"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { motion, AnimatePresence } from "framer-motion"
import { typography } from "@/styles/typography"
import { X } from "lucide-react"
import SubscriptionForm from "./SubscriptionForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentDrawerProps {
  isOpen: boolean
  onClose: () => void
  planType: "monthly" | "yearly"
}

export default function StripePaymentDrawer({ isOpen, onClose, planType }: StripePaymentDrawerProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubscriptionSuccess = (subscriptionId: string, customerId: string) => {
    console.log(`Assinatura criada com sucesso. ID: ${subscriptionId}, ID do Cliente: ${customerId}`)
    // Aqui você pode adicionar lógica adicional, como salvar informações no localStorage
    // ou redirecionar para uma página de sucesso
    alert("Assinatura criada com sucesso! Redirecionando para o aplicativo principal...")
    // window.location.href = "https://seu-app-principal.com/login"
  }

  if (!isMounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-drawer-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 relative">
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-4 right-4 bg-gray-200 rounded-full p-1.5 text-gray-600 hover:bg-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 id="payment-drawer-title" className={`${typography.h2} text-xl font-bold mb-6 pr-12`}>
                Complete sua assinatura do Talkie Pro
              </h2>
              <Elements stripe={stripePromise}>
                <SubscriptionForm planType={planType} onSubscriptionSuccess={handleSubscriptionSuccess} />
              </Elements>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


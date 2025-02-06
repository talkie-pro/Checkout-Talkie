"use client"

import { useEffect, useState } from "react"

export default function StripeEnvCheck() {
  const [envStatus, setEnvStatus] = useState({
    publishableKey: false,
    secretKey: false,
    monthlyPriceId: false,
    yearlyPriceId: false,
  })

  useEffect(() => {
    setEnvStatus({
      publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: false, // Não podemos verificar a chave secreta no cliente
      monthlyPriceId: !!process.env.STRIPE_MONTHLY_PRICE_ID,
      yearlyPriceId: !!process.env.STRIPE_YEARLY_PRICE_ID,
    })
  }, [])

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Verificação das Variáveis de Ambiente do Stripe</h2>
      <ul>
        <li>Publishable Key: {envStatus.publishableKey ? "✅" : "❌"}</li>
        <li>Secret Key: {envStatus.secretKey ? "✅" : "❓"} (verificável apenas no servidor)</li>
        <li>Monthly Price ID: {envStatus.monthlyPriceId ? "✅" : "❌"}</li>
        <li>Yearly Price ID: {envStatus.yearlyPriceId ? "✅" : "❌"}</li>
      </ul>
    </div>
  )
}


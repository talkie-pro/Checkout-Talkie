import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export async function POST(request: Request) {
  const { planType } = await request.json()

  try {
    const amount = planType === "monthly" ? 2000 : 20000 // $20 for monthly, $200 for yearly

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    })

    if (paymentIntent.client_secret) {
      return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } else {
      throw new Error("Failed to create PaymentIntent")
    }
  } catch (error) {
    console.error("Error creating PaymentIntent:", error)
    return NextResponse.json({ error: "Error creating PaymentIntent" }, { status: 500 })
  }
}


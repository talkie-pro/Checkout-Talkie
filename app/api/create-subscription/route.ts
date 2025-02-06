import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export async function POST(request: Request) {
  const { name, email, planType, paymentMethodId, zipCode } = await request.json()

  let customer: Stripe.Customer | null = null

  try {
    // Criar um novo cliente Stripe
    customer = await stripe.customers.create({
      name,
      email,
      payment_method: paymentMethodId,
      address: {
        postal_code: zipCode,
      },
    })

    // Determinar o priceId com base no planType
    const priceId = planType === "monthly" ? process.env.STRIPE_MONTHLY_PRICE_ID : process.env.STRIPE_YEARLY_PRICE_ID

    if (!priceId) {
      throw new Error("Price ID não configurado")
    }

    // Criar uma assinatura para o cliente
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ["latest_invoice.payment_intent"],
    })

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        customerId: customer.id,
      })
    } else {
      // Se o pagamento não foi bem-sucedido, deletamos o cliente
      if (customer) {
        await stripe.customers.del(customer.id)
      }
      throw new Error("Falha ao processar o pagamento")
    }
  } catch (error) {
    // Se ocorrer qualquer erro durante o processo, tentamos deletar o cliente
    if (customer) {
      try {
        await stripe.customers.del(customer.id)
      } catch (deleteError) {
        console.error("Erro ao deletar cliente após falha:", deleteError)
      }
    }
    console.error("Erro ao criar assinatura:", error)
    return NextResponse.json({ error: "Erro ao criar assinatura" }, { status: 500 })
  }
}


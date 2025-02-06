import { useState, useEffect } from "react"
import { PaymentRequestButtonElement, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { typography } from "@/styles/typography"

interface SubscriptionFormProps {
  planType: "monthly" | "yearly"
  onSubscriptionSuccess: (subscriptionId: string, customerId: string) => void
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ planType, onSubscriptionSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentRequest, setPaymentRequest] = useState<any>(null)

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: `Talkie Pro ${planType === "monthly" ? "Mensal" : "Anual"}`,
          amount: planType === "monthly" ? 2000 : 20000,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr)
        }
      })
    }
  }, [stripe, planType])

  const handleSubscriptionCreation = async (paymentMethodId: string) => {
    const name = localStorage.getItem("userName") || ""
    const email = localStorage.getItem("userEmail") || ""

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          planType,
          paymentMethodId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onSubscriptionSuccess(data.subscriptionId, data.customerId)
        return { error: null }
      } else {
        return { error: new Error(data.error || "Erro ao criar assinatura") }
      }
    } catch (error) {
      return { error }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    if (!stripe || !elements) {
      setIsLoading(false)
      return
    }

    const name = localStorage.getItem("userName") || ""
    const email = localStorage.getItem("userEmail") || ""

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setErrorMessage("Erro ao processar o cartão")
      setIsLoading(false)
      return
    }

    const billingDetails = {
      name,
      email,
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: billingDetails,
    })

    if (error) {
      setErrorMessage(error.message ?? "Erro ao processar o pagamento")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          planType,
          paymentMethodId: paymentMethod.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onSubscriptionSuccess(data.subscriptionId, data.customerId)
      } else {
        throw new Error(data.error || "Erro ao criar assinatura")
      }
    } catch (error) {
      setErrorMessage((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const cardElementStyle = {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  }

  const cardElementOptions = {
    style: cardElementStyle,
    hidePostalCode: true,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {paymentRequest && (
        <div className="mb-4">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: "subscribe",
                  theme: "dark",
                  height: "48px",
                },
              },
            }}
            onClick={(event) => {
              event.preventDefault()
              paymentRequest.on("paymentmethod", async (ev) => {
                // Aqui você pode lidar com o método de pagamento selecionado
                // Por exemplo, chamar sua API para criar a assinatura
                const { error } = await handleSubscriptionCreation(ev.paymentMethod.id)
                if (error) {
                  ev.complete("fail")
                } else {
                  ev.complete("success")
                  // Redirecionar ou mostrar mensagem de sucesso
                }
              })
            }}
          />
          <p className="text-sm text-gray-600 mt-2">Ou pague com cartão de crédito abaixo</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">
            Número do Cartão, Data de Expiração e CVC
          </label>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-300">
            <CardElement id="card-element" options={cardElementOptions} />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Ao confirmar sua assinatura, você permite que o Talkie Pro cobre você por pagamentos futuros de acordo com os
        termos da empresa. Você pode cancelar sua assinatura a qualquer momento.
      </p>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full h-12 bg-[#6E56CF] hover:bg-[#6E56CF]/90 text-white rounded-xl ${typography.button}`}
      >
        {isLoading ? "Processando..." : `Assinar plano ${planType === "monthly" ? "mensal" : "anual"}`}
      </Button>

      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </form>
  )
}

export default SubscriptionForm


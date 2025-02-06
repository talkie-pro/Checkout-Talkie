import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { typography } from "@/styles/typography"

interface CheckoutFormProps {
  onPaymentSuccess: () => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/subscription-success",
      },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message ?? "Ocorreu um erro ao processar o pagamento")
      setIsLoading(false)
    } else {
      // Pagamento bem-sucedido
      onPaymentSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full h-12 bg-[#6E56CF] hover:bg-[#6E56CF]/90 text-white rounded-xl ${typography.button}`}
      >
        {isLoading ? "Processando..." : "Confirmar assinatura"}
      </Button>
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </form>
  )
}

export default CheckoutForm


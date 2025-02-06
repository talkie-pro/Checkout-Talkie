import Register from "@/components/Register"
import StripeEnvCheck from "@/components/StripeEnvCheck"

export default function Page() {
  return (
    <>
      <Register />
      <StripeEnvCheck />
    </>
  )
}


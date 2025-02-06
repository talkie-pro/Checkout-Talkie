"use client"

import { type FormEvent, useCallback, useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { typography } from "@/styles/typography"
import { Loader } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideIn = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

export default function Register() {
  const router = useRouter()

  const [nameInputValue, setNameInputValue] = useState("")
  const [emailInputValue, setEmailInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty("--app-height", `${window.innerHeight}px`)
    }
    setAppHeight()
    window.addEventListener("resize", setAppHeight)
    return () => window.removeEventListener("resize", setAppHeight)
  }, [])

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)
      localStorage.setItem("userName", nameInputValue)
      localStorage.setItem("userEmail", emailInputValue)

      // Simula um delay para mostrar a animação
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push("/home")
    },
    [nameInputValue, emailInputValue, router],
  )

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#F4F1FF] via-[#FAFAFA] to-[#FAFAFA] text-gray-900 overflow-hidden flex flex-col font-sf-pro">
      {/* Scrollable content */}
      <div className="flex-1 overflow-auto pb-[120px]">
        <div className="min-h-full flex flex-col">
          {/* Logo */}
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

          {/* Hero Image with gradient mask */}
          <div className="relative h-72 w-full flex-shrink-0 overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1055-MCM8ubEejbZlb0DZCzjMc6zAV5Aj5z.jpeg"
              alt="Pessoa sorridente usando aplicativo de áudio"
              layout="fill"
              objectFit="cover"
              quality={100}
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
            <motion.div
              key="register"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              className="text-center"
            >
              <motion.div variants={slideIn} className="space-y-1 mt-12">
                <h1 className={typography.h1}>Criar conta</h1>
                <p className={typography.subtitle}>Preencha os campos abaixo</p>
              </motion.div>

              <motion.form className="mt-6 space-y-4" onSubmit={handleSubmit} variants={slideIn}>
                <CustomInput
                  type="text"
                  placeholder="Nome"
                  value={nameInputValue}
                  onChange={(e) => setNameInputValue(e.target.value)}
                  required
                />
                <CustomInput
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={emailInputValue}
                  onChange={(e) => setEmailInputValue(e.target.value)}
                  required
                />
                <div className="pt-8">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-12 bg-[#6E56CF] hover:bg-[#6E56CF]/90 text-white rounded-xl ${typography.button} relative`}
                  >
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Loader className="w-6 h-6 animate-spin" />
                      </motion.div>
                    ) : (
                      "Criar minha conta agora"
                    )}
                  </Button>
                </div>
                <p className={typography.disclaimer}>
                  Seus dados estão protegidos. Ao criar uma conta, você concorda com nossos Termos de Serviço e Política
                  de Privacidade.
                </p>
              </motion.form>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}


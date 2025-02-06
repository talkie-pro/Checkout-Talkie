import { motion, AnimatePresence } from "framer-motion"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentErrorPopupProps {
  isVisible: boolean
  onClose: () => void
  errorMessage: string
}

export function PaymentErrorPopup({ isVisible, onClose, errorMessage }: PaymentErrorPopupProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[20px] p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Erro no Pagamento</h3>
              <p className="text-center text-gray-700 font-medium mb-6">{errorMessage}</p>
              <Button
                onClick={onClose}
                className="w-full bg-[#6E56CF] hover:bg-[#5B46B0] text-white font-semibold rounded-[14px] h-12"
              >
                Entendi, vou tentar novamente
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


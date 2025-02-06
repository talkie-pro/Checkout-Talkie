import { motion, AnimatePresence } from "framer-motion"

interface ToastProps {
  message: string
  isVisible: boolean
}

export function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 bg-[#6E56CF] text-white py-2 px-4 rounded-lg shadow-lg z-50"
        >
          <p className="text-center text-sm">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "h-12 px-4 rounded-xl border border-gray-200 w-full",
        "focus:outline-none focus:border-[#6E56CF] focus:ring-0",
        "transition-colors duration-200",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

CustomInput.displayName = "CustomInput"

export { CustomInput }


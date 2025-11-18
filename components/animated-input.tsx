"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-[#2a2e45] bg-[#1a1e32] px-3 py-2 text-sm text-white transition-colors",
            "placeholder:text-gray-400",
            "hover:border-[#9575ff]/50",
            "focus:border-[#9575ff] focus:outline-none focus:ring-0",
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)


"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

// Update to use motion.create() instead of deprecated motion()
const MotionButton = motion.create(Button)

export interface AnimatedButtonProps extends ButtonProps {
  hoverScale?: number
  tapScale?: number
  glowOnHover?: boolean
  glowColor?: string
  hoverY?: number
  shimmer?: boolean
  sweep?: boolean
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, hoverScale = 1.05, tapScale = 0.98, glowOnHover = false, shimmer = false, sweep = false, ...props }, ref) => {
    return (
      <MotionButton
        ref={ref}
        className={cn(className, {
          "shimmer-effect": shimmer,
          "sweep-effect": sweep,
          "glow-effect": glowOnHover,
        })}
        whileHover={
          hoverScale
            ? {
                scale: hoverScale,
                transition: { duration: 0.2 },
              }
            : undefined
        }
        whileTap={
          tapScale
            ? {
                scale: tapScale,
                transition: { duration: 0.2 },
              }
            : undefined
        }
        {...props}
      >
        {children}
      </MotionButton>
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"


"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const colors = [
  "#9575ff",  // Purple
  "#ff75b5",  // Pink
  "#75ffb5",  // Green
  "#75b5ff",  // Blue
]

interface AnimatedBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const AnimatedBorderCard = React.forwardRef<HTMLDivElement, AnimatedBorderCardProps>(
  ({ className, children, ...props }, ref) => {
    const [currentColorIndex, setCurrentColorIndex] = React.useState(0)

    React.useEffect(() => {
      const interval = setInterval(() => {
        setCurrentColorIndex((prev) => (prev + 1) % colors.length)
      }, 2000) // Change color every 2 seconds

      return () => clearInterval(interval)
    }, [])

    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-lg bg-[#1a1e32] transition-all hover:shadow-2xl",
          className
        )}
        {...props}
      >
        {/* Border overlay */}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            border: `2px solid ${colors[currentColorIndex]}`,
          }}
        />

        {/* Content */}
        <div className="relative p-6">
          {children}
        </div>
      </div>
    )
  }
)

AnimatedBorderCard.displayName = "AnimatedBorderCard" 
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { PixelCanvas } from "@/components/ui/pixel-canvas"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  color?: string
  opacity?: number
}

export function AnimatedCard({ 
  children, 
  className,
  color = "#0ea5e9",
  opacity = 0.1,
  ...props 
}: AnimatedCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg border border-border transition-colors duration-200 hover:border-[var(--active-color)]",
        className
      )}
      style={{ "--active-color": color } as React.CSSProperties}
      {...props}
    >
      <PixelCanvas
        gap={10}
        speed={25}
        colors={[color, color, color].map(c => `${c}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`)}
        variant="icon"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}


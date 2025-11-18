"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface GradientBackgroundProps {
  className?: string
  colors?: string[]
  children?: React.ReactNode
}

export function GradientBackground({
  className = "",
  colors = ["hsl(260, 100%, 14%)", "hsl(260, 100%, 5%)", "hsl(260, 70%, 20%)", "hsl(260, 100%, 10%)"],
  children,
}: GradientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width
      const y = (e.clientY - top) / height

      // Update the gradient position based on mouse position
      containerRef.current.style.backgroundPosition = `${x * 100}% ${y * 100}%`
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const gradientStyle = {
    backgroundImage: `radial-gradient(circle at center, ${colors.join(", ")})`,
  }

  return (
    <div ref={containerRef} className={`interactive-gradient ${className}`} style={gradientStyle}>
      {children}
    </div>
  )
}


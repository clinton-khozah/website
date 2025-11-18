"use client"

import { useState } from "react"

import type React from "react"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface FloatingElementProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export function FloatingElement({ children, intensity = 20, className = "" }: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [translateZ, setTranslateZ] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from center
      const distanceX = (e.clientX - centerX) / (rect.width / 2)
      const distanceY = (e.clientY - centerY) / (rect.height / 2)

      // Apply rotation based on mouse position
      setRotateX(-distanceY * (intensity / 2))
      setRotateY(distanceX * (intensity / 2))
      setTranslateZ(intensity)
    }

    const handleMouseLeave = () => {
      // Reset to original position
      setRotateX(0)
      setRotateY(0)
      setTranslateZ(0)
    }

    window.addEventListener("mousemove", handleMouseMove)
    elementRef.current?.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      elementRef.current?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [intensity])

  return (
    <motion.div
      ref={elementRef}
      className={`floating-element ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      }}
    >
      {children}
    </motion.div>
  )
}


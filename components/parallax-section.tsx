"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  speed?: number
  threshold?: [number, number]
}

export function ParallaxSection({
  children,
  className = "",
  direction = "up",
  speed = 0.2,
  threshold = [0, 1],
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const transformUp = useTransform(scrollYProgress, threshold, [`${speed * 100}%`, "0%"])
  const transformDown = useTransform(scrollYProgress, threshold, [`-${speed * 100}%`, "0%"])
  const transformLeft = useTransform(scrollYProgress, threshold, [`${speed * 100}%`, "0%"])
  const transformRight = useTransform(scrollYProgress, threshold, [`-${speed * 100}%`, "0%"])

  // Calculate transform based on direction
  const getTransform = () => {
    switch (direction) {
      case "up":
        return transformUp
      case "down":
        return transformDown
      case "left":
        return transformLeft
      case "right":
        return transformRight
      default:
        return transformUp
    }
  }

  const transform = getTransform()
  const opacity = useTransform(
    scrollYProgress,
    [threshold[0], threshold[0] + 0.2, threshold[1] - 0.2, threshold[1]],
    [0, 1, 1, 0],
  )

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          [direction === "left" || direction === "right" ? "x" : "y"]: transform,
          opacity,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}


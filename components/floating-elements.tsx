"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Globe, BarChart2, PieChart, DollarSign, Target, TrendingUp } from "lucide-react"

export function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Mouse position for interactive elements
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 })
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 })

  // Handle mouse move for interactive elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    // Calculate mouse position relative to the container
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Normalize to -1 to 1 range for more intuitive movement
    const normalizedX = (x / rect.width) * 2 - 1
    const normalizedY = (y / rect.height) * 2 - 1

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  // Define icons
  const icons = [
    { Icon: Globe, size: 24, color: "text-primary/60" },
    { Icon: BarChart2, size: 32, color: "text-secondary/60" },
    { Icon: PieChart, size: 28, color: "text-accent/60" },
    { Icon: DollarSign, size: 20, color: "text-primary/60" },
    { Icon: Target, size: 36, color: "text-secondary/60" },
    { Icon: TrendingUp, size: 30, color: "text-accent/60" },
  ]

  // Create transform values for each icon at the top level
  // Icon 0
  const rotate0 = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale0 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const x0 = useTransform(smoothMouseX, [-1, 1], [-15, 15])
  const y0 = useTransform(smoothMouseY, [-1, 1], [-10, 10])

  // Icon 1
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, -360])
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const x1 = useTransform(smoothMouseX, [-1, 1], [10, -10])
  const y1 = useTransform(smoothMouseY, [-1, 1], [-15, 15])

  // Icon 2
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const x2 = useTransform(smoothMouseX, [-1, 1], [-20, 20])
  const y2 = useTransform(smoothMouseY, [-1, 1], [10, -10])

  // Icon 3
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, -360])
  const scale3 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const x3 = useTransform(smoothMouseX, [-1, 1], [15, -15])
  const y3 = useTransform(smoothMouseY, [-1, 1], [-5, 5])

  // Icon 4
  const rotate4 = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale4 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const x4 = useTransform(smoothMouseX, [-1, 1], [-25, 25])
  const y4 = useTransform(smoothMouseY, [-1, 1], [20, -20])

  // Icon 5
  const rotate5 = useTransform(scrollYProgress, [0, 1], [0, -360])
  const scale5 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const x5 = useTransform(smoothMouseX, [-1, 1], [30, -30])
  const y5 = useTransform(smoothMouseY, [-1, 1], [-25, 25])

  // Group transforms for easy access
  const rotations = [rotate0, rotate1, rotate2, rotate3, rotate4, rotate5]
  const scales = [scale0, scale1, scale2, scale3, scale4, scale5]
  const xOffsets = [x0, x1, x2, x3, x4, x5]
  const yOffsets = [y0, y1, y2, y3, y4, y5]

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {icons.map((icon, index) => {
        const { Icon, size, color } = icon
        const delay = index * 0.2
        const duration = 20 + index * 5

        // Calculate different paths for each icon
        const xPath = [`${10 + index * 15}%`, `${30 + index * 10}%`, `${20 + index * 5}%`, `${10 + index * 15}%`]
        const yPath = [`${20 + index * 10}%`, `${10 + index * 5}%`, `${30 + index * 8}%`, `${20 + index * 10}%`]

        return (
          <motion.div
            key={index}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.8,
              x: xPath,
              y: yPath,
            }}
            style={{
              rotate: rotations[index],
              scale: scales[index],
              x: xOffsets[index],
              y: yOffsets[index],
            }}
            transition={{
              opacity: { duration: 1, delay },
              x: {
                duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay,
              },
              y: {
                duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay,
              },
            }}
          >
            <div className={`${color} drop-shadow-lg blur-[0.5px]`}>
              <Icon size={size} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}


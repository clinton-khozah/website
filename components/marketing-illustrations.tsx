"use client"

import { useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  AreaChart,
  Megaphone,
  Smartphone,
  Laptop,
  Newspaper,
  Radio,
  Tv,
} from "lucide-react"

export function MarketingIllustrations() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 300 })
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 300 })

  // Define all transforms at the top level
  // Icon 1
  const icon1X = useTransform(smoothMouseX, [-1, 1], [-30, 30])
  const icon1Y = useTransform(smoothMouseY, [-1, 1], [-20, 20])
  const icon1Rotate = useTransform(smoothMouseX, [-1, 1], [-15, 15])

  // Icon 2
  const icon2X = useTransform(smoothMouseX, [-1, 1], [25, -25])
  const icon2Y = useTransform(smoothMouseY, [-1, 1], [-35, 35])
  const icon2Rotate = useTransform(smoothMouseX, [-1, 1], [10, -10])

  // Icon 3
  const icon3X = useTransform(smoothMouseX, [-1, 1], [-40, 40])
  const icon3Y = useTransform(smoothMouseY, [-1, 1], [30, -30])
  const icon3Rotate = useTransform(smoothMouseX, [-1, 1], [-20, 20])

  // Icon 4
  const icon4X = useTransform(smoothMouseX, [-1, 1], [35, -35])
  const icon4Y = useTransform(smoothMouseY, [-1, 1], [25, -25])
  const icon4Rotate = useTransform(smoothMouseX, [-1, 1], [15, -15])

  // Icon 5
  const icon5X = useTransform(smoothMouseX, [-1, 1], [-20, 20])
  const icon5Y = useTransform(smoothMouseY, [-1, 1], [-40, 40])
  const icon5Rotate = useTransform(smoothMouseX, [-1, 1], [-10, 10])

  // Icon 6
  const icon6X = useTransform(smoothMouseX, [-1, 1], [40, -40])
  const icon6Y = useTransform(smoothMouseY, [-1, 1], [-30, 30])
  const icon6Rotate = useTransform(smoothMouseX, [-1, 1], [20, -20])

  // Icon 7
  const icon7X = useTransform(smoothMouseX, [-1, 1], [-25, 25])
  const icon7Y = useTransform(smoothMouseY, [-1, 1], [35, -35])
  const icon7Rotate = useTransform(smoothMouseX, [-1, 1], [-15, 15])

  // Icon 8
  const icon8X = useTransform(smoothMouseX, [-1, 1], [30, -30])
  const icon8Y = useTransform(smoothMouseY, [-1, 1], [-20, 20])
  const icon8Rotate = useTransform(smoothMouseX, [-1, 1], [10, -10])

  // Icon 9
  const icon9X = useTransform(smoothMouseX, [-1, 1], [-35, 35])
  const icon9Y = useTransform(smoothMouseY, [-1, 1], [-25, 25])
  const icon9Rotate = useTransform(smoothMouseX, [-1, 1], [-25, 25])

  // Icon 10
  const icon10X = useTransform(smoothMouseX, [-1, 1], [20, -20])
  const icon10Y = useTransform(smoothMouseY, [-1, 1], [30, -30])
  const icon10Rotate = useTransform(smoothMouseX, [-1, 1], [15, -15])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()

      // Normalize mouse position to -1 to 1
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1

      mouseX.set(normalizedX)
      mouseY.set(normalizedY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Marketing-related icons with different properties
  const marketingIcons = [
    {
      Icon: BarChart3,
      color: "text-primary/80",
      size: 36,
      initialX: "10%",
      initialY: "20%",
      x: icon1X,
      y: icon1Y,
      rotate: icon1Rotate,
      delay: 0,
    },
    {
      Icon: Megaphone,
      color: "text-secondary/80",
      size: 42,
      initialX: "80%",
      initialY: "15%",
      x: icon2X,
      y: icon2Y,
      rotate: icon2Rotate,
      delay: 0.1,
    },
    {
      Icon: Smartphone,
      color: "text-accent/80",
      size: 32,
      initialX: "25%",
      initialY: "75%",
      x: icon3X,
      y: icon3Y,
      rotate: icon3Rotate,
      delay: 0.2,
    },
    {
      Icon: PieChart,
      color: "text-primary/70",
      size: 38,
      initialX: "70%",
      initialY: "65%",
      x: icon4X,
      y: icon4Y,
      rotate: icon4Rotate,
      delay: 0.3,
    },
    {
      Icon: Laptop,
      color: "text-secondary/70",
      size: 40,
      initialX: "15%",
      initialY: "40%",
      x: icon5X,
      y: icon5Y,
      rotate: icon5Rotate,
      delay: 0.4,
    },
    {
      Icon: TrendingUp,
      color: "text-accent/70",
      size: 34,
      initialX: "85%",
      initialY: "35%",
      x: icon6X,
      y: icon6Y,
      rotate: icon6Rotate,
      delay: 0.5,
    },
    {
      Icon: Newspaper,
      color: "text-primary/60",
      size: 30,
      initialX: "40%",
      initialY: "85%",
      x: icon7X,
      y: icon7Y,
      rotate: icon7Rotate,
      delay: 0.6,
    },
    {
      Icon: Radio,
      color: "text-secondary/60",
      size: 28,
      initialX: "60%",
      initialY: "10%",
      x: icon8X,
      y: icon8Y,
      rotate: icon8Rotate,
      delay: 0.7,
    },
    {
      Icon: AreaChart,
      color: "text-accent/60",
      size: 44,
      initialX: "30%",
      initialY: "30%",
      x: icon9X,
      y: icon9Y,
      rotate: icon9Rotate,
      delay: 0.8,
    },
    {
      Icon: Tv,
      color: "text-primary/50",
      size: 46,
      initialX: "75%",
      initialY: "80%",
      x: icon10X,
      y: icon10Y,
      rotate: icon10Rotate,
      delay: 0.9,
    },
  ]

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {marketingIcons.map((item, index) => {
        const { Icon, color, size, initialX, initialY, x, y, rotate, delay } = item

        return (
          <motion.div
            key={index}
            className={`absolute ${color} drop-shadow-lg`}
            style={{
              left: initialX,
              top: initialY,
              x,
              y,
              rotate,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.9,
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.8, delay },
              scale: { duration: 0.8, delay },
            }}
          >
            <motion.div
              className="backdrop-blur-[1px]"
              animate={{ y: [0, -10, 0, 10, 0] }}
              transition={{
                y: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5 + index,
                  ease: "easeInOut",
                  delay,
                },
              }}
            >
              <Icon size={size} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}


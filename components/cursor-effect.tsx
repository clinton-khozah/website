"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useTheme } from "next-themes"

export function CursorEffect() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const { theme } = useTheme()

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Use clientX and clientY which are relative to the viewport
      // This ensures the cursor stays with the mouse during scrolling
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const checkPointerElements = () => {
      const element = document.elementFromPoint(cursorX.get(), cursorY.get())
      if (!element) return

      const isClickable =
        element.tagName === "BUTTON" ||
        element.tagName === "A" ||
        element.closest("button") ||
        element.closest("a") ||
        getComputedStyle(element).cursor === "pointer"

      setIsPointer(isClickable)
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mousemove", checkPointerElements)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mousemove", checkPointerElements)
    }
  }, [cursorX, cursorY])

  // Only show on desktop
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) return null

  return (
    <div className="cursor-container" style={{ cursor: "none" }}>
      {/* Main cursor - using fixed positioning to stay with viewport */}
      <motion.div
        className="fixed top-0 left-0 z-[100] pointer-events-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className={`rounded-full border ${
            theme === "dark" ? "border-white/30 bg-white/5" : "border-primary/30 bg-primary/5"
          }`}
          animate={{
            width: isPointer ? 50 : 30,
            height: isPointer ? 50 : 30,
            x: isPointer ? -25 : -15,
            y: isPointer ? -25 : -15,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Dot cursor - using fixed positioning to stay with viewport */}
      <motion.div
        className="fixed top-0 left-0 z-[101] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className={`rounded-full ${theme === "dark" ? "bg-white" : "bg-primary"}`}
          animate={{
            width: isPointer ? 8 : 5,
            height: isPointer ? 8 : 5,
            x: isPointer ? -4 : -2.5,
            y: isPointer ? -4 : -2.5,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </div>
  )
}


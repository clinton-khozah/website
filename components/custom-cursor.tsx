"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      // Use clientX and clientY which are relative to the viewport
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      // Check if the cursor is over a clickable element
      const target = e.target as HTMLElement
      const computedStyle = window.getComputedStyle(target)

      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest(".clickable") ||
        computedStyle.cursor === "pointer"

      setIsPointer(isClickable)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", updatePosition)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  // Only show on desktop
  const [isMobile, setIsMobile] = useState(true) // Default to true to avoid flash on mobile

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) return null

  // Determine cursor colors based on theme
  const ringColor = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(93, 63, 211, 0.8)"
  const dotColor = theme === "dark" ? "rgba(255, 255, 255, 1)" : "rgba(93, 63, 211, 1)"

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: position.x,
          y: position.y,
          scale: isPointer ? 1.5 : isClicking ? 0.8 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          opacity: { duration: 0.2 },
          scale: { duration: 0.1 },
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `2px solid ${ringColor}`,
          backgroundColor: "transparent",
          transform: "translate(-50%, -50%)",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicking ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 500,
          opacity: { duration: 0.2 },
          scale: { duration: 0.1 },
        }}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: dotColor,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  )
}


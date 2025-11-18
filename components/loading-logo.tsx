"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface LoadingLogoProps {
  size?: number
}

export function LoadingLogo({ size = 44 }: LoadingLogoProps) {
  const [colorIndex, setColorIndex] = React.useState(0)

  // Logo colors for the border
  const logoColors = [
    "#6B54FA", // Purple
    "#FA6565", // Pink/Red
    "#F9CA56", // Yellow/Gold
    "#53E2D2"  // Teal
  ]

  // Color rotation effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % logoColors.length)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative flex items-center justify-center"
        style={{ 
          border: `2px solid ${logoColors[colorIndex]}`,
          transition: "border-color 0.5s ease-in-out",
          borderRadius: "50%",
          width: `${size + 8}px`,
          height: `${size + 8}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image 
          src="/images/Picture1.png" 
          alt="Logo" 
          width={size} 
          height={size}
          className="overflow-hidden" 
          priority
          style={{ 
            borderRadius: "50%",
            objectFit: "contain"
          }}
        />
      </motion.div>
    </div>
  )
} 
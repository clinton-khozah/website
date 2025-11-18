"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export function AnimatedEmail() {
  return (
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 0, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Mail className="h-5 w-5 text-orange-500" />
      </motion.div>
    </motion.div>
  )
} 
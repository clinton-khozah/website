"use client"

import { Search } from "lucide-react"
import { motion } from "framer-motion"

export function AnimatedText() {
  return (
    <div className="relative flex items-center">
      <motion.div
        className="absolute"
        animate={{
          x: [0, 200, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Search className="h-8 w-8 text-orange-500" />
      </motion.div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">Email Reports</span>
        <motion.span
          className="absolute"
          animate={{
            filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          Email Reports
        </motion.span>
      </div>
    </div>
  )
} 
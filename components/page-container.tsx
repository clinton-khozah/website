"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <>
      {/* Animated background with dark blue gradient matching the theme */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-[#32147f] via-[#140047] to-[#140047] -z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
      />
      
      {/* Content with proper spacing */}
      <div className={cn("relative pt-32 pb-8", className)}>
        {children}
      </div>
    </>
  )
} 
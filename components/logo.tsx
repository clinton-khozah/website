"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  linkToHome?: boolean
}

export function Logo({ className, linkToHome = true }: LogoProps) {
  const logoContent = (
    <div className={cn("font-bold text-xl flex items-center", className)}>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F0B2C] via-[#2a1760] to-[#341c7a] mr-1">All</span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1a1145] via-[#2a1760] to-[#341c7a]">Things</span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2a1760] via-[#341c7a] to-[#9546ff] ml-1">Advertising</span>
    </div>
  )

  if (linkToHome) {
    return <Link href="/">{logoContent}</Link>
  }

  return logoContent
}


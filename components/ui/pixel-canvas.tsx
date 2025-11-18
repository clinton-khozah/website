"use client"

import * as React from "react"
import { useEffect, useRef } from "react"

class Pixel {
  width: number
  height: number
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  color: string
  speed: number
  size: number
  sizeStep: number
  minSize: number
  maxSizeInteger: number
  maxSize: number
  delay: number
  counter: number
  counterStep: number
  isIdle: boolean
  isReverse: boolean
  isShimmer: boolean

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.size = 0
    this.sizeStep = Math.random() * 0.4
    this.minSize = 0.5
    this.maxSizeInteger = 2
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isIdle = false
    this.isReverse = false
    this.isShimmer = false
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    )
  }

  appear() {
    this.isIdle = false

    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }

    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }

    this.draw()
  }

  disappear() {
    this.isShimmer = false
    this.counter = 0

    if (this.size <= 0) {
      this.isIdle = true
      return
    } else {
      this.size -= 0.1
    }

    this.draw()
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }

    if (this.isReverse) {
      this.size -= this.speed
    } else {
      this.size += this.speed
    }
  }
}

export interface PixelCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number
  speed?: number
  colors?: string[]
  variant?: "default" | "icon"
  noFocus?: boolean
}

export function PixelCanvas({
  gap = 10,
  speed = 25,
  colors = ["#f8fafc", "#f1f5f9", "#cbd5e1"],
  variant = "default",
  noFocus = false,
  style,
  ...props
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const animationRef = useRef<number>()
  const isHoveredRef = useRef(false)
  const isFocusedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      createPixels()
    }

    const createPixels = () => {
      pixelsRef.current = []
      for (let x = 0; x < canvas.width; x += gap) {
        for (let y = 0; y < canvas.height; y += gap) {
          const color = colors[Math.floor(Math.random() * colors.length)]
          let delay = 0

          if (variant === "icon") {
            const dx = x - canvas.width / 2
            const dy = y - canvas.height / 2
            delay = Math.sqrt(dx * dx + dy * dy)
          } else {
            const dx = x
            const dy = canvas.height - y
            delay = Math.sqrt(dx * dx + dy * dy)
          }

          pixelsRef.current.push(
            new Pixel(canvas, ctx, x, y, color, speed * 0.001, delay)
          )
        }
      }
    }

    const animate = (action: "appear" | "disappear") => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      const frame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let allIdle = true

        for (const pixel of pixelsRef.current) {
          pixel[action]()
          if (!pixel.isIdle) allIdle = false
        }

        if (!allIdle) {
          animationRef.current = requestAnimationFrame(frame)
        }
      }

      frame()
    }

    const handleMouseEnter = () => {
      isHoveredRef.current = true
      animate("appear")
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      if (!isFocusedRef.current) {
        animate("disappear")
      }
    }

    const handleFocus = () => {
      if (noFocus) return
      isFocusedRef.current = true
      animate("appear")
    }

    const handleBlur = () => {
      if (noFocus) return
      isFocusedRef.current = false
      if (!isHoveredRef.current) {
        animate("disappear")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    canvas.parentElement?.addEventListener("mouseenter", handleMouseEnter)
    canvas.parentElement?.addEventListener("mouseleave", handleMouseLeave)
    canvas.parentElement?.addEventListener("focus", handleFocus, true)
    canvas.parentElement?.addEventListener("blur", handleBlur, true)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.parentElement?.removeEventListener("mouseenter", handleMouseEnter)
      canvas.parentElement?.removeEventListener("mouseleave", handleMouseLeave)
      canvas.parentElement?.removeEventListener("focus", handleFocus)
      canvas.parentElement?.removeEventListener("blur", handleBlur)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gap, speed, colors, variant, noFocus])

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
} 
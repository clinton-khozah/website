"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

export function OrbBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let mouseX = 0
    let mouseY = 0
    let isDark = theme === "dark"

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = isDark
          ? `hsl(260, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 60}%)`
          : `hsl(260, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 30}%)`
        this.alpha = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Boundary check
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1

        // Mouse interaction
        const dx = this.x - mouseX
        const dy = this.y - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const directionX = dx / distance || 0
          const directionY = dy / distance || 0
          this.speedX += directionX * force * 0.2
          this.speedY += directionY * force * 0.2

          // Limit speed
          const maxSpeed = 3
          const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY)
          if (currentSpeed > maxSpeed) {
            this.speedX = (this.speedX / currentSpeed) * maxSpeed
            this.speedY = (this.speedY / currentSpeed) * maxSpeed
          }
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.alpha
        ctx.fill()
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = []
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 100)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    initParticles()

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = isDark ? "rgba(120, 87, 255, 0.05)" : "rgba(93, 63, 211, 0.05)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.globalAlpha = ((150 - distance) / 150) * 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw orb
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.15

      // Orb glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5)
      gradient.addColorStop(0, isDark ? "rgba(120, 87, 255, 0.3)" : "rgba(93, 63, 211, 0.2)")
      gradient.addColorStop(0.5, isDark ? "rgba(120, 87, 255, 0.1)" : "rgba(93, 63, 211, 0.1)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.globalAlpha = 1
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Orb core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      coreGradient.addColorStop(0, isDark ? "rgba(150, 120, 255, 0.8)" : "rgba(120, 87, 255, 0.7)")
      coreGradient.addColorStop(0.7, isDark ? "rgba(120, 87, 255, 0.6)" : "rgba(93, 63, 211, 0.5)")
      coreGradient.addColorStop(1, isDark ? "rgba(93, 63, 211, 0.4)" : "rgba(60, 20, 130, 0.3)")

      ctx.globalAlpha = 0.7
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Update colors when theme changes
    const updateColors = () => {
      isDark = theme === "dark"
      particles.forEach((particle) => {
        particle.color = isDark
          ? `hsl(260, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 60}%)`
          : `hsl(260, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 30}%)`
      })
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "screen" }} />
    </div>
  )
}


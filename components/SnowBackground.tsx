// ลิงก์ไฟล์: components/SnowBackground.tsx
"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface SnowBackgroundProps {
  className?: string
  children?: React.ReactNode
  count?: number
  intensity?: number
  wind?: number
  color?: string
  speed?: number
}

interface Snowflake {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  wobbleOffset: number
  wobbleSpeed: number
  rotation: number
  rotationSpeed: number
  layer: number
}

export function SnowBackground({
  className,
  children,
  count = 150,
  intensity = 1,
  wind = 0.3,
  color = "rgba(255, 255, 255, 0.9)",
  speed = 1,
}: SnowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    let width = rect.width
    let height = rect.height
    canvas.width = width
    canvas.height = height

    let animationId: number
    let tick = 0
    const totalFlakes = Math.floor(count * intensity)

    const layers = [
      { speed: 0.3, minSize: 1, maxSize: 2.5, opacity: 0.4 },
      { speed: 0.6, minSize: 2, maxSize: 4, opacity: 0.6 },
      { speed: 1, minSize: 3, maxSize: 6, opacity: 0.9 },
    ]

    const createSnowflake = (layer: number, startFromTop = false): Snowflake => {
      const config = layers[layer]
      return {
        x: Math.random() * (width + 100) - 50,
        y: startFromTop ? -10 - Math.random() * 100 : Math.random() * height,
        size: config.minSize + Math.random() * (config.maxSize - config.minSize),
        speed: config.speed * (0.8 + Math.random() * 0.4),
        opacity: config.opacity * (0.8 + Math.random() * 0.2),
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        layer,
      }
    }

    const snowflakes: Snowflake[] = []
    for (let i = 0; i < totalFlakes; i++) {
      const layer = i < totalFlakes * 0.4 ? 0 : i < totalFlakes * 0.75 ? 1 : 2
      snowflakes.push(createSnowflake(layer))
    }

    snowflakes.sort((a, b) => a.layer - b.layer)

    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width
      canvas.height = height
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    const animate = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      for (const flake of snowflakes) {
        flake.y += flake.speed * speed * 1.5
        const wobble = Math.sin(tick * flake.wobbleSpeed + flake.wobbleOffset) * 0.5
        flake.x += wobble + wind * flake.speed * speed
        flake.rotation += flake.rotationSpeed * speed

        if (flake.y > height + 20) {
          flake.y = -10 - Math.random() * 50
          flake.x = Math.random() * (width + 100) - 50
        }
        if (flake.x < -50) flake.x = width + 50
        if (flake.x > width + 50) flake.x = -50

        ctx.save()
        ctx.translate(flake.x, flake.y)
        ctx.rotate(flake.rotation)

        ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
        ctx.shadowBlur = flake.size * 2

        ctx.globalAlpha = flake.opacity
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(0, 0, flake.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = flake.opacity * 0.5
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(-flake.size * 0.2, -flake.size * 0.2, flake.size * 0.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
    }
  }, [count, intensity, wind, color, speed])

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden", className)}
      style={{
        background: "linear-gradient(to bottom, #1a2a3a 0%, #2d3e50 40%, #3a4a5c 100%)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full z-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(200, 220, 255, 0.15) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 z-0"
        style={{
          background: "linear-gradient(to top, rgba(200, 210, 230, 0.2) 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(15,25,35,0.7) 100%)",
        }}
      />
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}
// ลิงก์ไฟล์: components/GlitchBackground.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface GlitchBackgroundProps {
  className?: string
  children?: React.ReactNode
  color?: string
  intensity?: number
  scanlines?: boolean
  isDark?: boolean // เพิ่ม Prop สำหรับ Light/Dark Mode
}

export function GlitchBackground({
  className,
  children,
  color = "#00ffff",
  intensity = 1,
  scanlines = true,
  isDark = true,
}: GlitchBackgroundProps) {
  const [glitchState, setGlitchState] = useState({
    offsetX1: 0,
    offsetX2: 0,
    sliceY: 0,
    sliceHeight: 0,
    sliceOffset: 0,
    noiseOpacity: 0,
    isGlitching: false,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationId: number
    let lastGlitch = 0
    let glitchDuration = 0
    let nextGlitch = 400 + Math.random() * 800

    const animate = (time: number) => {
      const timeSinceGlitch = time - lastGlitch

      if (timeSinceGlitch > nextGlitch && glitchDuration === 0) {
        glitchDuration = 80 + Math.random() * 180 * intensity
        lastGlitch = time
      }

      if (glitchDuration > 0) {
        glitchDuration -= 16
        const glitchIntensity = intensity * (Math.random() * 0.5 + 0.5)

        setGlitchState({
          offsetX1: (Math.random() - 0.5) * 25 * glitchIntensity,
          offsetX2: (Math.random() - 0.5) * 25 * glitchIntensity,
          sliceY: Math.random() * 100,
          sliceHeight: 2 + Math.random() * 10,
          sliceOffset: (Math.random() - 0.5) * 40 * glitchIntensity,
          noiseOpacity: isDark ? (0.12 + Math.random() * 0.18 * glitchIntensity) : (0.05 + Math.random() * 0.1 * glitchIntensity),
          isGlitching: true,
        })

        if (glitchDuration <= 0) {
          nextGlitch = (500 + Math.random() * 1200) / intensity
        }
      } else {
        setGlitchState(prev => ({
          offsetX1: prev.offsetX1 * 0.9,
          offsetX2: prev.offsetX2 * 0.9,
          sliceY: 0,
          sliceHeight: 0,
          sliceOffset: 0,
          noiseOpacity: isDark ? 0.02 : 0.01,
          isGlitching: false,
        }))
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [intensity, isDark])

  // ตัวแปรสีตามโหมด
  const baseGradient = isDark 
    ? "linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a12 100%)"
    : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)";
  
  const vignette = isDark
    ? "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)"
    : "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(255,255,255,0.6) 100%)";

  const scanlineColor = isDark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.4)";

  return (
    <div ref={containerRef} className={cn("fixed inset-0 overflow-hidden", isDark ? "bg-black" : "bg-slate-50", className)}>
      {/* Base layer */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, ${color}15 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, ${color}10 0%, transparent 50%),
            ${baseGradient}
          `,
        }}
      />

      {/* RGB Split layers */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}20 0%, transparent 60%)`,
          transform: `translateX(${glitchState.offsetX1}px)`,
          opacity: 0.8,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #ff000018 0%, transparent 60%)",
          transform: `translateX(${-glitchState.offsetX2}px)`,
          opacity: 0.6,
        }}
      />

      {/* Horizontal slice glitch */}
      {glitchState.isGlitching && glitchState.sliceHeight > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            top: `${glitchState.sliceY}%`,
            height: `${glitchState.sliceHeight}%`,
            background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
            transform: `translateX(${glitchState.sliceOffset}px)`,
            boxShadow: `0 0 10px ${color}50`,
          }}
        />
      )}

      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: glitchState.noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          filter: isDark ? "none" : "invert(1)", // สลับสี noise ใน Light Mode
        }}
      />

      {/* Scanlines */}
      {scanlines && (
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-700"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${scanlineColor} 2px, ${scanlineColor} 4px)`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Glitch flash */}
      {glitchState.isGlitching && Math.random() > 0.7 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: color,
            opacity: 0.03,
          }}
        />
      )}

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ background: vignette }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}
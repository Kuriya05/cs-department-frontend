// ลิงก์ไฟล์: components/FogBackground.tsx
"use client"

import { cn } from "@/lib/utils"

export interface FogBackgroundProps {
  className?: string
  children?: React.ReactNode
  color?: string
  opacity?: number
  speed?: number
  isDark?: boolean
}

export function FogBackground({
  className,
  children,
  color = "#ffffff",
  opacity = 0.5,
  speed = 1,
  isDark = true,
}: FogBackgroundProps) {
  const duration1 = 60 / speed
  const duration2 = 80 / speed
  const duration3 = 100 / speed

  const baseGradient = isDark 
    ? "linear-gradient(to bottom, #0a0a12 0%, #101018 50%, #080810 100%)"
    : "linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)";

  const vignette = isDark
    ? "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(5,5,10,0.8) 100%)"
    : "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(255,255,255,0.6) 100%)";

  return (
    <div
      className={cn("fixed inset-0 overflow-hidden transition-colors duration-700", className)}
      style={{ background: baseGradient }}
    >
      {/* Fog layers with CSS animations */}
      <div className="absolute inset-0" style={{ filter: "blur(80px)" }}>
        {/* Layer 1 - Back, slowest */}
        <div
          className="absolute h-[120%] w-[200%]"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 25% 50%, ${color}, transparent),
                         radial-gradient(ellipse 40% 50% at 75% 60%, ${color}, transparent)`,
            opacity: opacity * 0.3,
            animation: `fogDrift1 ${duration3}s ease-in-out infinite`,
          }}
        />

        {/* Layer 2 - Middle */}
        <div
          className="absolute h-[120%] w-[200%]"
          style={{
            background: `radial-gradient(ellipse 60% 35% at 30% 40%, ${color}, transparent),
                         radial-gradient(ellipse 45% 45% at 70% 70%, ${color}, transparent)`,
            opacity: opacity * 0.4,
            animation: `fogDrift2 ${duration2}s ease-in-out infinite`,
          }}
        />

        {/* Layer 3 - Front, fastest */}
        <div
          className="absolute h-[120%] w-[200%]"
          style={{
            background: `radial-gradient(ellipse 55% 50% at 40% 55%, ${color}, transparent),
                         radial-gradient(ellipse 50% 35% at 60% 35%, ${color}, transparent)`,
            opacity: opacity * 0.35,
            animation: `fogDrift3 ${duration1}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* Extra soft ambient layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          filter: "blur(120px)",
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${color}, transparent)`,
          opacity: opacity * 0.25,
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ background: vignette }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}

      <style>{`
        @keyframes fogDrift1 {
          0%, 100% { transform: translateX(-10%) translateY(0%); }
          50% { transform: translateX(5%) translateY(-3%); }
        }
        @keyframes fogDrift2 {
          0%, 100% { transform: translateX(0%) translateY(-2%); }
          50% { transform: translateX(-15%) translateY(2%); }
        }
        @keyframes fogDrift3 {
          0%, 100% { transform: translateX(-5%) translateY(2%); }
          50% { transform: translateX(10%) translateY(-2%); }
        }
      `}</style>
    </div>
  )
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ==========================================
// 🌌 1. COMPONENT: GlitchBackground (Luxury Neon Grid)
// ==========================================
interface GlitchProps { color?: string; intensity?: number; scanlines?: boolean; isDark?: boolean; }
function GlitchBackground({ color = "#c5a880", intensity = 0.8, scanlines = true, isDark = true }: GlitchProps) {
  const [glitchState, setGlitchState] = useState({ offsetX1: 0, offsetX2: 0, noiseOpacity: 0 });
  
  useEffect(() => {
    let animationId: number;
    let lastGlitch = 0;
    let glitchDuration = 0;
    let nextGlitch = 600 + Math.random() * 1000;

    const animate = (time: number) => {
      const timeSinceGlitch = time - lastGlitch;
      if (timeSinceGlitch > nextGlitch && glitchDuration === 0) {
        glitchDuration = 60 + Math.random() * 120 * intensity;
        lastGlitch = time;
      }
      if (glitchDuration > 0) {
        glitchDuration -= 16;
        const glitchIntensity = intensity * (Math.random() * 0.4 + 0.6);
        setGlitchState({
          offsetX1: (Math.random() - 0.5) * 12 * glitchIntensity,
          offsetX2: (Math.random() - 0.5) * 12 * glitchIntensity,
          noiseOpacity: isDark ? (0.06 + Math.random() * 0.08 * glitchIntensity) : (0.02 + Math.random() * 0.04 * glitchIntensity),
        });
        if (glitchDuration <= 0) nextGlitch = (800 + Math.random() * 1500) / intensity;
      } else {
        setGlitchState(prev => ({ ...prev, offsetX1: prev.offsetX1 * 0.85, offsetX2: prev.offsetX2 * 0.85, noiseOpacity: isDark ? 0.01 : 0.005 }));
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [intensity, isDark]);

  const baseGradient = isDark 
    ? "linear-gradient(180deg, #030305 0%, #08080c 50%, #030306 100%)" 
    : "linear-gradient(135deg, #fdfcfb 0%, #f7f4eb 50%, #eee6d8 100%)";

  return (
    <div className="fixed inset-0 overflow-hidden transform-gpu z-0">
      <div className="absolute inset-0 transition-all duration-1000" style={{ background: `radial-gradient(ellipse at 30% 40%, ${color}08 0%, transparent 60%), ${baseGradient}` }} />
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40" style={{ background: `radial-gradient(ellipse at 50% 50%, ${color}10 0%, transparent 50%)`, transform: `translateX(${glitchState.offsetX1}px)` }} />
      {scanlines && <div className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${isDark ? "rgba(0,0,0,0.3)" : "rgba(197,168,128,0.2)"} 3px, ${isDark ? "rgba(0,0,0,0.3)" : "rgba(197,168,128,0.2)"} 5px)` }} />}
    </div>
  );
}

// ==========================================
// 🌫️ 2. COMPONENT: FogBackground (Velvet Mist)
// ==========================================
interface FogProps { color?: string; opacity?: number; isDark?: boolean; }
function FogBackground({ color = "#d4af37", opacity = 0.3, isDark = true }: FogProps) {
  const baseGradient = isDark 
    ? "linear-gradient(to bottom, #040406 0%, #09090f 50%, #030305 100%)" 
    : "linear-gradient(135deg, #fdfcfb 0%, #f7f4eb 50%, #eee6d8 100%)";
    
  return (
    <div className="fixed inset-0 overflow-hidden transition-all duration-1000 transform-gpu z-0" style={{ background: baseGradient }}>
      <div className="absolute inset-0 animate-pulse duration-[10000ms]" style={{ filter: "blur(130px)" }}>
        <div className="absolute h-[140%] w-[220%] top-[-20%] left-[-10%]" style={{ background: `radial-gradient(ellipse 50% 40% at 20% 40%, ${color}20, transparent)`, opacity: opacity, animation: `fogDrift 90s ease-in-out infinite` }} />
        <div className="absolute h-[140%] w-[220%] bottom-[-20%] right-[-10%]" style={{ background: `radial-gradient(ellipse 60% 35% at 80% 60%, ${color}15, transparent)`, opacity: opacity * 1.2, animation: `fogDrift 70s ease-in-out infinite reverse` }} />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fogDrift {
          0%, 100% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
          33% { transform: translate(3%, 4%) scale(1.03) rotate(1deg); }
          66% { transform: translate(-2%, -3%) scale(0.97) rotate(-1deg); }
        }
      `}} />
    </div>
  );
}

// ==========================================
// ❄️ 3. COMPONENT: SnowBackground (Champagne Diamond Edition)
// ==========================================
interface SnowProps { count?: number; intensity?: number; wind?: number; color?: string; speed?: number; isDark?: boolean; }
interface Snowflake { x: number; y: number; size: number; speed: number; opacity: number; wobbleOffset: number; wobbleSpeed: number; layer: number; }
function SnowBackground({ count = 80, intensity = 1, wind = 0.1, color = "rgba(224, 192, 136, 0.4)", speed = 0.5, isDark = true }: SnowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current; const container = containerRef.current; if (!canvas || !container) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = container.clientWidth; let height = container.clientHeight; canvas.width = width; canvas.height = height;
    let animationId: number; let tick = 0; const totalFlakes = Math.floor(count * intensity);
    const layers = [{ speed: 0.15, minSize: 0.8, maxSize: 1.8, opacity: 0.25 }, { speed: 0.4, minSize: 1.5, maxSize: 2.8, opacity: 0.45 }, { speed: 0.7, minSize: 2.2, maxSize: 4.2, opacity: 0.65 }];
    
    const createSnowflake = (layer: number): Snowflake => {
      const config = layers[layer];
      return {
        x: Math.random() * width, y: Math.random() * height,
        size: config.minSize + Math.random() * (config.maxSize - config.minSize), speed: config.speed * (0.9 + Math.random() * 0.3),
        opacity: config.opacity * (0.8 + Math.random() * 0.2), wobbleOffset: Math.random() * Math.PI * 2, wobbleSpeed: 0.005 + Math.random() * 0.015, layer
      };
    };
    
    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < totalFlakes; i++) { 
      const layer = i < totalFlakes * 0.5 ? 0 : i < totalFlakes * 0.85 ? 1 : 2; 
      snowflakes.push(createSnowflake(layer)); 
    }
    
    const handleResize = () => { if (!container || !canvas) return; width = container.clientWidth; height = container.clientHeight; canvas.width = width; canvas.height = height; };
    window.addEventListener('resize', handleResize);
    
    const animate = () => {
      tick++; ctx.clearRect(0, 0, width, height);
      for (const flake of snowflakes) {
        flake.y += flake.speed * speed * 1.1; 
        flake.x += Math.sin(tick * flake.wobbleSpeed + flake.wobbleOffset) * 0.2 + wind * flake.speed;
        if (flake.y > height + 10) { flake.y = -10; flake.x = Math.random() * width; }
        ctx.save(); ctx.translate(flake.x, flake.y); ctx.globalAlpha = flake.opacity;
        ctx.fillStyle = isDark ? color : "rgba(164, 135, 84, 0.2)"; 
        ctx.beginPath(); ctx.arc(0, 0, flake.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate(); 
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize); };
  }, [count, intensity, wind, color, speed, isDark]);

  const baseGradient = isDark 
    ? "linear-gradient(to bottom, #040508 0%, #0a0d18 50%, #040509 100%)" 
    : "linear-gradient(135deg, #fdfcfb 0%, #f7f4eb 50%, #eee6d8 100%)";

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden transition-all duration-1000 transform-gpu z-0" style={{ background: baseGradient }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
    </div>
  );
}

// ==========================================
// 🌊 4. COMPONENT: UnderwaterBackground (Abyssal Marine Edition)
// ==========================================
interface UnderwaterProps { intensity?: number; speed?: number; isDark?: boolean; }
interface MarineParticle { x: number; y: number; size: number; speed: number; opacity: number; wobbleOffset: number; }
function UnderwaterBackground({ intensity = 1, speed = 0.8, isDark = true }: UnderwaterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; const container = containerRef.current; if (!canvas || !container) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = container.clientWidth; let height = container.clientHeight; canvas.width = width; canvas.height = height;
    let animationId: number; let tick = 0;

    const particles: MarineParticle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      size: 1 + Math.random() * 2.5, speed: 0.2 + Math.random() * 0.4,
      opacity: isDark ? (0.3 + Math.random() * 0.4) : (0.15 + Math.random() * 0.25),
      wobbleOffset: Math.random() * Math.PI * 2,
    }));

    const handleResize = () => { if (!container || !canvas) return; width = container.clientWidth; height = container.clientHeight; canvas.width = width; canvas.height = height; };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      tick += 0.015 * speed; ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed * speed; p.x += Math.sin(tick * 1.2 + p.wobbleOffset) * 0.3;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(180, 230, 255, ${p.opacity})` : `rgba(0, 90, 140, ${p.opacity})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize); };
  }, [speed, isDark]);

  const baseGradient = isDark
    ? "linear-gradient(180deg, #00334e 0%, #001f33 50%, #010c14 100%)"
    : "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)";

  const causticColor1 = isDark ? `rgba(100, 200, 255, ${0.25 * intensity})` : `rgba(14, 165, 233, ${0.12 * intensity})`;
  const causticColor2 = isDark ? `rgba(150, 230, 255, ${0.2 * intensity})` : `rgba(56, 189, 248, ${0.1 * intensity})`;

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden transition-all duration-1000 transform-gpu z-0" style={{ background: baseGradient }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -inset-[50%] mix-blend-screen" style={{ background: `radial-gradient(ellipse 40% 30% at 30% 30%, ${causticColor1}, transparent), radial-gradient(ellipse 45% 35% at 50% 60%, ${causticColor2}, transparent)`, animation: `marineCaustic1 ${12 / speed}s ease-in-out infinite`, filter: "blur(50px)" }} />
        <div className="absolute -inset-[50%] mix-blend-screen" style={{ background: `radial-gradient(ellipse 50% 40% at 60% 35%, ${causticColor2}, transparent), radial-gradient(ellipse 40% 45% at 25% 55%, ${causticColor1}, transparent)`, animation: `marineCaustic2 ${16 / speed}s ease-in-out infinite`, filter: "blur(60px)" }} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="absolute top-0" style={{ left: `${20 + i * 22}%`, width: "10%", height: "100%", background: `linear-gradient(180deg, ${isDark ? 'rgba(180, 230, 255, 0.08)' : 'rgba(56, 189, 248, 0.15)'} 0%, transparent 80%)`, transform: "skewX(-7deg)", animation: `marineRay ${8 + i * 2}s ease-in-out infinite`, animationDelay: `${i * -2}s`, filter: "blur(12px)" }} />
        ))}
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: isDark ? "linear-gradient(0deg, rgba(0, 10, 20, 0.6) 0%, transparent 100%)" : "linear-gradient(0deg, rgba(186, 230, 253, 0.4) 0%, transparent 100%)" }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marineCaustic1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(3%, 2%) scale(1.05); }
        }
        @keyframes marineCaustic2 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(-4%, 3%) scale(1.08); }
        }
        @keyframes marineRay {
          0%, 100% { opacity: 0.5; transform: skewX(-7deg) translateX(0); }
          50% { opacity: 1; transform: skewX(-10deg) translateX(15px); }
        }
      `}} />
    </div>
  );
}

// ==========================================
// ✨ 5. COMPONENT: AuroraBackground (Cosmic Silk Aurora)
// ==========================================
interface AuroraProps { isDark?: boolean; intensity?: number; }
function AuroraBackground({ isDark = true, intensity = 1 }: AuroraProps) {
  const baseGradient = isDark 
    ? "linear-gradient(180deg, #030206 0%, #080511 50%, #020104 100%)" 
    : "linear-gradient(135deg, #fefbfa 0%, #f6f1e5 50%, #eddcc4 100%)";

  return (
    <div className="fixed inset-0 overflow-hidden transition-all duration-1000 transform-gpu z-0" style={{ background: baseGradient }}>
      <div className="absolute inset-0 opacity-[0.22] mix-blend-screen pointer-events-none filter blur-[100px]" style={{ opacity: isDark ? 0.22 * intensity : 0.09 * intensity }}>
        <div className="absolute top-[-10%] left-[-20%] w-[90%] h-[90%] rounded-full bg-amber-500/20" style={{ animation: "auroraMove1 28s ease-in-out infinite alternate" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[80%] h-[90%] rounded-full bg-yellow-600/15" style={{ animation: "auroraMove2 34s ease-in-out infinite alternate" }} />
        <div className="absolute top-[25%] right-[15%] w-[70%] h-[70%] rounded-full bg-orange-500/10" style={{ animation: "auroraMove3 24s ease-in-out infinite alternate" }} />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes auroraMove1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(80px, 60px) scale(1.15); }
          100% { transform: translate(-40px, 30px) scale(0.95); }
        }
        @keyframes auroraMove2 {
          0% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-70px, -50px) scale(0.9); }
          100% { transform: translate(50px, 40px) scale(1.1); }
        }
        @keyframes auroraMove3 {
          0% { transform: translate(0px, 0px) scale(0.95); }
          50% { transform: translate(-30px, 70px) scale(1.05); }
          100% { transform: translate(60px, -20px) scale(0.95); }
        }
      `}} />
    </div>
  );
}

// ==========================================
// 🏠 6. MAIN INTERACTIVE PAGE COMPONENT
// ==========================================
export default function Home() {
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');
  const [bgType, setBgType] = useState<'snow' | 'fog' | 'glitch' | 'underwater' | 'aurora'>('snow'); 
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isGitModalOpen, setIsGitModalOpen] = useState<boolean>(false); 

  const dict = {
    TH: {
      host: "เครื่องแม่ข่าย", status: "สถานะระบบ", ready: "พร้อมทำงาน",
      badge: "AI-CS DEPARTMENT INTELLIGENCE SYSTEM • 2026",
      title1: "ระบบบริหารจัดการและวิเคราะห์ศักยภาพ", title2: "สาขาวิทยาการคอมพิวเตอร์ด้วย AI",
      desc: "แพลตฟอร์มวิเคราะห์ข้อมูลระดับองค์กร ประมวลผลข้อมูลเชิงลึก พยากรณ์กลุ่มเสี่ยง จัดสรรภาระงานคณาจารย์ และแนะนำแผนการเรียนอัจฉริยะ ผูกระบบฐานข้อมูลสถิติจริงประจำปีการศึกษา 2569",
      signIn: "🔐 เข้าสู่ระบบปฏิบัติการ", sourceCode: "คลังซอร์สโค้ด (GitHub)",
      dev: "นักพัฒนาระบบ", panelTitle: "ปรับแต่งสุนทรียภาพ", panelLang: "ภาษาของระบบ", panelBg: "สไตล์พื้นหลัง", panelTheme: "โหมดการทำงาน",
      themeFull: "Obsidian Velvet (โหมดค่ำคืนพรีเมียม)", themeLite: "Alabaster Pearl (โหมดถนอมสายตาชั้นสูง)",
      modalTitle: "เข้าถึงคลังเก็บรหัสซอร์สโค้ด", modalDesc: "กรุณาเลือกโมดูลส่วนงานที่คุณต้องการเข้าถึงเพื่อตรวจสอบโครงสร้างสถาปัตยกรรมระบบ",
      gitFrontend: "ระบบส่วนหน้าบ้าน (Frontend Framework)", gitBackend: "ระบบประมวลผลหลังบ้าน (Backend Server)",
      telemetryTitle: "การตรวจสอบสถานะระบบย่อยเรียลไทม์",
      telemetry: [
        { name: "ความเร็วคอร์กลาง", val: "0.042 ms" },
        { name: "ความแม่นยำ AI Model", val: "98.74%" },
        { name: "ความปลอดภัย Node DB", val: "SECURE" }
      ],
      features: [
        { title: "Academic Analytics", desc: "คำนวณสัดส่วนคะแนนสะสมจริง วิเคราะห์จุดวิกฤตหลักสูตรเชิงลึก", path: "/courses" },
        { title: "Risk Prediction", desc: "พยากรณ์และเฝ้าระวังกลุ่มเสี่ยง นศ. ขาดส่งงาน หรือมีโอกาสถอนเรียน", path: "/dashboard" },
        { title: "Course Recommend", desc: "จับคู่เป้าหมายสายงานวิทยาการคอมพิวเตอร์ระดับสากลเข้ากับวิชาจริงในคลังข้อมูล", path: "/ai" }
      ]
    },
    EN: {
      host: "HOST", status: "SYSTEM STATUS", ready: "OPERATIONAL",
      badge: "AI-CS DEPARTMENT INTELLIGENCE SYSTEM • 2026",
      title1: "Predictive Analytics & Management", title2: "Computer Science Intelligence Platform",
      desc: "An enterprise-grade MIS environment engineered for deep academic data analytics, dynamic faculty workload allocation, and intelligent career trajectory curation bound directly to the 2026 production database layer.",
      signIn: "🔐 Authenticate Platform", sourceCode: "Source Code (GitHub)",
      dev: "ENGINEERED BY", panelTitle: "Aesthetic Control Panel", panelLang: "System Language", panelBg: "Background Atmosphere", panelTheme: "Performance Profile",
      themeFull: "Obsidian Velvet (Premium Onyx)", themeLite: "Alabaster Pearl (Advanced Eye-Care)",
      modalTitle: "Repository Core Intelligence", modalDesc: "Select the targeted microservice node architecture to inspect production level structures.",
      gitFrontend: "Frontend Web Interface System", gitBackend: "Backend Analytical Core Engine",
      telemetryTitle: "REAL-TIME CORE TELEMETRY SUBSYSTEM",
      telemetry: [
        { name: "CORE LATENCY", val: "0.042 ms" },
        { name: "AI MODEL ACCURACY", val: "98.74%" },
        { name: "DB NODE INTEGRITY", val: "SECURE" }
      ],
      features: [
        { title: "Academic Analytics", desc: "Real-time cumulative matrix calculation and curriculum bottleneck analysis.", path: "/courses" },
        { title: "Risk Prediction", desc: "Predictive monitoring for at-risk student cohorts, dropouts, and task deluges.", path: "/dashboard" },
        { title: "Course Recommend", desc: "Algorithmic matching of premium tech career targets with active database courses.", path: "/ai" }
      ]
    }
  };

  const current = dict[lang];

  return (
    <div className={`relative flex min-h-screen w-screen flex-col items-center justify-center antialiased p-6 overflow-x-hidden selection:bg-amber-500/20 transition-colors duration-1000 ${isDark ? 'text-zinc-300 bg-[#030305]' : 'text-[#1e1a15] bg-[#fdfcfb]'}`}>
      
      {/* 🔮 Background Dynamic Engine */}
      {bgType === 'glitch' && <GlitchBackground color={isDark ? "#d4af37" : "#b08d53"} intensity={isDark ? 0.6 : 0.3} scanlines={isDark} isDark={isDark} />}
      {bgType === 'fog' && <FogBackground color={isDark ? "#1a1510" : "#dfd7c6"} opacity={isDark ? 0.3 : 0.4} isDark={isDark} />}
      {bgType === 'snow' && <SnowBackground isDark={isDark} count={100} speed={0.5} />}
      {bgType === 'underwater' && <UnderwaterBackground isDark={isDark} intensity={1} speed={0.7} />}
      {bgType === 'aurora' && <AuroraBackground isDark={isDark} intensity={1} />}

      {/* ⚙️ Control Gear Button */}
      <button onClick={() => setIsPanelOpen(!isPanelOpen)} className={`fixed top-6 right-6 z-40 p-3 rounded-full border shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu hover:rotate-90 hover:scale-105 cursor-pointer ${isDark ? 'bg-zinc-950/40 border-zinc-800/50 text-amber-400/80 hover:text-amber-300 hover:border-zinc-700' : 'bg-white/60 border-stone-200/80 text-amber-800/80 hover:text-amber-900 hover:border-stone-400'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      </button>

      {/* 🎛️ Sidebar Settings Drawer */}
      <div className={`fixed top-0 right-0 h-screen w-80 z-50 border-l backdrop-blur-2xl p-8 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${isPanelOpen ? 'translate-x-0 opacity-100 shadow-[-20px_0_60px_rgba(0,0,0,0.3)]' : 'translate-x-full opacity-0'} ${isDark ? 'bg-zinc-950/85 border-zinc-900' : 'bg-[#faf9f5]/90 border-stone-200'}`}>
        <div className="space-y-8 pt-10 font-sans">
          <div>
            <h3 className={`text-[9px] font-mono tracking-[0.3em] uppercase mb-4 ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>{current.panelTitle}</h3>
            <hr className={isDark ? 'border-zinc-900' : 'border-stone-200'} />
          </div>
          <div className="space-y-2">
            <label className={`text-[11px] font-mono tracking-wider uppercase opacity-60 ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>{current.panelLang}</label>
            <div className={`p-0.5 rounded-full flex gap-0.5 ${isDark ? 'bg-zinc-900/40' : 'bg-stone-200/50'}`}>
              <button onClick={() => setLang('TH')} className={`flex-1 py-1 text-[11px] font-mono rounded-full transition-all cursor-pointer ${lang === 'TH' ? (isDark ? 'bg-zinc-800/80 text-amber-300 font-bold shadow-sm' : 'bg-white text-stone-900 font-bold shadow-sm') : 'text-stone-500 hover:text-stone-400'}`}>TH</button>
              <button onClick={() => setLang('EN')} className={`flex-1 py-1 text-[11px] font-mono rounded-full transition-all cursor-pointer ${lang === 'EN' ? (isDark ? 'bg-zinc-800/80 text-amber-300 font-bold shadow-sm' : 'bg-white text-stone-900 font-bold shadow-sm') : 'text-stone-500 hover:text-stone-400'}`}>EN</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-[11px] font-mono tracking-wider uppercase opacity-60 ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>{current.panelBg}</label>
            <div className={`p-1 rounded-xl flex flex-col gap-0.5 ${isDark ? 'bg-zinc-900/40' : 'bg-stone-200/50'}`}>
              <button onClick={() => setBgType('snow')} className={`w-full py-1.5 text-[11px] font-mono text-left px-3 rounded-lg transition-all cursor-pointer ${bgType === 'snow' ? 'text-amber-500 font-bold bg-amber-500/5' : 'text-stone-500 hover:bg-black/5'}`}>❄️ Diamond Dust</button>
              <button onClick={() => setBgType('fog')} className={`w-full py-1.5 text-[11px] font-mono text-left px-3 rounded-lg transition-all cursor-pointer ${bgType === 'fog' ? 'text-amber-500 font-bold bg-amber-500/5' : 'text-stone-500 hover:bg-black/5'}`}>🌫️ Velvet Mist</button>
              <button onClick={() => setBgType('glitch')} className={`w-full py-1.5 text-[11px] font-mono text-left px-3 rounded-lg transition-all cursor-pointer ${bgType === 'glitch' ? 'text-amber-500 font-bold bg-amber-500/5' : 'text-stone-500 hover:bg-black/5'}`}>🌌 Cyber Matrix</button>
              <button onClick={() => setBgType('underwater')} className={`w-full py-1.5 text-[11px] font-mono text-left px-3 rounded-lg transition-all cursor-pointer ${bgType === 'underwater' ? 'text-amber-500 font-bold bg-amber-500/5' : 'text-stone-500 hover:bg-black/5'}`}>🌊 Abyssal Marine</button>
              <button onClick={() => setBgType('aurora')} className={`w-full py-1.5 text-[11px] font-mono text-left px-3 rounded-lg transition-all cursor-pointer ${bgType === 'aurora' ? 'text-amber-500 font-bold bg-amber-500/5' : 'text-stone-500 hover:bg-black/5'}`}>✨ Cosmic Aurora</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-[11px] font-mono tracking-wider uppercase opacity-60 ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>{current.panelTheme}</label>
            <button onClick={() => setIsDark(!isDark)} className={`w-full text-left p-3 rounded-xl border text-[11px] font-mono transition-all flex items-center justify-between cursor-pointer transform-gpu hover:scale-[1.01] ${isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-amber-500/30 hover:text-zinc-200' : 'bg-white border-stone-200 text-stone-700 hover:border-amber-700/30 hover:text-stone-900'}`}>
              <span>{isDark ? current.themeFull : current.themeLite}</span>
              <span>{isDark ? '🌙' : '👑'}</span>
            </button>
          </div>
        </div>
        <button onClick={() => setIsPanelOpen(false)} className={`w-full py-2.5 rounded-full border text-[9px] font-mono tracking-[0.2em] uppercase transition-all transform-gpu hover:scale-[0.98] cursor-pointer ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-white hover:border-zinc-700' : 'border-stone-300 bg-white text-stone-500 hover:text-stone-900 hover:border-stone-400'}`}>✕ Close</button>
      </div>

      {/* 🛰️ Live Monitoring Center Bar */}
      <div className={`absolute top-6 flex items-center gap-4 px-5 py-1.5 rounded-full border backdrop-blur-xl text-[9px] font-mono tracking-[0.2em] transition-all duration-700 ${isDark ? 'border-zinc-800/40 bg-zinc-950/30 text-zinc-500' : 'border-stone-200/80 bg-white/40 text-stone-500'}`}>
        <span>{current.host}: <span className={isDark ? 'text-zinc-400' : 'text-stone-800 font-bold'}>CLOUD_NODE_2569</span></span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
        </span>
        <span>{current.status}: <span className="text-amber-600/90 font-bold">{current.ready}</span></span>
      </div>

      {/* 🏛️ Main Core Content Area */}
      <main className="relative z-10 max-w-4xl text-center space-y-12 my-16 px-4">
        <div className="space-y-6">
          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-[9px] font-mono tracking-[0.25em] uppercase transition-all duration-700 ${isDark ? 'border-amber-500/10 bg-amber-500/[0.02] text-amber-400/80' : 'border-amber-700/20 bg-amber-700/[0.02] text-amber-900/80 font-bold'}`}>
            <span className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></span>
            {current.badge}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extralight tracking-tight leading-[1.15] text-balance">
            <span className={`block opacity-90 transition-colors duration-700 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>{current.title1}</span>
            <span className="block mt-3 font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-600 filter drop-shadow-[0_2px_15px_rgba(212,175,55,0.08)]">
              {current.title2}
            </span>
          </h1>
          <p className={`text-xs sm:text-sm font-sans font-light max-w-2xl mx-auto pt-2 leading-relaxed tracking-wide transition-colors duration-700 ${isDark ? 'text-zinc-400/80' : 'text-stone-600 font-medium'}`}>
            {current.desc}
          </p>
        </div>

        {/* 🔑 CTA Luxury Controllers */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center font-mono text-[10px] tracking-[0.25em] uppercase">
          {/* 👈 เปลี่ยนตรงนี้: จากเดิมไป /dashboard ให้เปลี่ยนไปหน้า /login ก่อนเพื่อความปลอดภัย */}
          <Link href="/login" className="group relative flex h-13 px-9 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium transition-all duration-500 cubic-bezier(0.16,1,0.3,1) shadow-[0_15px_30px_rgba(180,120,40,0.15)] hover:shadow-[0_20px_40px_rgba(180,120,40,0.3)] hover:scale-[1.03] cursor-pointer transform-gpu">
            {current.signIn}
            <span className="absolute inset-0 w-full h-full rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          <button
            onClick={() => setIsGitModalOpen(true)}
            className={`flex h-13 px-9 items-center justify-center rounded-full border font-medium backdrop-blur-sm transition-all duration-500 cubic-bezier(0.16,1,0.3,1) transform-gpu hover:scale-[1.02] cursor-pointer ${isDark ? 'border-zinc-800/80 bg-zinc-900/20 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400' : 'border-stone-200 bg-white/30 text-stone-700 hover:border-amber-700/40 hover:text-amber-800'}`}
          >
            {current.sourceCode}
          </button>
        </div>

        {/* 📊 Telemetry Metrics HUD Section */}
        <div className={`max-w-xl mx-auto p-4 rounded-xl border backdrop-blur-md transition-all duration-700 ${isDark ? 'border-zinc-900 bg-zinc-950/20' : 'border-stone-200 bg-white/40'}`}>
          <div className={`text-[8px] font-mono tracking-[0.3em] uppercase mb-3 text-center ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
            ⚡ {current.telemetryTitle}
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
            {current.telemetry.map((t, idx) => (
              <div key={idx} className={`p-2 rounded-lg border ${isDark ? 'border-zinc-900/60 bg-black/20' : 'border-stone-100 bg-stone-50/50'}`}>
                <div className={`text-[8px] tracking-wider mb-1 ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>{t.name}</div>
                <div className="text-amber-500 font-bold tracking-widest">{t.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ⚡ Features Grid Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 text-left font-sans">
          {current.features.map((feat, index) => (
            /* 👈 เปลี่ยนตรงนี้: บังคับให้การ์ดฟีเจอร์ทุกใบชี้ไปที่ /login (แทนที่ feat.path เดิม) เพื่อให้ต้องล็อกอินก่อนใช้งานทุกส่วน */
            <Link key={index} href="/login" className={`p-6 rounded-xl border backdrop-blur-md transition-all duration-500 cubic-bezier(0.16,1,0.3,1) group block transform-gpu hover:-translate-y-1.5 ${isDark ? 'border-zinc-900/50 bg-zinc-950/10 hover:border-amber-500/20 hover:bg-zinc-900/10' : 'border-stone-200/60 bg-white/30 hover:border-amber-700/30 hover:bg-white/70 shadow-2xs'}`}>
              <div className={`text-[11px] font-mono font-bold tracking-wider mb-2 flex items-center gap-2 ${isDark ? 'text-amber-500/80' : 'text-amber-800'}`}>
                <span className="w-1 h-1 bg-amber-500 rounded-full group-hover:scale-125 transition-transform duration-500"></span>
                {feat.title}
              </div>
              <p className={`text-[11px] leading-relaxed font-light transition-colors duration-500 ${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-stone-500 group-hover:text-stone-900'}`}>{feat.desc}</p>
            </Link>
          ))}
        </div>
      </main>

      {/* 💎 HIGH-END DESIGNER POPUP MODAL */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${isGitModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={() => setIsGitModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[4px] transition-opacity" />
        
        <div className={`relative w-full max-w-md rounded-2xl p-7 border shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-all duration-500 transform-gpu font-sans ${isGitModalOpen ? 'scale-100 translate-y-0' : 'scale-[0.97] translate-y-3'} ${isDark ? 'bg-zinc-950/90 border-zinc-900 text-white' : 'bg-[#fcfbfa]/95 border-stone-200 text-stone-900'}`}>
          <button onClick={() => setIsGitModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer text-[10px] font-mono tracking-widest">✕ CLOSE</button>
          
          <div className="space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-lg font-serif italic tracking-wide text-amber-500/90">{current.modalTitle}</h2>
              <p className={`text-[11px] font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>{current.modalDesc}</p>
            </div>
            
            <hr className={isDark ? 'border-zinc-900' : 'border-stone-100'} />
            
            <div className="flex flex-col gap-2.5 font-mono text-[11px] tracking-wide">
              <a 
                href="https://github.com/Kuriya05/cs-department-frontend.git" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-3.5 rounded-xl border text-left flex justify-between items-center transition-all transform-gpu hover:translate-x-1 ${isDark ? 'border-zinc-900 bg-zinc-900/20 hover:border-amber-500/30 hover:bg-zinc-900/50' : 'border-stone-200 bg-stone-50/50 hover:border-amber-700/40 hover:bg-white shadow-3xs'}`}
              >
                <span>🚀 {current.gitFrontend}</span>
                <span className="text-amber-500">→</span>
              </a>

              <a 
                href="https://github.com/Kuriya05/cs-department-backend.git" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-3.5 rounded-xl border text-left flex justify-between items-center transition-all transform-gpu hover:translate-x-1 ${isDark ? 'border-zinc-900 bg-zinc-900/20 hover:border-amber-500/30 hover:bg-zinc-900/50' : 'border-stone-200 bg-stone-50/50 hover:border-amber-700/40 hover:bg-white shadow-3xs'}`}
              >
                <span>📦 {current.gitBackend}</span>
                <span className="text-amber-500">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Footer Credit */}
      <footer className={`absolute bottom-6 text-[9px] font-mono tracking-[0.25em] transition-colors duration-700 ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>
        {current.dev}: <span className={isDark ? 'text-zinc-400' : 'text-stone-700 font-bold'}>KURIYA THATHE</span> • ID: <span className={isDark ? 'text-zinc-400' : 'text-stone-700 font-bold'}>6704101310</span>
      </footer>
    </div>
  );
}
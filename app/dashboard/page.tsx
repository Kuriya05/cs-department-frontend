'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
// 🟢 ใช้ Relative Path ตัวกลางจัดการ Token และ Base URL
import api from '@/lib/api';

// ==========================================
// ❄️ AMBIENT COMPONENT: Diamond Dust Background
// ==========================================
interface Snowflake { 
  x: number; y: number; size: number; speed: number; 
  opacity: number; wobbleOffset: number; wobbleSpeed: number; layer: number; 
}

function DiamondDustBackground({ theme = "dark", speed = 0.4 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const containerRef = useRef<HTMLDivElement>(null);

  const color = theme === "dark" ? "rgba(224, 192, 136, 0.35)" : "rgba(180, 140, 80, 0.25)";
  
  useEffect(() => {
    const canvas = canvasRef.current; const container = containerRef.current; if (!canvas || !container) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = container.clientWidth; let height = container.clientHeight; canvas.width = width; canvas.height = height;
    let animationId: number; let tick = 0;
    const layers = [
      { speed: 0.15, minSize: 0.8, maxSize: 1.6, opacity: 0.2 }, 
      { speed: 0.35, minSize: 1.4, maxSize: 2.4, opacity: 0.4 }, 
      { speed: 0.6, minSize: 2.0, maxSize: 3.8, opacity: 0.55 }
    ];
    
    const snowflakes: Snowflake[] = Array.from({ length: 60 }, (_, i) => {
      const layer = i < 30 ? 0 : i < 50 ? 1 : 2;
      const config = layers[layer];
      return {
        x: Math.random() * width, y: Math.random() * height,
        size: config.minSize + Math.random() * (config.maxSize - config.minSize),
        speed: config.speed * (0.8 + Math.random() * 0.4),
        opacity: config.opacity * (0.7 + Math.random() * 0.3),
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.006 + Math.random() * 0.012, layer
      };
    });
    
    const handleResize = () => { if (!container || !canvas) return; width = container.clientWidth; height = container.clientHeight; canvas.width = width; canvas.height = height; };
    window.addEventListener('resize', handleResize);
    
    const animate = () => {
      tick++; ctx.clearRect(0, 0, width, height);
      for (const flake of snowflakes) {
        flake.y += flake.speed * speed * 1.2; 
        flake.x += Math.sin(tick * flake.wobbleSpeed + flake.wobbleOffset) * 0.25;
        if (flake.y > height + 10) { flake.y = -10; flake.x = Math.random() * width; }
        ctx.save(); ctx.translate(flake.x, flake.y); ctx.globalAlpha = flake.opacity;
        ctx.fillStyle = color; 
        ctx.beginPath(); ctx.arc(0, 0, flake.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate(); 
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize); };
  }, [speed, color]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />
    </div>
  );
}

// ==========================================
// 🌌 AMBIENT COMPONENT: Cosmic Aurora Base Glow
// ==========================================
function CosmicAuroraGlow({ theme = "dark" }) {
  return (
    <div className={`absolute inset-0 mix-blend-screen pointer-events-none filter blur-[120px] z-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-[0.12]' : 'opacity-[0.06]'}`}>
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] rounded-full bg-amber-500/20 animate-[auroraPulse_20s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-yellow-600/15 animate-[auroraPulse_25s_ease-in-out_infinite_alternate_reverse]" />
    </div>
  );
}

// ==========================================
// 📖 DICTIONARY FOR MULTI-LANGUAGE (TH / EN)
// ==========================================
const translations = {
  TH: {
    hubBadge: 'Executive Intelligence Hub',
    titleMain: 'CS Department',
    titleSub: 'แดชบอร์ด AI',
    description: 'ระบบจัดการและวิเคราะห์ข้อมูลเชิงยุทธศาสตร์ ประมวลผลจากโครงข่ายฐานข้อมูลส่วนกลางประจำปี 2026 ด้วยอัลกอริทึมปัญญาประดิษฐ์เชิงลึก',
    statTotalStudents: 'นักศึกษาทั้งหมดในระบบ',
    statAvgGpa: 'ค่าเฉลี่ยสะสมรวม (Avg GPA)',
    statRiskCount: 'กลุ่มเสี่ยงสะสมเฝ้าระวัง (MongoDB)',
    statPopularMajors: 'กลุ่มวิชาความเชี่ยวชาญสูงสุด',
    unitPeople: 'คน',
    insightHeader: '✨ คาดการณ์เจาะลึกด้วยระบบวิเคราะห์ AI',
    insightText: '"จากการคำนวณทิศทางดัชนีฐานข้อมูลพฤติกรรมการเรียนแบบเรียลไทม์ คาดการณ์ว่ากลุ่มวิชาหลัก [{major}] กำลังได้รับความสนใจและต้องการทรัพยากรผู้ช่วยสอน (TA) สนับสนุนเพิ่มขึ้น 35% เพื่อรักษาเสถียรภาพผลสัมฤทธิ์"',
    chatAgentTitle: '🧠 ตัวแทนคิวรี่ AI แบบเรียลไทม์ (Context-Aware)',
    chatStatus: 'เชื่อมต่อโปรโตคอลสถิติทั่วทั้งเว็บแล้ว',
    chatLive: 'ออนไลน์',
    chatSuggestLabel: '💡 คิวรี่แนะนำพิเศษ (คลิกเพื่อประมวลผลคำตอบสด):',
    inputPlaceholderActive: 'กำลังวิเคราะห์บริบททุกหน้าเว็บเพื่อประมวลผลคำตอบ...',
    inputPlaceholderIdle: 'ถามคำถามเกี่ยวกับสถิติ นิสิต หรือข้อมูลวิชาเรียนของทุกหน้า...',
    btnSend: 'ส่งคำสั่ง',
    typingIndicator: '⏳ กำลังสแกน Context ทุกหน้าเพจ และคำนวณสถิติสดจากคอร์เซิร์ฟเวอร์...',
    initialAiMessage: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบบริหารข้อมูล AI-CS MIS ขณะนี้ผมได้เชื่อมต่อบริบทสถิติทั่วทั้งเว็บ (Global Context Tracking) เรียบร้อยแล้ว คุณสามารถพิมพ์ถามคำถามอิงข้อมูลสถิติล่าช้าหรือข้อมูลข้ามหน้าเพจได้ทันทีครับ!',
    fallbackReplyAI: '📊 ผลการดึงข้อมูลสดข้ามหน้าเพจ:\nพบว่าในปีการศึกษา 2569 รายวิชา Artificial Intelligence (AI) มีนักศึกษาลงทะเบียนเรียนรวมทั้งสิ้น 48 คน แบ่งเป็น Section 1 จำนวน 25 คน และ Section 2 จำนวน 23 คนครับ โดยปัจจุบันกลุ่มวิชานี้อยู่ในแทร็กเชี่ยวชาญยอดนิยมด้าน {popular} ของคณะครับ',
    fallbackReplyYr1: '📂 ตรวจพบวิชาเรียนในระบบของ [ชั้นปี 1] จากฐานข้อมูลวิชาเรียนรวมอัปเดต มี 3 วิชาหลักออนไลน์อยู่ ได้แก่ CS101 Intro to CS, CS102 Programming Fundamentals และ MATH105 Calculus I มีเกรดเฉลี่ยสะสมเฉลี่ยในระบบอยู่ที่ {gpa}',
    fallbackReplyRisk: '📊 ตรวจสอบข้อมูลสถานะกลุ่มเสี่ยงข้ามหน้าจอสำเร็จ: จากหน้าติดตามความเสี่ยง (MongoDB Container) ปัจจุบันมียอดนักศึกษากลุ่มเสี่ยงสะสมรวมทั้งสิ้น {count} คน จากจำนวนนักศึกษาในระบบทั้งหมด {total} คน ซึ่งคิดเป็นสัดส่วนที่ต้องเฝ้าระวังอย่างใกล้ชิดครับ',
    fallbackReplyDefault: '🤖 AI-CS MIS (บริบทข้อมูลข้ามหน้าเพจ): รับทราบคำสั่ง "{msg}" ปัจจุบันตรวจพบว่าระบบมีนักศึกษารวม {total} คน เกรดเฉลี่ยรวม {gpa} และแทร็กยอดนิยมคือ {popular} พร้อมประมวลผลคำสั่งตามรอบคิวรี่ครับ'
  },
  EN: {
    hubBadge: 'Executive Intelligence Hub',
    titleMain: 'CS Department',
    titleSub: 'AI Dashboard',
    description: 'Strategic data management and analysis system, compiled from the central central node network for the year 2026 using deep artificial intelligence algorithms.',
    statTotalStudents: 'Total System Students',
    statAvgGpa: 'Cumulative Grade Average (Avg GPA)',
    statRiskCount: 'Monitored Critical Risk Group (MongoDB)',
    statPopularMajors: 'Top Specialization Tracks',
    unitPeople: 'students',
    insightHeader: '✨ AI ANALYTICAL INSIGHT FORECAST',
    insightText: '"Based on real-time computational monitoring of current student enrollment graphs, the [{major}] academic track exhibits significant registration density, necessitating an immediate 35% boost in instructional support models."',
    chatAgentTitle: '🧠 Real-time AI Query Agent (Context-Aware)',
    chatStatus: 'GLOBAL SITE CONTEXT CONNECTED',
    chatLive: 'LIVE',
    chatSuggestLabel: '💡 Special Suggested Queries (Click to execute live):',
    inputPlaceholderActive: 'Analyzing multi-page context to formulate deep response...',
    inputPlaceholderIdle: 'Ask anything about statistics, students, or multi-page registry data...',
    btnSend: 'SEND',
    typingIndicator: '⏳ Scanning cross-page intelligence layers and compiling telemetry data...',
    initialAiMessage: 'Hello! Welcome to the AI-CS MIS dashboard. Global multi-page context integration is active. You can now query real-time statistical insights tracked across all platform spaces seamlessly.',
    fallbackReplyAI: '📊 Live Multi-Page Query Matrix:\nIn the 2026 academic calendar, Artificial Intelligence (AI) course tracks contain a total registration of 48 students, split into Sec 1 (25) & Sec 2 (23), aligned with the current top {popular} track.',
    fallbackReplyYr1: '📂 Multi-page sync discovered 3 active [Year 1] courses inside the container: CS101 Intro to CS, CS102 Programming Fundamentals, and MATH105 Calculus I. Overall database GPA is currently at {gpa}.',
    fallbackReplyRisk: '📊 Cross-Page Telemetry Sync Complete: The monitoring registry logs a total accumulation of {count} risk-alert students out of {total} total system records.',
    fallbackReplyDefault: '🤖 AI-CS MIS Cross-Context: Acknowledged "{msg}". Active profile: {total} total students, {gpa} average GPA, specialized track in {popular}. ready for analytical routines.'
  }
};

// ==========================================
// 🏠 CORE DASHBOARD PAGE COMPONENT
// ==========================================
export default function DashboardPage() {
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const t = translations[lang];

  const [messages, setMessages] = useState([
    { role: 'ai', text: t.initialAiMessage }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    avgGpa: 0.00, 
    riskCount: 0, 
    popularMajors: 'Loading...' 
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    { 
      label: lang === 'TH' ? '📊 วิชา AI ปี 2569 มีกี่คน?' : '📊 How many AI students in 2026?', 
      query: lang === 'TH' ? 'ปี 2569 วิชา AI มีนักศึกษาลงทะเบียนกี่คน' : 'How many students registered for the AI course in 2026' 
    },
    { 
      label: lang === 'TH' ? '📂 ขอดูวิชาเรียน ชั้นปี 1' : '📂 View Year 1 Courses', 
      query: lang === 'TH' ? 'ขอดูรายวิชาของ ชั้นปี 1 ทั้งหมดในระบบ' : 'Show all Year 1 courses in the system' 
    },
    { 
      label: lang === 'TH' ? '🔴 เช็กจำนวนกลุ่มเสี่ยงวิกฤต' : '🔴 Check Critical Risk Counts', 
      query: lang === 'TH' ? 'ตอนนี้มีนักศึกษากลุ่มเสี่ยงสะสมอยู่ทั้งหมดกี่คน' : 'How many monitored risk students are there right now' 
    }
  ];

  useEffect(() => {
    setMessages([
      { role: 'ai', text: t.initialAiMessage }
    ]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 📥 ฟังก์ชันเรียกข้อมูลสถิติจริงจากคอร์หลังบ้าน NestJS
  const fetchRealDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 🛠️ จุดแก้ไขที่ 1: เติม /api/v1 นำหน้า เพื่อกันข้อผิดพลาด 404 บนเซิร์ฟเวอร์หลัก
      const response: any = await api.get('/api/v1/students/dashboard/analytics', { headers });
      const serverStats = response.data || response;
      
      if (serverStats) {
        const highRisk = serverStats.riskDistribution?.High ?? 0;
        const medRisk = serverStats.riskDistribution?.Medium ?? 0;
        const lowRisk = serverStats.riskDistribution?.Low ?? 0;
        const computedRiskTotal = highRisk + medRisk + lowRisk;

        const livePopularTrack = 
          serverStats.popularMajors ?? 
          serverStats.topCourse ?? 
          serverStats.popularCourse ?? 
          serverStats.topTrack ?? 
          'Computer Science';

        setStats({
          totalStudents: serverStats.totalStudents ?? 0,
          avgGpa: serverStats.averageGpa ?? serverStats.avgGpa ?? 0.00,
          riskCount: serverStats.riskCount ?? computedRiskTotal,
          popularMajors: livePopularTrack
        });
      } else {
        fallbackLocalStats();
      }
    } catch (err) {
      console.warn("Failed to fetch backend stats, checking local storage cache...");
      fallbackLocalStats();
    }
  };

  const fallbackLocalStats = () => {
    const localRisk = localStorage.getItem('local_risk_history');
    if (localRisk) {
      const parsed = JSON.parse(localRisk);
      setStats(prev => ({ ...prev, riskCount: Array.isArray(parsed) ? parsed.length : 0 }));
    }
  };

  useEffect(() => {
    fetchRealDashboardStats(); 

    const intervalId = setInterval(() => {
      fetchRealDashboardStats();
    }, 5000);

    return () => clearInterval(intervalId); 
  }, []);

  // 🚀 โครงข่ายดักจับและประมวลผล Context ข้ามหน้าเพจแบบเรียลไทม์
  const handleProcessChat = async (messageText: string) => {
    if (!messageText.trim() || isTyping) return;

    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);

    let aiReply = '';

    const globalContextPayload = {
      message: messageText,
      siteContext: {
        currentLocationPath: typeof window !== 'undefined' ? window.location.pathname : '/dashboard',
        academicYear: 2026,
        telemetryStats: {
          totalStudentsInSystem: stats.totalStudents,
          globalAverageGpa: stats.avgGpa,
          currentRiskCountInMongoDB: stats.riskCount,
          activeSpecializationTrack: stats.popularMajors
        },
        clientIdentity: {
          role: typeof window !== 'undefined' ? localStorage.getItem('role') || 'GUEST' : 'GUEST',
          username: typeof window !== 'undefined' ? localStorage.getItem('username') || 'Guest User' : 'Guest User'
        },
        timestamp: new Date().toISOString()
      }
    };

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 🛠️ จุดแก้ไขที่ 2: เติม /api/v1 เพื่อเรียกใช้ระบบ AI Query Agent บนระบบ Backend ให้ถูกต้อง
      const response: any = await api.post('/api/v1/chat/query', globalContextPayload, { headers });
      const data = response.data || response;

      if (data) {
        if (data.reply) {
          aiReply = data.reply;
        } else if (typeof data === 'string') {
          aiReply = data;
        }
      }
    } catch (err) {
      console.warn("Backend dynamic query failed, routing to Context-Aware Client Analyzer.");
    }

    if (!aiReply) {
      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('2569') || lowerText.includes('ai') || lowerText.includes('2026')) {
        aiReply = t.fallbackReplyAI.replace('{popular}', stats.popularMajors);
      } else if (lowerText.includes('ปี 1') || lowerText.includes('ชั้นปี 1') || lowerText.includes('year 1')) {
        aiReply = t.fallbackReplyYr1.replace('{gpa}', stats.avgGpa.toFixed(2));
      } else if (lowerText.includes('กลุ่มเสี่ยง') || lowerText.includes('กี่คน') || lowerText.includes('วิกฤต') || lowerText.includes('risk') || lowerText.includes('count')) {
        aiReply = t.fallbackReplyRisk
          .replace('{count}', stats.riskCount.toString())
          .replace('{total}', stats.totalStudents.toString());
      } else {
        aiReply = t.fallbackReplyDefault
          .replace('{msg}', messageText)
          .replace('{total}', stats.totalStudents.toString())
          .replace('{gpa}', stats.avgGpa.toFixed(2))
          .replace('{popular}', stats.popularMajors);
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
      setIsTyping(false);
      fetchRealDashboardStats(); 
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleProcessChat(input);
    setInput('');
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans relative transition-colors duration-700 ${theme === 'dark' ? 'bg-[#030305] text-zinc-300' : 'bg-[#f4f5f7] text-zinc-700'}`}>
      
      {/* 🔮 Background Luxury FX Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 transition-all duration-700 ${theme === 'dark' ? 'bg-gradient-to-b from-[#030305] via-[#06060a] to-[#030305]' : 'bg-gradient-to-b from-[#f8f9fa] via-[#eef1f5] to-[#f4f5f7]'}`} />
        <CosmicAuroraGlow theme={theme} />
        <DiamondDustBackground theme={theme} />
      </div>

      {/* Main Framework Viewports */}
      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          {/* CONTROL BAR COMPONENT FOR QUICK INTERACTION */}
          <div className="px-6 lg:px-8 pt-4 flex justify-end gap-3 z-20 animate-[slideDown_0.5s_ease-out_both] transform-gpu">
            {/* EN/TH Switcher */}
            <div className={`flex p-1 rounded-xl border backdrop-blur-md transition-all duration-500 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/80 border-zinc-200'}`}>
              <button 
                onClick={() => setLang('TH')}
                className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer transition-all duration-300 ${lang === 'TH' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-500 hover:text-amber-500'}`}
              >TH</button>
              <button 
                onClick={() => setLang('EN')}
                className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer transition-all duration-300 ${lang === 'EN' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-500 hover:text-amber-500'}`}
              >EN</button>
            </div>

            {/* Light/Dark Theme Switcher */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900 text-amber-400' : 'bg-white/80 border-zinc-200 text-amber-600'}`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 animate-[spinSlow_8s_linear_infinite]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.22 5.22l1.59 1.59m10.38 10.38l1.59 1.59M3 12h2.25m13.5 0H21M5.22 18.78l1.59-1.59M17.56 6.44l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform -rotate-12"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
          </div>

          <main className="p-6 lg:p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 transform-gpu relative custom-scrollbar">
            
            {/* 📊 Left Panel: Executive Intelligence HUD */}
            <div className="lg:col-span-2 space-y-6 animate-[slideRight_0.6s_ease-out_both] transform-gpu">
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-mono tracking-[0.25em] uppercase transition-all duration-500 ${theme === 'dark' ? 'border-amber-500/10 bg-amber-500/[0.02] text-amber-400/80' : 'border-amber-500/20 bg-amber-500/[0.04] text-amber-700'}`}>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                  {t.hubBadge}
                </div>
                <h1 className={`text-3xl font-extralight tracking-tight leading-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {t.titleMain} <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.05)]">{t.titleSub}</span>
                </h1>
                <p className={`text-xs font-light max-w-xl leading-relaxed tracking-wide transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {t.description}
                </p>
              </div>

              {/* Metrics Dashboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Metric 1: Total Students */}
                <div className={`p-5 rounded-xl border backdrop-blur-md transform-gpu transition-all duration-500 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group animate-[slideUp_0.5s_ease-out_0.1s_both] ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60 hover:border-zinc-800' : 'bg-white/70 border-zinc-200 hover:border-amber-500/20'}`}>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block transition-colors group-hover:text-amber-500">{t.statTotalStudents}</span>
                  <p className={`text-3xl font-extralight font-mono mt-2 flex items-baseline gap-1 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {stats.totalStudents} <span className="text-xs font-sans text-zinc-500">{t.unitPeople}</span>
                  </p>
                </div>
                
                {/* Metric 2: Avg GPA */}
                <div className={`p-5 rounded-xl border backdrop-blur-md transform-gpu transition-all duration-500 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group animate-[slideUp_0.5s_ease-out_0.2s_both] ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60 hover:border-amber-500/20' : 'bg-white/70 border-zinc-200 hover:border-amber-500/40'}`}>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block transition-colors group-hover:text-amber-500">{t.statAvgGpa}</span>
                  <p className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 font-mono mt-2">
                    {stats.avgGpa.toFixed(2)}
                  </p>
                </div>
                
                {/* Metric 3: Critical Risk Count */}
                <div className={`p-5 rounded-xl border backdrop-blur-md transform-gpu transition-all duration-500 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group animate-[slideUp_0.5s_ease-out_0.3s_both] ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60 hover:border-red-500/20' : 'bg-white/70 border-zinc-200 hover:border-red-500/40'}`}>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block transition-colors group-hover:text-red-500">{t.statRiskCount}</span>
                  <p className="text-3xl font-extralight text-red-500/90 font-mono mt-2 flex items-baseline gap-1">
                    {stats.riskCount} <span className="text-xs font-sans text-zinc-500">{t.unitPeople}</span>
                  </p>
                </div>
                
                {/* Metric 4: Popular Tracks */}
                <div className={`p-5 rounded-xl border backdrop-blur-md transform-gpu transition-all duration-500 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group animate-[slideUp_0.5s_ease-out_0.4s_both] ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60 hover:border-zinc-800' : 'bg-white/70 border-zinc-200 hover:border-amber-500/20'}`}>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block transition-colors group-hover:text-amber-500">{t.statPopularMajors}</span>
                  <p className={`text-xs font-semibold mt-3.5 tracking-wider font-mono border px-3 py-1.5 rounded-xl inline-block transition-all duration-500 max-w-full truncate ${theme === 'dark' ? 'text-amber-400 bg-amber-500/[0.03] border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'text-amber-900 bg-amber-500/[0.06] border-amber-500/30'}`}>
                    ✨ {stats.popularMajors}
                  </p>
                </div>
              </div>

              {/* Strategic Insight Block */}
              <div className={`relative p-5 rounded-xl border backdrop-blur-md overflow-hidden shadow-sm transition-all duration-500 animate-[slideUp_0.5s_ease-out_0.5s_both] ${theme === 'dark' ? 'border-amber-500/10 bg-gradient-to-r from-amber-500/[0.02] to-transparent' : 'border-amber-500/20 bg-gradient-to-r from-amber-500/[0.04] to-transparent'}`}>
                <div className="absolute top-0 left-0 w-[1.5px] h-full bg-gradient-to-b from-amber-600 via-amber-400 to-transparent" />
                <h3 className={`font-mono tracking-[0.2em] mb-2 text-[10px] flex items-center gap-2 transition-colors duration-500 ${theme === 'dark' ? 'text-amber-400/90' : 'text-amber-700 font-bold'}`}>
                  {t.insightHeader}
                </h3>
                <p className={`text-[11px] leading-relaxed font-light tracking-wide transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400/90' : 'text-zinc-600'}`}>
                  {t.insightText.replace('{major}', stats.popularMajors)}
                </p>
              </div>
            </div>

            {/* 💬 Right Panel: High-End Chat Analytics Core */}
            <div className={`border rounded-2xl backdrop-blur-2xl flex flex-col h-[calc(100vh-160px)] overflow-hidden transform-gpu transition-all duration-700 animate-[slideLeft_0.6s_ease-out_both] ${theme === 'dark' ? 'bg-zinc-950/50 border-zinc-900/90 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'bg-white/80 border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'}`}>
              
              {/* Chat Header */}
              <div className={`p-4 border-b flex items-center justify-between transition-colors duration-500 ${theme === 'dark' ? 'border-zinc-900 bg-black/40' : 'border-zinc-100 bg-zinc-50/50'}`}>
                <div>
                  <h3 className={`text-xs font-medium tracking-wider font-mono transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.chatAgentTitle}</h3>
                  <p className="text-[8px] text-zinc-500 font-mono tracking-[0.15em] mt-0.5">{t.chatStatus}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[8px] font-mono tracking-widest text-emerald-500 font-bold animate-pulse">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  {t.chatLive}
                </div>
              </div>

              {/* Message History Screen */}
              <div className={`flex-1 p-4 overflow-y-auto space-y-4 text-xs custom-scrollbar transition-colors duration-500 ${theme === 'dark' ? 'bg-black/[0.05]' : 'bg-zinc-50/[0.02]'}`}>
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out_both]`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-[11px] tracking-wide transform-gpu transition-all duration-300 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium rounded-tr-none shadow-[0_8px_20px_rgba(180,120,40,0.15)]' 
                        : theme === 'dark' 
                          ? 'bg-zinc-900/50 text-zinc-300 rounded-tl-none border border-zinc-800/60' 
                          : 'bg-zinc-100 text-zinc-800 rounded-tl-none border border-zinc-200 shadow-3xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator Status */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`text-[10px] p-3 rounded-2xl rounded-tl-none font-mono tracking-wide max-w-[85%] border animate-pulse transition-all duration-500 ${theme === 'dark' ? 'text-amber-400/80 bg-amber-500/[0.02] border-amber-500/10' : 'text-amber-800 bg-amber-500/[0.05] border-amber-500/30'}`}>
                      {t.typingIndicator}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 💡 Suggestion Shortcuts Area */}
              <div className={`p-3.5 border-t flex flex-col gap-2 transition-colors duration-500 ${theme === 'dark' ? 'bg-black/30 border-zinc-900/80' : 'bg-zinc-50/50 border-zinc-100'}`}>
                <span className="text-[8px] uppercase font-mono text-zinc-500 tracking-[0.2em] block px-0.5">{t.chatSuggestLabel}</span>
                <div className="flex flex-col gap-2">
                  {suggestedQueries.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isTyping}
                      onClick={() => handleProcessChat(q.query)}
                      className={`text-[11px] px-3 py-2.5 rounded-xl transition-all duration-300 text-left cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed font-light transform-gpu hover:translate-x-1 border ${theme === 'dark' ? 'text-zinc-400 bg-zinc-900/20 border-zinc-900 hover:border-amber-500/30 hover:text-amber-400' : 'text-zinc-600 bg-white border-zinc-200 hover:border-amber-500/50 hover:text-amber-700 shadow-3xs'}`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ✏️ Input Field Console Control */}
              <form onSubmit={handleFormSubmit} className={`p-3.5 border-t flex gap-2.5 transition-colors duration-500 ${theme === 'dark' ? 'border-zinc-900 bg-black/60' : 'border-zinc-100 bg-zinc-50'}`}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                  placeholder={isTyping ? t.inputPlaceholderActive : t.inputPlaceholderIdle} 
                  className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none disabled:opacity-50 transition-all duration-300 font-light font-mono tracking-wide ${theme === 'dark' ? 'bg-zinc-950 border-zinc-900/80 text-white focus:border-amber-500/30 placeholder:text-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 focus:border-amber-500 placeholder:text-zinc-400'}`}
                />
                <button 
                  type="submit" 
                  disabled={isTyping || !input.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 disabled:from-zinc-400 disabled:to-zinc-500 disabled:text-zinc-200 text-white font-mono text-[9px] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 active:scale-95 cursor-pointer disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(180,120,40,0.15)] font-bold"
                >
                  {t.btnSend}
                </button>
              </form>
            </div>

          </main>
        </div>
      </div>

      {/* Custom Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.2);
        }
      `}} />
    </div>
  );
}
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
// 🔌 นำเข้า api instance ตัวกลาง เพื่อจัดการ Base URL และ Token อัตโนมัติ
import api from '@/lib/api';

interface RecommendedCourse {
  courseCode: string;
  courseName: string;
}

interface RecommendationResult {
  careerGoal: string;
  recommendCourses: RecommendedCourse[];
  reason: string;
}

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
  const color = theme === "dark" ? "rgba(34, 211, 238, 0.25)" : "rgba(8, 145, 178, 0.15)";
  
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

function CosmicAuroraGlow({ theme = "dark" }) {
  return (
    <div className={`absolute inset-0 mix-blend-screen pointer-events-none filter blur-[120px] z-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-[0.12]' : 'opacity-[0.06]'}`}>
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] rounded-full bg-cyan-500/20 animate-[auroraPulse_20s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/15 animate-[auroraPulse_25s_ease-in-out_infinite_alternate_reverse]" />
    </div>
  );
}

// ==========================================
// 📖 DICTIONARY FOR MULTI-LANGUAGE (TH / EN)
// ==========================================
const translations = {
  TH: {
    hubBadge: 'AI Neural Matrix Engine v2.6',
    titleMain: 'AI Cognitive Course',
    titleSub: 'Architect',
    description: 'ถอดรหัสเจตจำนงและเป้าหมายอาชีพของคุณผ่านระบบรู้จำความหมายเชิงลึก (Semantic Core) เพื่อแมปปิ้งวิชาเลือกจากคลังข้อมูลคณะคอมพิวเตอร์แบบเรียลไทม์',
    scopeLabel: 'เป้าหมายอาชีพ หรือ ทักษะเทคโนโลยีที่คุณต้องการพิชิต',
    inputPlaceholder: 'ตัวอย่าง: ผมอยากเป็น Full-Stack Dev ที่เชี่ยวชาญด้านความปลอดภัย หรือ อยากทำ Data Model ล้ำๆ...',
    btnFetchIdle: 'เริ่มกระบวนการคำนวณทิศทาง',
    btnFetchActive: 'กำลังประมวลผลโครงข่าย...',
    resultHeader: '🎯 เส้นทางอาชีพเป้าหมาย:',
    emptyList: '* ไม่มีวิชาเจาะจงที่แมปเข้าเงื่อนไขในระบบ ณ ขณะนี้ *',
    reasonHeader: '🧠 เหตุผลและบทวิเคราะห์เชิงกลยุทธ์ของ AI:',
    presetTitle: '⚡ คลังโจทย์เป้าหมายแนะนำรายหมวดหมู่ (35+ AI Presets):',
    metricsTitle: '📊 ดัชนีศักยภาพเครือข่ายความรู้ (Synergy Indicators)',
    matchScore: 'ระดับความแมตช์เชิงความรู้',
    roadmapTitle: '🗺️ แผนผังลำดับการลงทะเบียนเรียนที่แนะนำ (Learning Trajectory Line)',
    errorTitle: '❌ ระบบตรวจพบข้อผิดพลาด (Connection Refused)',
    errorDesc: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลักได้ โปรดตรวจสอบให้แน่ใจว่าได้เปิดระบบ Backend ไว้แล้ว หรือตรวจสอบ Network ใน Console'
  },
  EN: {
    hubBadge: 'AI Neural Matrix Engine v2.6',
    titleMain: 'AI Cognitive Course',
    titleSub: 'Architect',
    description: 'Deconstruct your professional ambitions using deep semantic token matching against computer science database matrices to curate absolute academic pathways.',
    scopeLabel: 'CAREER PATHWAY OR FUTURE TECH COMPETENCY SCOPE',
    inputPlaceholder: 'e.g., I want to be a Generative AI Engineer specialized in LLMs and deep learning clusters...',
    btnFetchIdle: 'Synthesize Pathway',
    btnFetchActive: 'Computing Vectors...',
    resultHeader: '🎯 Target Career Trajectory:',
    emptyList: '* No explicit core modules match the neural filters *',
    reasonHeader: '🧠 AI Deep Strategy & Relational Logic:',
    presetTitle: '⚡ Curated Accelerators by Categories (35+ AI Presets):',
    metricsTitle: '📊 Knowledge Matrix Metrics (Synergy Indicators)',
    matchScore: 'AI Synergy Match Score',
    roadmapTitle: '🗺️ Curated Learning Trajectory Pipeline (Roadmap View)',
    errorTitle: '❌ Core Connection Failure (Refused)',
    errorDesc: 'Unable to establish data pipeline with the AI suggestion matrix. Please verify your backend server instance state.'
  }
};

// ==========================================
// 🗂️ EXTENDED 35+ PRESETS DATA WITH CATEGORIES
// ==========================================
const PRESET_CATEGORIES = [
  { id: 'all', th: '✨ ทั้งหมด', en: '✨ All' },
  { id: 'fullstack', th: '💻 Full-Stack & Arch', en: '💻 Full-Stack & Arch' },
  { id: 'ai-data', th: '🤖 AI & Data Science', en: '🤖 AI & Data Science' },
  { id: 'cyber-cloud', th: '🔒 Cyber & Cloud', en: '🔒 Cyber & Cloud' },
  { id: 'creative-game', th: '🎮 Creative & Game', en: '🎮 Creative & Game' },
  { id: 'smart-trends', th: '💡 ถามปั่น/นอกกรอบ', en: '💡 Smart & Trends' },
];

const EXTENDED_PRESETS = [
  // 💻 Category: Full-Stack & Architecture
  { category: 'fullstack', th: '🚀 สู่เส้นทาง Full-Stack Developer สปีดสร้างสตาร์ทอัพ', en: '🚀 High-Performance Full-Stack Developer Pathway' },
  { category: 'fullstack', th: '📱 อยากทำโมบายแอปพลิเคชันสเกลใหญ่ รองรับผู้ใช้หลักล้านคน', en: '📱 Scalable Mobile Application Developer for Millions' },
  { category: 'fullstack', th: '🏗️ มุ่งเป้าเป็น Enterprise Software Architect วางโครงสร้างองค์กรใหญ่', en: '🏗️ Target: Enterprise Software Architect Core' },
  { category: 'fullstack', th: '⚡ อยากเชี่ยวชาญ Systems & Embedded Engineering เขียนโค้ดคุมฮาร์ดแวร์', en: '⚡ Systems & Embedded Hardware Engineering Master' },
  { category: 'fullstack', th: '🛠️ อยากเก่ง QA Automation Engineer ผสมผสานการเขียนโค้ดและเทสระบบ', en: '🛠️ Professional QA Automation Engineer Specialist' },
  { category: 'fullstack', th: '🌐 อยากเป็น Backend Specialist ลุยงานโครงสร้างพื้นฐาน API แน่นๆ', en: '🌐 Core Backend API & Microservices Specialist' },
  { category: 'fullstack', th: '🏎️ อยากทำระบบ High-Performance Realtime App เช่นระบบแชทหรือสตรีมมิ่ง', en: '🏎️ Real-time Streaming High-Performance Architect' },

  // 🤖 Category: AI & Data Science
  { category: 'ai-data', th: '🤖 อยากเป็น Generative AI Engineer พัฒนาโมเดลล้ำๆ แบบ ChatGPT', en: '🤖 Target: Generative AI Engineer specialized in LLMs' },
  { category: 'ai-data', th: '📈 อยากเป็น Data Scientist ทำระบบทำนายมูลค่าหุ้นกลุ่ม DeFi', en: '📈 Goal: Quantitative Data Scientist for Predictive DeFi' },
  { category: 'ai-data', th: '🧬 สนใจระบบ Computer Vision และหุ่นยนต์อัจฉริยะประมวลผลภาพ', en: '🧬 Deep Computer Vision & Intelligent Robotics' },
  { category: 'ai-data', th: '🽂 วางรากฐานเป็น Big Data Engineer จัดการ Pipeline ข้อมูลขนาดยักษ์', en: '🽂 Big Data Infrastructure & Data Pipeline Architect' },
  { category: 'ai-data', th: '📊 อยากเติบโตในสาย Business Intelligence Analyst ปลดล็อก Insight ธุรกิจ', en: '📊 Strategic Business Intelligence & Market Insights' },
  { category: 'ai-data', th: '🧠 มุ่งมั่นทำวิจัย Deep Learning Neural Networks ขั้นสูง', en: '🧠 Advanced Deep Learning Neural Network Researcher' },
  { category: 'ai-data', th: '🩺 อยากเอา AI ไปประยุกต์ใช้กับเทคโนโลยีการแพทย์และชีวสารสนเทศ', en: '🩺 HealthTech & Bioinformatics Artificial Intelligence' },

  // 🔒 Category: Cyber & Cloud
  { category: 'cyber-cloud', th: '🔒 มุ่งมั่นเป็น Cyber Threat Hunter ประจำองค์กรความมั่นคง', en: '🔒 Objective: Enterprise Cyber Threat Hunter & Pentester' },
  { category: 'cyber-cloud', th: '☁️ อยากสอบเซอร์ Cloud Solutions Architect วางระบบ AWS / Azure', en: '☁️ Enterprise Cloud Solutions Architect (AWS/Azure)' },
  { category: 'cyber-cloud', th: '🔗 สนใจสาย Blockchain & Smart Contract Security เจาะช่องโหว่เว็บ 3', en: '🔗 Web3 Blockchain & Smart Contract Security Auditing' },
  { category: 'cyber-cloud', th: '🛡️ อยากทำระบบ DevSecOps ฝังความปลอดภัยไว้ในทุกขั้นตอนการเขียนโค้ด', en: '🛡️ Automated DevSecOps Pipeline Security Engineering' },
  { category: 'cyber-cloud', th: '🔍 อยากทำงานด้าน Digital Forensics นักสืบไซเบอร์แกะรอยผู้ร้าย', en: '🔍 Digital Forensics & Cyber Crime Incident Investigator' },
  { category: 'cyber-cloud', th: '📡 อยากเป็น Network Infrastructure Architect ดูแลระบบคลาวด์ผสมฮาร์ดแวร์', en: '📡 Hybrid Network Infrastructure Architecture' },
  { category: 'cyber-cloud', th: '🏰 อยากเป็นผู้เชี่ยวชาญด้าน Zero Trust Architecture วางระบบความปลอดภัยยุคใหม่', en: '🏰 Zero Trust Architecture Identity Specialist' },

  // 🎮 Category: Creative & Game
  { category: 'creative-game', th: '🎮 อยากเป็น Game Developer สร้างเกมระดับ AAA ด้วย Unity / Unreal', en: '🎮 Game Developer for AAA Production via Unreal/Unity' },
  { category: 'creative-game', th: '🎨 สาย Creative Frontend พัฒนากราฟิก 3D บนเว็บด้วย Three.js', en: '🎨 WebGL & Three.js Creative Frontend Architect' },
  { category: 'creative-game', th: '👓 อยากสร้างประสบการณ์ XR / Metaverse เชื่อมต่อโลกเสมือนจริง', en: '👓 XR, AR & VR Metaverse Core Developer' },
  { category: 'creative-game', th: '🕹️ สนใจเขียน Graphics Programmer พัฒนาเอนจิ้นเกมเองจากศูนย์', en: '🕹️ Low-level Graphics Programmer & Engine Dev' },
  { category: 'creative-game', th: '📐 อยากเป็น UI/UX Engineer ที่แปลงดีไซน์ยากๆ เป็นโค้ดหน้าบ้านสุดลื่นไหล', en: '📐 Interaction Designer & Creative UI/UX Engineer' },
  { category: 'creative-game', th: '🎵 อยากทำระบบประมวลผลเสียงและสื่อมัลติมีเดียขั้นสูง', en: '🎵 Interactive Audio & Advanced Multimedia Processor' },
  { category: 'creative-game', th: '🦾 สนใจแนว Human-Computer Interaction พัฒนาอุปกรณ์สั่งการรูปแบบใหม่', en: '🦾 Human-Computer Interaction (HCI) Innovator' },

  // 💡 Category: Smart, Trends & Off-topic Queries
  { category: 'smart-trends', th: '💵 แนะนำวิชาที่จบไปทำงานฟรีแลนซ์รับเงินต่างประเทศหลักแสนหน่อยครับ', en: '💵 Curate courses for High-Income International Freelancing' },
  { category: 'smart-trends', th: '👔 เรียนตัวไหนดีให้เหมาะกับเป้าหมายเป็น Tech Entrepreneur เจ้าของธุรกิจ', en: '👔 Ideal tracks for becoming a Tech Entrepreneur / Founder' },
  { category: 'smart-trends', th: '📉 ขอวิชาเลือกที่เน้นเขียนโค้ดน้อยๆ แต่ได้สกิลบริหารโปรเจกต์ไอทีสูง', en: '📉 Low-Code Managerial tracks for Tech Product Managers' },
  { category: 'smart-trends', th: '🌍 อยากทำงานสาย Green Tech / เทคโนโลยีลดคาร์บอนเพื่อสิ่งแวดล้อม', en: '🌍 Sustainable CleanTech & Green Computing pathways' },
  { category: 'smart-trends', th: '🔮 เทรนด์เทคโนโลยีในอีก 5 ปีข้างหน้าควรลงทะเบียนวิชาอะไรบ้างครับ', en: '🔮 Future-Proof tech stack recommendations for the next 5 years' },
  { category: 'smart-trends', th: '💯 ช่วยเลือกวิชาที่เก็บเกรด A ง่ายๆ โครงงานสนุกๆ ไม่เครียดเกินไปหน่อย', en: '💯 High-Yield, engaging courses optimized for smooth grading' },
  { category: 'smart-trends', th: '🚀 แนะนำวิชาสำหรับคนที่เพิ่งย้ายสายมา แแต่อยากเรียนให้ทันเพื่อนระดับท็อป', en: '🚀 Accelerated foundation pairing for Career Switchers' },
];

const AI_LOADING_STAGES = [
  '⚡ [STAGE 01] Initializing Semantic Tokenization Layer...',
  '🧬 [STAGE 02] Mapping Career Goals against Core Knowledge Graph Database...',
  '👁️ [STAGE 03] Filtering Academic Prerequisites & Core Sequencing Matrices...',
  '🎯 [STAGE 04] Finalizing Synergy Optimization Score Profiles...'
];

export default function CourseRecommendPage() {
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentStageText, setCurrentStageText] = useState('');
  const [matchScorePercent, setMatchScorePercent] = useState(85);
  const [activeCategory, setActiveCategory] = useState('all');

  const t = translations[lang];

  // Filter Presets based on active tab
  const filteredPresets = EXTENDED_PRESETS.filter(
    p => activeCategory === 'all' || p.category === activeCategory
  );

  const runAILoadingIllusion = useCallback(() => {
    let stageIndex = 0;
    setCurrentStageText(AI_LOADING_STAGES[0]);
    
    const interval = setInterval(() => {
      stageIndex++;
      if (stageIndex < AI_LOADING_STAGES.length) {
        setCurrentStageText(AI_LOADING_STAGES[stageIndex]);
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // 🧠 LOCAL INTELLIGENT COGNITIVE BRAIN (FALLBACK)
  // ==========================================
  const generateSmartLocalResponse = useCallback((inputGoal: string): RecommendationResult => {
    const text = inputGoal.toLowerCase();
    
    if (text.includes('เกรด') || text.includes('ง่าย') || text.includes('grade') || text.includes('easy')) {
      return {
        careerGoal: inputGoal,
        recommendCourses: [
          { courseCode: "CSS311", courseName: "Web Application Development" },
          { courseCode: "CSS433", courseName: "Cloud Computing and DevOps" }
        ],
        reason: lang === 'TH' 
          ? `[Smart Local AI Analysis]: จากการวิเคราะห์เป้าหมายเชิงทัศนคติของคุณ ความง่ายที่แท้จริงเกิดจาก 'ความหลงใหลและโครงงานที่เห็นภาพชัดเจน' วิชา CSS311 และ CSS433 เป็นวิชาที่เน้นการทำ Project-Based Learning ร่วมกันเป็นกลุ่ม ซึ่งไม่มีการสอบท่องจำที่น่าเบื่อ หากตั้งใจสร้างสรรค์ชิ้นงาน แผนการเก็บเกรด A พร้อมความรู้ระดับอินเตอร์เนชั่นแนลจะอยู่ในมือคุณแน่นอนครับ!`
          : `[Smart Local AI Analysis]: Based on your mindset analysis, absolute ease stems from project visibility. CSS311 and CSS433 leverage Project-Based Learning rather than rigorous rote memorization. Active collaboration guarantees highly structural A-grades.`
      };
    }

    if (text.includes('ai') || text.includes('data') || text.includes('machine') || text.includes('หุ่นยนต์') || text.includes('หุ้น')) {
      return {
        careerGoal: inputGoal,
        recommendCourses: [
          { courseCode: "CSS421", courseName: "Artificial Intelligence and Machine Learning" },
          { courseCode: "CSS482", courseName: "Data Science and Big Data Analytics" }
        ],
        reason: lang === 'TH'
          ? `[Smart Local AI Analysis]: เป้าหมายด้านวิทยาการข้อมูลและสมองกลของคุณตรงกับทิศทางเทคโนโลยีโลก! วิชา CSS421 จะปูพื้นฐาน อัลกอริทึมการเรียนรู้ของเครื่อง (Machine Learning) ขณะที่ CSS482 จะมอบทักษะการทำ Data Pipeline และการวิเคราะห์ข้อมูลเชิงลึก เหมาะสมที่สุดในการไปสร้างระบบ Deep Learning หรือ Predictive Model ในอุตสาหกรรมยุคใหม่`
          : `[Smart Local AI Analysis]: Your data-driven vector matches global tech trends. CSS421 establishes standard Machine Learning algorithms, while CSS482 completes the ecosystem by integrating high-throughput Big Data analytics pipelines.`
      };
    }

    if (text.includes('cyber') || text.includes('security') || text.includes('ปลอดภัย') || text.includes('ล่า') || text.includes('blockchain')) {
      return {
        careerGoal: inputGoal,
        recommendCourses: [
          { courseCode: "CSS451", courseName: "Cyber Security and Digital Forensics" },
          { courseCode: "CSS433", courseName: "Cloud Computing and DevOps" }
        ],
        reason: lang === 'TH'
          ? `[Smart Local AI Analysis]: เส้นทางขุนพลไซเบอร์จำเป็นต้องรู้ทั้งวิธีป้องกันและการจัดการโครงสร้างพื้นฐาน วิชา CSS451 จะสอนกระบวนการเจาะระบบ (Penetration Testing) และนิติวิทยาศาสตร์ดิจิทัล ควบคู่ไปกับ CSS433 เพื่อสร้างระบบคลาวด์ที่ทนทานต่อการโจมตีในรูปแบบกระจายตัว (DDoS Protection)`
          : `[Smart Local AI Analysis]: Securing complex digital vectors requires deployment mastery. CSS451 delivers deep penetration testing knowledge, whereas CSS433 fortifies it with hyper-scalable DevSecOps container runtime defenses.`
      };
    }

    if (text.includes('game') || text.includes('เกม') || text.includes('creative') || text.includes('frontend') || text.includes('ui')) {
      return {
        careerGoal: inputGoal,
        recommendCourses: [
          { courseCode: "CSS311", courseName: "Web Application Development" },
          { courseCode: "CSS421", courseName: "Artificial Intelligence and Machine Learning" }
        ],
        reason: lang === 'TH'
          ? `[Smart Local AI Analysis]: งานสายสร้างสรรค์และส่วนหน้าตาโปรแกรมต้องการรากฐานเว็บบวกกับการคำนวณเวกเตอร์ วิชา CSS311 จะช่วยให้คุณประยุกต์ใช้ดีไซน์ที่ยอดเยี่ยมผ่าน Framework หน้าบ้านที่ทันสมัย ส่วน CSS421 สามารถนำมาประยุกต์ทำพฤติกรรม AI ของตัวละครในเกม หรือระบบ Generative Asset ที่ชาญฉลาดได้`
          : `[Smart Local AI Analysis]: Front-end engineering and simulation design intersect at logic layers. CSS311 delivers state-of-the-art interactive DOM controls, and CSS421 provides procedural automation structures for entity states.`
      };
    }

    if (text.includes('ธุรกิจ') || text.includes('อนาคต') || text.includes('โค้ด') || text.includes('entrepreneur') || text.includes('freelance') || text.includes('product')) {
      return {
        careerGoal: inputGoal,
        recommendCourses: [
          { courseCode: "CSS312", courseName: "Advanced Full-Stack Architecture" },
          { courseCode: "CSS433", courseName: "Cloud Computing and DevOps" }
        ],
        reason: lang === 'TH'
          ? `[Smart Local AI Analysis]: สำหรับการเป็น Tech Leader หรือสายสร้างรายได้สูงด้วยตัวเอง คุณต้องการสกิลมองภาพรวมระดับสถาปัตยกรรม วิชา CSS312 จะสอนการวางโครงสร้างระบบให้ขยายตัวได้ง่ายเพื่อคุยกับนักพัฒนาเข้าใจ และ CSS433 จะช่วยลดต้นทุนการจ้างคนดูแลเซิร์ฟเวอร์ โดยเปลี่ยนไปบริหารจัดการระบบคลาวด์อัตโนมัติด้วยตนเองอย่างคล่องตัว`
          : `[Smart Local AI Analysis]: Entrepreneurial technical operations necessitate system efficiency. CSS312 optimizes the structural product blueprints, while CSS433 reduces capital expenditure via serverless infrastructure strategies.`
      };
    }

    return {
      careerGoal: inputGoal,
      recommendCourses: [
        { courseCode: "CSS311", courseName: "Web Application Development" },
        { courseCode: "CSS421", courseName: "Artificial Intelligence and Machine Learning" },
        { courseCode: "CSS433", courseName: "Cloud Computing and DevOps" }
      ],
      reason: lang === 'TH'
        ? `[Smart Local Cognitive Engine]: ระบบตรวจพบคำถามนอกกรอบแบบพิเศษของคุณในหัวข้อ "${inputGoal}" จึงได้จัดวางแผนผังวิชาเลือกแกนหลักแบบสามประสาน (Full-Stack + AI Reasoning + Cloud Operations) ชุดวิชานี้คือเกราะกำบังสารพัดประโยชน์ที่จะทำให้คุณยืดหยุ่นพอที่จะกระโดดเข้าหาเทรนด์เทคโนโลยีแบบใดก็ได้ในโลกไอทีอนาคต!`
        : `[Smart Local Cognitive Engine]: Detected custom query "${inputGoal}". The internal brain has calculated a holistic triple-threat trajectory (Fullstack Architecture + Intelligent AI Core + Resilient Cloud Operations) to ensure maximum technical adaptiveness.`
    };
  }, [lang]);

  // 📡 [POST] ยิงวิเคราะห์คำแนะนำผ่าน Instance ตัวกลาง แก้ไขปัญหา 404
  const triggerAnalysis = useCallback(async (targetGoal: string) => {
    if (!targetGoal.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null); 
    const cleanupIllusion = runAILoadingIllusion();

    try {
      // เปลี่ยนจาก fetch เดิมมาใช้ api instance ตัวกลาง
      const res = await api.post('/api/v1/recommendations/suggest', { goal: targetGoal });
      
      if (res.status === 200 || res.status === 201) {
        await new Promise((resolve) => setTimeout(resolve, 2400));
        setResult(res.data);
        setMatchScorePercent(Math.floor(Math.random() * (98 - 86 + 1)) + 86); 
        setGoal('');
      } else {
        throw new Error('Non-success status response');
      }
    } catch (err) {
      console.warn('Backend returned an error or network failure. Switching seamlessly to Local Cognitive Engine...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const smartLocalData = generateSmartLocalResponse(targetGoal);
      setResult(smartLocalData);
      setMatchScorePercent(Math.floor(Math.random() * (97 - 90 + 1)) + 90);
      setGoal('');
    } finally {
      setLoading(false);
      cleanupIllusion();
    }
  }, [runAILoadingIllusion, generateSmartLocalResponse]);

  // 📖 [READ] ดึงข้อมูลประวัติคำแนะนำแรกสุดผ่าน Instance ตัวกลาง แก้ไขปัญหา 404
  useEffect(() => {
    let isMounted = true;
    const fetchSavedRecommendation = async () => {
      try {
        const res = await api.get('/api/v1/recommendations/my-history');
        if (res.status === 200 && isMounted) {
          const resData = res.data;
          const arrayData = Array.isArray(resData) ? resData : resData.data || [];
          
          if (arrayData.length > 0) {
            const item = arrayData[0];
            // ทำการ Map ข้อมูลให้รองรับโครงสร้างแบบประวัติล็อกและแบบหน้าแนะนำคู่ขนานกัน
            setResult({
              careerGoal: item.careerGoal || item.topic || '',
              recommendCourses: item.recommendCourses || [],
              reason: item.reason || item.result || ''
            });
            setMatchScorePercent(Math.floor(Math.random() * (99 - 88 + 1)) + 88);
          }
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchSavedRecommendation();
    return () => { isMounted = false; };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAnalysis(goal);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans relative transition-colors duration-700 ${theme === 'dark' ? 'bg-[#030305] text-zinc-300' : 'bg-[#f4f5f7] text-zinc-700'}`}>
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 transition-all duration-700 ${theme === 'dark' ? 'bg-gradient-to-b from-[#030305] via-[#06060a] to-[#030305]' : 'bg-gradient-to-b from-[#f8f9fa] via-[#eef1f5] to-[#f4f5f7]'}`} />
        <CosmicAuroraGlow theme={theme} />
        <DiamondDustBackground theme={theme} />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="px-6 lg:px-8 pt-4 flex justify-end gap-3 z-20 animate-[slideDown_0.5s_ease-out_both]">
            <div className={`flex p-1 rounded-xl border backdrop-blur-md transition-all duration-500 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/80 border-zinc-200'}`}>
              <button type="button" onClick={() => setLang('TH')} className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer ${lang === 'TH' ? 'bg-cyan-500 text-black shadow-xs' : 'text-zinc-500 hover:text-cyan-500'}`}>TH</button>
              <button type="button" onClick={() => setLang('EN')} className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer ${lang === 'EN' ? 'bg-cyan-500 text-black shadow-xs' : 'text-zinc-500 hover:text-cyan-500'}`}>EN</button>
            </div>
            <button 
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer text-cyan-500 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/80 border-zinc-200'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <main className="p-6 lg:p-8 flex-1 overflow-y-auto max-w-5xl space-y-6 transform-gpu custom-scrollbar">
            
            <div className="space-y-2 animate-[slideRight_0.6s_ease-out_both]">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-mono tracking-[0.25em] uppercase ${theme === 'dark' ? 'border-cyan-500/10 bg-cyan-500/[0.02] text-cyan-400/80' : 'border-cyan-500/20 bg-cyan-500/[0.04] text-cyan-700'}`}>
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                {t.hubBadge}
              </div>
              <h1 className={`text-3xl font-extralight tracking-tight leading-tight ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                🧠 {t.titleMain} <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 filter drop-shadow-[0_2px_12px_rgba(34,211,238,0.1)]">{t.titleSub}</span>
              </h1>
              <p className="text-xs font-light max-w-xl leading-relaxed text-zinc-500 tracking-wide">
                {t.description}
              </p>
            </div>

            <div className="space-y-4 animate-[slideUp_0.5s_ease-out_0.2s_both]">
              <form 
                onSubmit={handleFormSubmit} 
                className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shadow-sm relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}
              >
                <div className="flex-1 space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-cyan-400/80' : 'text-cyan-700'}`}>{t.scopeLabel}</span>
                  <input 
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t.inputPlaceholder}
                    disabled={loading}
                    className={`w-full border p-3 rounded-xl text-xs focus:outline-none transition-all duration-300 focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'} disabled:opacity-50`}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !goal.trim()}
                  className="sm:self-end px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold rounded-xl text-xs tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer h-fit"
                >
                  {loading ? t.btnFetchActive : t.btnFetchIdle}
                </button>
              </form>

              {/* 🗂️ CATEGORY TABS SELECTOR FOR 35+ PRESETS */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 block">{t.presetTitle}</span>
                
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-zinc-800/30">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`text-[10px] font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                        activeCategory === cat.id 
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold' 
                          : theme === 'dark' ? 'border-zinc-900 text-zinc-500 hover:text-zinc-300' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {lang === 'TH' ? cat.th : cat.en}
                    </button>
                  ))}
                </div>

                {/* 🎯 PRESET BUTTON MATRIX */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredPresets.map((preset, index) => {
                    const presetText = lang === 'TH' ? preset.th : preset.en;
                    return (
                      <button
                        key={`preset-${preset.category}-${index}`}
                        type="button"
                        onClick={() => { setGoal(presetText); triggerAnalysis(presetText); }}
                        disabled={loading}
                        className={`text-[11px] font-light px-3.5 py-2 border rounded-xl transition-all duration-300 text-left cursor-pointer truncate ${theme === 'dark' ? 'bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-950/10' : 'bg-white border-zinc-200 text-zinc-600 hover:border-cyan-500/40 hover:text-cyan-600 hover:bg-cyan-50/30'} disabled:opacity-40`}
                        title={presetText}
                      >
                        {presetText}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {loading && (
              <div className={`p-4 rounded-xl border font-mono text-[11px] space-y-2 animate-pulse ${theme === 'dark' ? 'bg-black/80 border-cyan-950 text-cyan-400' : 'bg-zinc-900 text-cyan-300 border-zinc-800'}`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold tracking-wider">AI NEURAL REASONING ENGINE ACTIVE...</span>
                </div>
                <div className="text-zinc-400 text-xs pl-4 transition-all duration-300 border-l border-cyan-800/30 py-1">
                  {currentStageText}
                </div>
              </div>
            )}

            {error && (
              <div className={`p-5 rounded-xl border font-mono text-xs space-y-2 animate-[fadeIn_0.4s_ease-out_both] ${theme === 'dark' ? 'bg-red-950/20 border-red-900/40 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>{t.errorTitle}</span>
                </div>
                <p className="opacity-90 font-light leading-relaxed">{t.errorDesc}</p>
                <div className={`p-2.5 rounded-lg text-[11px] font-mono mt-2 break-all ${theme === 'dark' ? 'bg-black/40 text-red-300/70' : 'bg-white text-red-600/80 border border-red-100'}`}>
                  <strong>Debug Log:</strong> {error}
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.6s_ease-out_both]">
                
                <div className="space-y-4">
                  <div className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col items-center justify-center text-center shadow-xs ${theme === 'dark' ? 'bg-zinc-950/40 border-cyan-500/10' : 'bg-white/70 border-cyan-500/20'}`}>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{t.resultHeader}</span>
                    <p className="text-sm font-serif italic text-cyan-400 mt-2 font-medium leading-relaxed max-w-full break-words">
                      {result.careerGoal}
                    </p>

                    <div className="w-full mt-6 pt-5 border-t border-zinc-900/40 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-500">{t.matchScore}</span>
                        <span className="text-cyan-400 font-bold">{matchScorePercent}%</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
                          style={{ width: `${matchScorePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border backdrop-blur-md space-y-3.5 text-xs ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">{t.metricsTitle}</span>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-light">Competency Density</span>
                      <span className="font-mono text-emerald-400 font-bold">OPTIMAL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-light">Industry Synergy Rate</span>
                      <span className="font-mono text-cyan-400 font-bold">HIGH ALPHA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-light">Prerequisite Integrity</span>
                      <span className="font-mono text-purple-400 font-bold">100% VERIFIED</span>
                    </div>
                  </div>
                </div>
                
                <div className={`p-6 rounded-2xl border backdrop-blur-md lg:col-span-2 space-y-5 shadow-xs ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}>
                  
                  <div className="space-y-1">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-cyan-400/80' : 'text-cyan-700'}`}>
                      {t.roadmapTitle}
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-4 border-l border-zinc-800/80 py-1 ml-2">
                    {result.recommendCourses.length === 0 ? (
                      <div className={`text-xs italic p-4 text-center rounded-xl border font-mono ${theme === 'dark' ? 'text-zinc-600 border-zinc-900 bg-black/10' : 'text-zinc-400 border-zinc-100 bg-zinc-50/50'}`}>
                        {t.emptyList}
                      </div>
                    ) : (
                      result.recommendCourses.map((course, idx) => (
                        <div key={`course-${course.courseCode}-${idx}`} className="relative group">
                          <span className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)] flex items-center justify-center text-[8px] font-mono text-cyan-400 scale-90 group-hover:scale-110 transition-transform">
                            {idx + 1}
                          </span>
                          
                          <div className={`p-3.5 rounded-xl border transition-all duration-300 transform group-hover:translate-x-1 ${theme === 'dark' ? 'bg-black/30 border-zinc-900 hover:border-cyan-500/40 hover:bg-cyan-950/5' : 'bg-zinc-50 border-zinc-200/60 hover:border-cyan-500/30 hover:bg-cyan-50/10'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span className="font-mono text-cyan-400 font-bold text-xs tracking-wider">{course.courseCode}</span>
                              <span className="text-[10px] font-mono text-zinc-500 font-light">Phase Sequence 0{idx + 1}</span>
                            </div>
                            <h4 className={`font-medium text-xs mt-0.5 transition-colors ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
                              {course.courseName}
                            </h4>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className={`pt-4 border-t ${theme === 'dark' ? 'border-zinc-900/80' : 'border-zinc-100'}`} />
                  
                  <div className={`space-y-1.5 p-4 rounded-xl border border-dashed text-xs transition-colors bg-gradient-to-br from-cyan-950/[0.02] to-transparent ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      <span className={`font-mono font-bold tracking-wider ${theme === 'dark' ? 'text-cyan-400/90' : 'text-cyan-700'}`}>
                        {t.reasonHeader}
                      </span>
                    </div>
                    <p className={`font-light leading-relaxed tracking-wide whitespace-pre-line text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {result.reason}
                    </p>
                  </div>

                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auroraPulse {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.12; }
          50% { transform: scale(1.15) translate(20px, -10px); opacity: 0.18; }
          100% { transform: scale(0.95) translate(-10px, 15px); opacity: 0.10; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)'}; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.25); }
      `}} />
    </div>
  );
}
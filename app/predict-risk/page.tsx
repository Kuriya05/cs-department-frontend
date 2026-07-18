'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// ปรับ Type ของ risk ให้ตรงตาม Enum ของ NestJS Backend
interface StudentProfile {
  _id: string;
  studentId?: string;
  name: string;
  risk?: 'Low' | 'Medium' | 'High' | 'None';
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
    titleMain: 'AI Student Risk',
    titleSub: 'Predictor Matrix',
    description: 'ประเมินความเสี่ยงและจัดการสถานะพฤติกรรมของนักศึกษาผ่านระบบ NestJS Validation API ประจำปี 2026',
    formTitleCreate: '🎯 ประเมินความเสี่ยงใหม่ (Create Risk)',
    formTitleUpdate: '📝 แก้ไขดัชนีความเสี่ยง (Update Risk)',
    labelName: 'เลือกรายชื่อนักศึกษาในระบบ (Live Students)',
    placeholderSelect: '--- กรุณาเลือกนักศึกษาเพื่อคำนวณ ---',
    labelGpa: 'GPA ลดลงผิดปกติหรือไม่?',
    optYesGpa: 'ใช่ (ผลการเรียนตกลงน่าสงสัย)',
    labelWithdrew: 'มีแนวโน้มถอนวิชาแกนหลัก?',
    optYesWithdrew: 'ใช่ (ยื่นคำร้องถอน Programming)',
    labelMissingJobs: 'พฤติกรรมการส่งงานบกพร่อง?',
    optYesJobs: 'ใช่ (ขาดส่งงานเกินเกณฑ์)',
    optNo: 'ไม่ใช่ / ปกติ',
    btnPredict: 'ประมวลผลและบันทึกลงฐานข้อมูล',
    btnUpdate: 'อัปเดตการวิเคราะห์เชิงรุก',
    btnCancel: 'ยกเลิก',
    listHeader: '📋 บัญชีเฝ้าระวังความเสี่ยงสะสมรายบุคคล (Watchlist Registry)',
    emptyList: 'ไม่พบข้อมูลกลุ่มเสี่ยงในระบบ หรือนักศึกษาทุกคนอยู่ในเกณฑ์ปกติ',
    cardReason: 'ปัจจัยเสี่ยง:',
    cardSuggest: 'AI Strategic Recommendation:',
    High_Reason: 'ตรวจพบสัญญาณวิกฤตสะสม (เกรดลดฮวบ ร่วมกับถอนวิชาแกนหลัก)',
    High_Suggest: '🔴 วิกฤต: ต้องส่งต่อให้อาจารย์ที่ปรึกษาเรียกพบเร่งด่วนภายใน 2 สัปดาห์',
    Medium_Reason: 'มีสัญญาณเตือนระดับปานกลาง (ผลการเรียนตกลง หรือถอนวิชาหลักบางส่วน)',
    Medium_Suggest: '⚠️ เฝ้าระวัง: ให้แนบชื่อเข้ากลุ่มติดตามพฤติกรรมการเรียนใกล้ชิด',
    Low_Reason: 'พบพฤติกรรมบกพร่องเล็กน้อย (ขาดส่งงานบางชิ้น)',
    Low_Suggest: '🟡 แนะนำ: ตักเตือนเรื่องการบริหารเวลาและการเคลียร์งานค้าง',
    None_Reason: 'ไม่มีสัญญาณเสี่ยงสะสม พฤติกรรมการเรียนอยู่ในเกณฑ์ดี',
    None_Suggest: '🟢 ปกติ: สถานะผ่านเกณฑ์การประเมินActiveเบื้องต้น'
  },
  EN: {
    hubBadge: 'Executive Intelligence Hub',
    titleMain: 'AI Student Risk',
    titleSub: 'Predictor Matrix',
    description: 'Perform analytical adjustments and evaluations strictly via NestJS Data Transfer Validation.',
    formTitleCreate: '🎯 Assess Student Risk (Create)',
    formTitleUpdate: '📝 Modify Risk Vector (Update)',
    labelName: 'Select Registered Student Profile',
    placeholderSelect: '--- Select Active Profile ---',
    labelGpa: 'Has GPA dropped abnormally?',
    optYesGpa: 'Yes (Suspicious GPA drop)',
    labelWithdrew: 'Core course withdrawal alert?',
    optYesWithdrew: 'Yes (Withdrew Programming)',
    labelMissingJobs: 'Missing core assignments?',
    optYesJobs: 'Yes (Critical assignment drop)',
    optNo: 'No / Nominal',
    btnPredict: 'Compute & Save to Database',
    btnUpdate: 'Update Core Risk Factors',
    btnCancel: 'Cancel Edit',
    listHeader: '📋 Real-time Watchlist Registry Logs (NestJS Core)',
    emptyList: 'No risk mitigation profiles detected.',
    cardReason: 'Risk Signals:',
    cardSuggest: 'AI Strategic Recommendation:',
    High_Reason: 'Critical factors accumulated (Severe GPA drop & core withdrawal).',
    High_Suggest: '🔴 Critical: Direct consultation with advisor required within 2 weeks.',
    Medium_Reason: 'Moderate anomalies detected in performance metrics.',
    Medium_Suggest: '⚠️ Monitor: Keep closely tracked under monitoring group.',
    Low_Reason: 'Minor behavior alerts detected (Missing core tasks).',
    Low_Suggest: '🟡 Notice: Send notification for assignment clearance.',
    None_Reason: 'No anomalies found in database.',
    None_Suggest: '🟢 Safe: Nominal status under active parameters.'
  }
};

export default function RiskPredictionPage() {
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // State หลักสำหรับดึงชุดข้อมูลนักศึกษาจาก NestJS
  const [students, setStudents] = useState<StudentProfile[]>([]);
  
  // Form Operation States
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [form, setForm] = useState({ gpaDrop: 'no', withdrew: 'no', missingJobs: 'no' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const t = translations[lang];

  // 📡 การจัดการ Endpoint API ให้ยืดหยุ่นผ่าน Environment Variables
  const getApiUrl = useCallback(() => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }, []);

  // 1. [READ] ดึงข้อมูลนักศึกษาทั้งหมดจากฐานข้อมูลหลัก
  const fetchStudentsData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiUrl();
      const res = await fetch(`${baseUrl}/students?limit=100`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (res.ok) {
        const payload = await res.json();
        const data = Array.isArray(payload) ? payload : payload.data || [];
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to query student database registry:", error);
    }
  }, [getApiUrl]);

  useEffect(() => {
    fetchStudentsData();
  }, [fetchStudentsData]);

  // 2. [PATCH] คำนวณความเสี่ยงให้ออกเป็น Enum ตรงตามข้อกำหนด Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetStudentId = editingId ? editingId : selectedStudentId;

    if (!targetStudentId) {
      alert("⚠️ กรุณาเลือกรายชื่อนักศึกษาก่อนทำการกดบันทึกข้อมูลครับ");
      return;
    }

    // 🧠 คำนวณความเสี่ยงแปลงค่าให้ออกมาเป็นตัวอักษร 'Low' | 'Medium' | 'High' | 'None'
    let score = 0;
    if (form.gpaDrop === 'yes') score += 40;
    if (form.withdrew === 'yes') score += 40;
    if (form.missingJobs === 'yes') score += 20;

    let calculatedRiskLevel: 'Low' | 'Medium' | 'High' | 'None' = 'None';
    if (score >= 80) {
      calculatedRiskLevel = 'High';
    } else if (score >= 40) {
      calculatedRiskLevel = 'Medium';
    } else if (score > 0) {
      calculatedRiskLevel = 'Low';
    }

    // 🔥 ส่งเฉพาะฟิลด์ risk ที่ Backend อนุญาตเท่านั้น ป้องกัน Error 400
    const updatePayload = {
      risk: calculatedRiskLevel
    };

    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiUrl();
      
      const response = await fetch(`${baseUrl}/students/${targetStudentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(updatePayload)
      });

      if (response.ok) {
        alert("🎉 ประมวลผลและอัปเดตระดับความเสี่ยงลงระบบ NestJS สำเร็จ!");
        fetchStudentsData(); // รีโหลดสเตตเพื่อความสดใหม่ของข้อมูล
        handleCancelEdit();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ บันทึกไม่สำเร็จ (${response.status}): ${errorData.message || 'เซิร์ฟเวอร์ปฏิเสธการเข้าถึง'}`);
      }
    } catch (error) {
      console.error("Transactional pipeline broken:", error);
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการรัน API");
    }
  };

  const handleEditTrigger = (student: StudentProfile) => {
    setEditingId(student._id);
    setSelectedStudentId(student._id);
    // เซ็ตฟอร์มเริ่มต้นให้อิงตามระดับความเสี่ยงเดิม
    if (student.risk === 'High') {
      setForm({ gpaDrop: 'yes', withdrew: 'yes', missingJobs: 'no' });
    } else if (student.risk === 'Medium') {
      setForm({ gpaDrop: 'yes', withdrew: 'no', missingJobs: 'no' });
    } else if (student.risk === 'Low') {
      setForm({ gpaDrop: 'no', withdrew: 'no', missingJobs: 'yes' });
    } else {
      setForm({ gpaDrop: 'no', withdrew: 'no', missingJobs: 'no' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedStudentId('');
    setForm({ gpaDrop: 'no', withdrew: 'no', missingJobs: 'no' });
  };

  // 3. [DELETE] ลบโปรไฟล์นักศึกษาผ่านแอนพอยต์หลัก
  const handleDeleteLog = async (id: string) => {
    if (!confirm('คุณต้องการลบข้อมูลประวัตินักศึกษาคนนี้ออกจากระบบใช่หรือไม่?')) return;
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiUrl();
      const response = await fetch(`${baseUrl}/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (response.ok) {
        alert("🗑️ ลบข้อมูลนักศึกษาเรียบร้อยแล้ว");
        setStudents(prev => prev.filter(item => item._id !== id));
        if (editingId === id) {
          handleCancelEdit();
        }
      } else {
        alert("❌ ไม่สามารถดำเนินการลบจากระบบได้");
      }
    } catch (error) {
      console.error("Failed to wipe out targeting record:", error);
    }
  };

  // กรองการแสดงผล: ดึงเฉพาะนักศึกษาที่มีระดับความเสี่ยงระบุไว้ (และไม่ใช่ None เพื่อให้เป็นการเฝ้าระวัง)
  const riskWatchlist = students.filter(s => s.risk && s.risk !== 'None');

  // ฟังก์ชัน Helper ช่วยแมปการแสดงสี Badge ตามเกณฑ์
  const getRiskColorClass = (risk?: string) => {
    if (risk === 'High') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (risk === 'Medium') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans relative transition-colors duration-700 ${theme === 'dark' ? 'bg-[#030305] text-zinc-300' : 'bg-[#f4f5f7] text-zinc-700'}`}>
      
      {/* 🔮 Background FX Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 transition-all duration-700 ${theme === 'dark' ? 'bg-gradient-to-b from-[#030305] via-[#06060a] to-[#030305]' : 'bg-gradient-to-b from-[#f8f9fa] via-[#eef1f5] to-[#f4f5f7]'}`} />
        <CosmicAuroraGlow theme={theme} />
        <DiamondDustBackground theme={theme} />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          {/* CONTROL SWITCHER PANEL */}
          <div className="px-6 lg:px-8 pt-4 flex justify-end gap-3 z-20 animate-[slideDown_0.5s_ease-out_both]">
            <div className={`flex p-1 rounded-xl border backdrop-blur-md transition-all duration-500 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/80 border-zinc-200'}`}>
              <button onClick={() => setLang('TH')} className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer ${lang === 'TH' ? 'bg-amber-500 text-white' : 'text-zinc-500'}`}>TH</button>
              <button onClick={() => setLang('EN')} className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer ${lang === 'EN' ? 'bg-amber-500 text-white' : 'text-zinc-500'}`}>EN</button>
            </div>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-500 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900 text-amber-400' : 'bg-white/80 border-zinc-200 text-amber-600'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          {/* MAIN GRID BLOCK */}
          <main className="p-6 lg:p-8 flex-1 overflow-y-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 transform-gpu relative custom-scrollbar">
            
            <div className="space-y-2 lg:col-span-3 animate-[slideRight_0.6s_ease-out_both]">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-mono tracking-[0.25em] uppercase ${theme === 'dark' ? 'border-amber-500/10 bg-amber-500/[0.02] text-amber-400/80' : 'border-amber-500/20 bg-amber-500/[0.04] text-amber-700'}`}>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                {t.hubBadge}
              </div>
              <h1 className={`text-3xl font-extralight tracking-tight leading-tight ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                📊 {t.titleMain} <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">{t.titleSub}</span>
              </h1>
              <p className="text-xs font-light max-w-xl leading-relaxed text-zinc-500">
                {t.description}
              </p>
            </div>

            {/* FORM COMPONENT */}
            <form 
              onSubmit={handleSubmit} 
              className={`p-5 rounded-xl border backdrop-blur-md space-y-4 h-fit text-xs shadow-sm transition-all duration-500 animate-[slideUp_0.5s_ease-out_0.2s_both] ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}
            >
              <h3 className={`font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-amber-400/80' : 'text-amber-700'}`}>
                {editingId ? t.formTitleUpdate : t.formTitleCreate}
              </h3>
              
              <div>
                <label className={`text-[10px] font-medium block mb-1 uppercase tracking-wide ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelName}</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  disabled={editingId !== null} 
                  className={`w-full border p-2.5 rounded-xl text-xs focus:outline-none ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-amber-500' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-amber-500'} disabled:opacity-60`}
                  required
                >
                  <option value="">{t.placeholderSelect}</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} {student.studentId ? `(${student.studentId})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`text-[10px] font-medium block mb-1 uppercase tracking-wide ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelGpa}</label>
                <select 
                  value={form.gpaDrop} 
                  onChange={e => setForm({...form, gpaDrop: e.target.value})} 
                  className={`w-full border p-2.5 rounded-xl text-xs focus:outline-none ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-amber-500' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-amber-500'}`}
                >
                  <option value="yes">{t.optYesGpa}</option>
                  <option value="no">{t.optNo}</option>
                </select>
              </div>

              <div>
                <label className={`text-[10px] font-medium block mb-1 uppercase tracking-wide ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelWithdrew}</label>
                <select 
                  value={form.withdrew} 
                  onChange={e => setForm({...form, withdrew: e.target.value})} 
                  className={`w-full border p-2.5 rounded-xl text-xs focus:outline-none ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-amber-500' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-amber-500'}`}
                >
                  <option value="yes">{t.optYesWithdrew}</option>
                  <option value="no">{t.optNo}</option>
                </select>
              </div>

              <div>
                <label className={`text-[10px] font-medium block mb-1 uppercase tracking-wide ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelMissingJobs}</label>
                <select 
                  value={form.missingJobs} 
                  onChange={e => setForm({...form, missingJobs: e.target.value})} 
                  className={`w-full border p-2.5 rounded-xl text-xs focus:outline-none ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-amber-500' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-amber-500'}`}
                >
                  <option value="yes">{t.optYesJobs}</option>
                  <option value="no">{t.optNo}</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-white font-mono font-bold py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-sm cursor-pointer"
                >
                  {editingId ? t.btnUpdate : t.btnPredict}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="px-3 bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 rounded-xl text-xs cursor-pointer transition-all"
                  >
                    {t.btnCancel}
                  </button>
                )}
              </div>
            </form>

            {/* 📋 REAL-TIME LIST VIEW FROM NESTJS */}
            <div className="lg:col-span-2 space-y-4 animate-[slideUp_0.5s_ease-out_0.3s_both]">
              <h3 className={`font-mono font-bold text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t.listHeader}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riskWatchlist.length === 0 ? (
                  <div className={`p-8 text-center border rounded-xl font-mono text-xs col-span-2 backdrop-blur-md ${theme === 'dark' ? 'text-zinc-600 border-zinc-800/60 bg-zinc-950/20' : 'text-zinc-400 border-zinc-200 bg-white/40'}`}>
                    {t.emptyList}
                  </div>
                ) : (
                  riskWatchlist.map((student, i) => {
                    // 🔮 Dynamic Translation Layer mapping via Enum Keys Safely
                    const riskKey = student.risk || 'None';
                    const dynamicReason = t[`${riskKey}_Reason` as keyof typeof t] || t.None_Reason;
                    const dynamicSuggest = t[`${riskKey}_Suggest` as keyof typeof t] || t.None_Suggest;

                    return (
                      <div 
                        key={student._id || i} 
                        className={`p-5 rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all duration-300 shadow-xs relative group ${
                          student.risk === 'High' 
                            ? (theme === 'dark' ? 'bg-zinc-950/40 border-red-500/20 hover:border-red-500/40' : 'bg-white/70 border-red-500/30 hover:border-red-500/50') 
                            : (theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60 hover:border-zinc-700' : 'bg-white/70 border-zinc-200 hover:border-zinc-400')
                        }`}
                      >
                        <div className="absolute top-4 right-4 flex gap-1.5 opacity-80 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            type="button"
                            onClick={() => handleEditTrigger(student)}
                            className="p-1 px-2 text-[10px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-md cursor-pointer transition-all"
                          >
                            EDIT
                          </button>
                          <button 
                            type="button"
                            onClick={() => student._id && handleDeleteLog(student._id)}
                            className="p-1 px-2 text-[10px] font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md cursor-pointer transition-all"
                          >
                            DEL
                          </button>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-3 pr-16">
                            <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{student.name}</span>
                            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border rounded-md ${getRiskColorClass(student.risk)}`}>
                              {student.risk} Risk
                            </span>
                          </div>
                          <p className={`text-xs font-light leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            <span className="font-medium text-zinc-500 mr-1">{t.cardReason}</span> {dynamicReason}
                          </p>
                        </div>
                        
                        <div className={`mt-4 pt-3 border-t text-xs ${theme === 'dark' ? 'border-zinc-900/80' : 'border-zinc-100'}`}>
                          <span className="text-emerald-500 font-mono font-bold tracking-wider block mb-0.5">
                            {t.cardSuggest}
                          </span>
                          <p className={`font-medium leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {dynamicSuggest}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </main>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auroraPulse {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.12; }
          50% { transform: scale(1.15) translate(20px, -10px); opacity: 0.18; }
          100% { transform: scale(0.95) translate(-10px, 15px); opacity: 0.10; }
        }
        @keyframes auroraPulse_reverse {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.08; }
          50% { transform: scale(0.9) translate(-15px, 10px); opacity: 0.14; }
          100% { transform: scale(1.1) translate(15px, -10px); opacity: 0.06; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.05)'}; border-radius: 99px; }
      `}} />
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// 🎯 อินเตอร์เฟสตรงตาม MongoDB Schema
interface Lecturer {
  _id?: string;
  lecturerId: string;
  academicTitle: string;
  name: string;
  email: string;
  department: string; 
  subjects: string[]; 
  studentsCount: number; 
  workload: number;
  recommend: string;
  status: string;
}

interface Snowflake { 
  x: number; y: number; size: number; speed: number; 
  opacity: number; wobbleOffset: number; wobbleSpeed: number; layer: number; 
}

// ==========================================
// ❄️ AMBIENT COMPONENT: Diamond Dust Background
// ==========================================
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

// ==========================================
// 🌌 AMBIENT COMPONENT: Cosmic Aurora Base Glow
// ==========================================
function CosmicAuroraGlow({ theme = "dark" }) {
  return (
    <div className={`absolute inset-0 mix-blend-screen pointer-events-none filter blur-[120px] z-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-[0.12]' : 'opacity-[0.06]'}`}>
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] rounded-full bg-cyan-500/20 animate-[auroraPulse_20s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/15 animate-[auroraPulse_25s_ease-in-out_infinite_alternate_reverse]" />
    </div>
  );
}

// 🌐 พจนานุกรมแปลภาษา (เพิ่มข้อมูลภาควิชา)
const translations = {
  TH: {
    hubBadge: 'Executive Intelligence Hub',
    titleMain: 'AI Lecturer',
    titleSub: 'Workload Management',
    description: 'วิเคราะห์ระบบประเมินภาระงานและบริหารสัดส่วนการสอน รวมถึงภาระดูแลนักศึกษาของคณาจารย์คอมพิวเตอร์ ประจำปี 2026',
    formHeaderAdd: '👨‍🏫 บันทึกสัดส่วนภาระงานคณาจารย์ลง DB',
    formHeaderEdit: '📝 แก้ไขข้อมูลภาระงานอาจารย์',
    labelLecturerId: 'รหัสประจำตัวอาจารย์',
    phLecturerId: 'เช่น LEC-6901',
    labelTitle: 'ตำแหน่งทางวิชาการ',
    labelName: 'ชื่อ-นามสกุลอาจารย์',
    phName: 'กรอกชื่ออาจารย์...',
    labelEmail: 'อีเมลสถาบัน',
    phEmail: 'ajarn.name@university.ac.th',
    labelDepartment: 'ภาควิชา / สาขาวิชา',
    phDepartment: 'เช่น วิทยาการคอมพิวเตอร์',
    labelSubjects: 'รหัสวิชาสอน (คั่นด้วยเครื่องหมาย ,)',
    phSubjects: 'เช่น CS-101, CS-204',
    labelStudents: 'นักศึกษารวมในการดูแล (คน)',
    phStudents: 'เช่น 180',
    labelStatus: 'สถานะการทำงาน',
    btnSubmit: 'ประเมินภาระงานและบันทึก',
    btnUpdate: 'อัปเดตข้อมูลและคำนวณใหม่',
    btnCancel: 'ยกเลิก',
    btnEdit: 'แก้ไข',
    btnDelete: 'ลบ',
    confirmDelete: 'คุณต้องการลบข้อมูลภาระงานของอาจารย์ท่านนี้ใช่หรือไม่?',
    historyHeader: '📊 ผลการตรวจสอบการกระจายงานจริง (MongoDB Connection)',
    emptyList: 'ไม่มีประวัติภาระงานอาจารย์ในฐานข้อมูลคลาวด์หลังบ้าน',
    txtSubjects: 'วิชา',
    txtStudents: 'คน',
    txtRecommend: 'คำแนะนำ:',
    txtLoading: 'กำลังประมวลผล...'
  },
  EN: {
    hubBadge: 'Executive Intelligence Hub',
    titleMain: 'AI Lecturer',
    titleSub: 'Workload Management',
    description: 'Algorithmic assessment and metrics monitoring of academic workloads, specialized teaching modules, and student matrices for the year 2026.',
    formHeaderAdd: '👨‍🏫 Record Academic Workload Allocation to DB',
    formHeaderEdit: '📝 Edit Academic Workload Analytics',
    labelLecturerId: 'Lecturer ID',
    phLecturerId: 'e.g., LEC-6901',
    labelTitle: 'Academic Title',
    labelName: 'Lecturer Name',
    phName: 'Enter name...',
    labelEmail: 'Institution Email',
    phEmail: 'ajarn.name@university.ac.th',
    labelDepartment: 'Department',
    phDepartment: 'e.g., Computer Science',
    labelSubjects: 'Teaching Modules (Comma separated)',
    phSubjects: 'e.g., CS-101, CS-204',
    labelStudents: 'Total Students Managed',
    phStudents: 'e.g., 180',
    labelStatus: 'Work Status',
    btnSubmit: 'Evaluate & Save Workload',
    btnUpdate: 'Update & Re-calculate',
    btnCancel: 'Cancel',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this lecturer\'s workload record?',
    historyHeader: '📊 Live Curriculum Workload Distribution (MongoDB Connection)',
    emptyList: 'No workload logs detected within the centralized backend cloud database.',
    txtSubjects: 'Subjects',
    txtStudents: 'Students',
    txtRecommend: 'Recommendation:',
    txtLoading: 'Processing...'
  }
};

export default function LecturersWorkloadPage() {
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  
  // ⚙️ เพิ่มฟิลด์ department ใน State ของ Form
  const [form, setForm] = useState({ 
    lecturerId: '', 
    academicTitle: 'อาจารย์', 
    name: '', 
    email: '', 
    department: '', 
    subjects: '', 
    studentsCount: '', 
    status: 'Active' 
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const t = translations[lang];

  // 📖 READ (ดึงข้อมูลผ่าน Local IP)
  const fetchWorkloadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:3001/api/v1/lecturers?page=1&limit=100', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const resData = await res.json();
        if (Array.isArray(resData)) {
          setLecturers(resData);
        } else if (resData && Array.isArray(resData.data)) {
          setLecturers(resData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching real workload database:", error);
    }
  };

  useEffect(() => {
    fetchWorkloadHistory();
  }, []);

  // ➕ CREATE & ✏️ UPDATE (รวมส่งฟิลด์ department)
  const handleCalculateWorkload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lecturerId || !form.name || !form.email || !form.department || isLoading) return;

    setIsLoading(true);

    const subjectsArray = form.subjects 
      ? form.subjects.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const payload = { 
      lecturerId: form.lecturerId,
      academicTitle: form.academicTitle,
      name: form.name,
      email: form.email,
      department: form.department,
      subjects: subjectsArray, 
      studentsCount: Number(form.studentsCount) || 0, 
      status: form.status
    };

    const token = localStorage.getItem('token');

    try {
      let response;
      if (editingId) {
        response = await fetch(`http://127.0.0.1:3001/api/v1/lecturers/${editingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('http://127.0.0.1:3001/api/v1/lecturers', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        await fetchWorkloadHistory();
        resetForm();
      } else {
        const httpStatus = response.status;
        const errData = await response.json();
        console.error(`[Server Error ${httpStatus}]:`, errData);
        const errorMsg = Array.isArray(errData.message) 
          ? errData.message.join('\n') 
          : errData.message || 'Validation error';
        alert(`Failed (${httpStatus}):\n${errorMsg}`);
      }
    } catch (error) {
      console.error("Failed to process workload database request:", error);
      alert(`Network Error: หลังบ้าน (Port 3001) ปิดอยู่ หรือระบบเครือข่ายขัดข้อง`);
    } finally {
      setIsLoading(false);
    }
  };

  // ⚙️ PREPARE EDIT (ดึงค่า department มาใส่ในฟอร์มแก้ไข)
  const startEditLecturer = (lecturer: Lecturer) => {
    if (!lecturer._id) return;
    setEditingId(lecturer._id);
    setForm({
      lecturerId: lecturer.lecturerId,
      academicTitle: lecturer.academicTitle,
      name: lecturer.name,
      email: lecturer.email,
      department: lecturer.department || '',
      subjects: Array.isArray(lecturer.subjects) ? lecturer.subjects.join(', ') : '',
      studentsCount: (lecturer.studentsCount ?? 0).toString(),
      status: lecturer.status
    });
  };

  // 🗑️ DELETE
  const handleDeleteLecturer = async (id: string | undefined) => {
    if (!id || isLoading) return;
    if (!window.confirm(t.confirmDelete)) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:3001/api/v1/lecturers/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        await fetchWorkloadHistory();
        if (editingId === id) resetForm(); 
      }
    } catch (error) {
      console.error("Failed to delete workload record from database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ 
      lecturerId: '', 
      academicTitle: 'อาจารย์', 
      name: '', 
      email: '', 
      department: '',
      subjects: '', 
      studentsCount: '', 
      status: 'Active' 
    });
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
          
          <div className="px-6 lg:px-8 pt-4 flex justify-end gap-3 z-20 animate-[slideDown_0.5s_ease-out_both] transform-gpu">
            <div className={`flex p-1 rounded-xl border backdrop-blur-md transition-all duration-500 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/80 border-zinc-200'}`}>
              <button 
                type="button"
                onClick={() => setLang('TH')}
                className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer transition-all duration-300 ${lang === 'TH' ? 'bg-cyan-500 text-black' : 'text-zinc-500 hover:text-cyan-500'}`}
              >TH</button>
              <button 
                type="button"
                onClick={() => setLang('EN')}
                className={`px-3 py-1 text-[10px] font-mono tracking-wider font-bold rounded-lg cursor-pointer transition-all duration-300 ${lang === 'EN' ? 'bg-cyan-500 text-black' : 'text-zinc-500 hover:text-cyan-500'}`}
              >EN</button>
            </div>

            <button 
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900 text-cyan-400' : 'bg-white/80 border-zinc-200 text-cyan-600'}`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 animate-[spinSlow_8s_linear_infinite]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.22 5.22l1.59 1.59m10.38 10.38l1.59 1.59M3 12h2.25m13.5 0H21M5.22 18.78l1.59-1.59M17.56 6.44l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform -rotate-12"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
          </div>

          <main className="p-6 lg:p-8 flex-1 overflow-y-auto max-w-5xl space-y-6 transform-gpu relative custom-scrollbar">
            <div className="space-y-2 animate-[slideRight_0.6s_ease-out_both] transform-gpu">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-mono tracking-[0.25em] uppercase transition-all duration-500 ${theme === 'dark' ? 'border-cyan-500/10 bg-cyan-500/[0.02] text-cyan-400/80' : 'border-cyan-500/20 bg-cyan-500/[0.04] text-cyan-700'}`}>
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                {t.hubBadge}
              </div>
              <h1 className={`text-3xl font-extralight tracking-tight leading-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                💡 {t.titleMain} <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-500 filter drop-shadow-[0_2px_10px_rgba(34,211,238,0.05)]">{t.titleSub}</span>
              </h1>
              <p className={`text-xs font-light max-w-xl leading-relaxed tracking-wide text-zinc-500 transition-colors duration-500`}>
                {t.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start transform-gpu">
              {/* ฟอร์มกรอกข้อมูลคณาจารย์ */}
              <form 
                onSubmit={handleCalculateWorkload} 
                className={`p-5 rounded-xl border backdrop-blur-md space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 animate-[slideUp_0.5s_ease-out_0.2s_both] text-xs ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'} ${editingId ? 'ring-1 ring-cyan-500/50' : ''}`}
              >
                <h3 className={`font-bold transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                  {editingId ? t.formHeaderEdit : t.formHeaderAdd}
                </h3>
                
                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelLecturerId}</label>
                  <input 
                    type="text" 
                    value={form.lecturerId} 
                    onChange={e => setForm({...form, lecturerId: e.target.value})} 
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                    placeholder={t.phLecturerId} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelTitle}</label>
                  <select
                    value={form.academicTitle}
                    onChange={e => setForm({...form, academicTitle: e.target.value})}
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                  >
                    {['อาจารย์', 'ดร.', 'ผศ.', 'ผศ.ดร.', 'รศ.', 'รศ.ดร.', 'ศ.', 'ศ.ดร.'].map((title) => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelName}</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                    placeholder={t.phName} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelEmail}</label>
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                    placeholder={t.phEmail} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                {/* 🆕 เพิ่มฟิลด์กรอกข้อมูลภาควิชาลงใน UI ฟอร์ม */}
                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelDepartment}</label>
                  <input 
                    type="text" 
                    value={form.department} 
                    onChange={e => setForm({...form, department: e.target.value})} 
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                    placeholder={t.phDepartment} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelSubjects}</label>
                  <input 
                    type="text" 
                    value={form.subjects} 
                    onChange={e => setForm({...form, subjects: e.target.value})} 
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                    placeholder={t.phSubjects} 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelStudents}</label>
                  <input 
                    type="number" 
                    min="0"
                    value={form.studentsCount} 
                    onChange={e => setForm({...form, studentsCount: e.target.value})} 
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                    placeholder={t.phStudents} 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.labelStatus}</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                    className={`w-full border p-2.5 rounded-xl text-xs transition-all duration-300 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-black border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                  >
                    {['Active', 'On Leave', 'Resigned'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold rounded-xl text-xs tracking-wider transition-all duration-300 transform-gpu hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_15px_rgba(34,211,238,0.15)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t.txtLoading : (editingId ? t.btnUpdate : t.btnSubmit)}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={resetForm}
                      disabled={isLoading}
                      className={`px-4 py-2.5 rounded-xl font-mono text-xs cursor-pointer transition-all duration-300 border disabled:opacity-50 ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                    >
                      {t.btnCancel}
                    </button>
                  )}
                </div>
              </form>

              {/* ส่วนแสดงประวัติข้อมูลภาระงาน */}
              <div className="lg:col-span-2 space-y-4 animate-[slideUp_0.5s_ease-out_0.3s_both]">
                <h3 className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-500 ${theme === 'dark' ? 'text-cyan-400/80' : 'text-cyan-700'}`}>
                  {t.historyHeader}
                </h3>
                
                <div className="space-y-3">
                  {lecturers.length === 0 ? (
                    <div className={`p-8 text-center rounded-xl border font-mono text-xs transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-500 border-zinc-900 bg-black/20' : 'text-zinc-400 border-zinc-200 bg-zinc-50/50'}`}>
                      {t.emptyList}
                    </div>
                  ) : (
                    lecturers.map((l, i) => (
                      <div 
                        key={l._id || i} 
                        className={`p-5 rounded-xl border backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.01] shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'} ${editingId === l._id ? 'border-cyan-500/60 bg-cyan-500/[0.02]' : ''}`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700`}>{l.lecturerId}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${l.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{l.status}</span>
                          </div>
                          <div className={`font-serif text-base font-normal transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                            {l.academicTitle} {l.name}
                          </div>
                          {/* 🆕 แสดงผลข้อมูลภาควิชาควบคู่กับอีเมล */}
                          <div className={`text-[11px] font-mono text-zinc-500`}>
                            {l.department || 'N/A'} • {l.email}
                          </div>
                          
                          <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            <span>วิชาสอน: <strong className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}>{l.subjects ? l.subjects.length : 0}</strong> วิชา ({l.subjects ? l.subjects.join(', ') : 'ไม่มี'})</span>
                            <span>นักศึกษา: <strong className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}>{l.studentsCount || 0}</strong> {t.txtStudents}</span>
                          </div>
                        </div>

                        <div className="text-left md:text-right flex flex-col items-start md:items-end gap-1.5 min-w-[200px]">
                          <div className="flex items-center gap-2 w-full md:justify-end">
                            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all duration-500 ${
                              (l.workload || 0) >= 85 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                : (l.workload || 0) >= 60 
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              Workload: {l.workload || 0}%
                            </span>
                            
                            <div className="flex items-center border border-zinc-800/40 rounded-lg overflow-hidden text-[10px] font-mono">
                              <button
                                type="button"
                                onClick={() => startEditLecturer(l)}
                                disabled={isLoading}
                                className="px-2 py-1 bg-zinc-800/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                              >
                                {t.btnEdit}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLecturer(l._id)}
                                disabled={isLoading}
                                className="px-2 py-1 bg-zinc-800/20 text-red-400 hover:bg-red-500/20 border-l border-zinc-800/40 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                              >
                                {t.btnDelete}
                              </button>
                            </div>
                          </div>

                          <span className={`text-[11px] italic font-light transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            <strong className="font-mono not-italic text-[10px] uppercase font-bold text-cyan-500 tracking-wider mr-1">{t.txtRecommend}</strong> 
                            {l.recommend || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes auroraPulse {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.12; }
          50% { transform: scale(1.15) translate(20px, -10px); opacity: 0.18; }
          100% { transform: scale(0.95) translate(-10px, 15px); opacity: 0.10; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}; 
          border-radius: 99px; 
        }
      `}} />
    </div>
  );
}
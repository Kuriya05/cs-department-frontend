'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// ==========================================
// 🌐 CONFIG: API BASE URL (ดึงจาก Environment Variable บน Vercel อัตโนมัติ)
// ==========================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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

interface Student {
  _id?: string;
  name: string;
  studentId: string;
  email: string;
  year: number;
  gpa: number;
  attendanceRate: number;
  droppedCourses: number;
  risk: 'Low' | 'Medium' | 'High' | 'None';
  status: 'Active' | 'Suspended' | 'Graduated';
  major: string;
  courses: string[];
  lecturers: string[];
}

interface CourseFromDB {
  _id: string;
  courseCode: string;
  courseName: string;
  category?: string;
}

export default function CompleteCrudStudentsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [dbCourses, setDbCourses] = useState<CourseFromDB[]>([]);
  const [courseFetchError, setCourseFetchError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRisk, setSelectedRisk] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);

  // 🟢 [แก้ไขจุดพัง]: ขยาย Type ของ risk และ status เพื่อให้รองรับค่าระดับอื่นนอกจาก 'None' และ 'Active'
  const initialFormState = {
    name: '',
    studentId: '',
    email: '',
    year: 1,
    gpa: 3.50,
    attendanceRate: 95,
    droppedCourses: 0,
    risk: 'None' as 'Low' | 'Medium' | 'High' | 'None',
    status: 'Active' as 'Active' | 'Suspended' | 'Graduated',
    major: 'Computer Science',
    courses: [] as string[], 
    lecturersStr: 'ผศ.ดร.สมชาย ใจดี, อ.ดร.สมหญิง เรียนเก่ง'
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchAvailableCourses = async () => {
    try {
      setCourseFetchError(null);
      // 🌐 ปรับเป็น Dynamic URL รองรับระบบ Vercel
      const res = await fetch(`${API_BASE_URL}/courses`);
      
      if (res.ok) {
        const payload = await res.json();
        const extractedCourses = Array.isArray(payload) 
          ? payload 
          : (payload.data || payload.courses || []);
          
        setDbCourses(extractedCourses);
      } else {
        // Fallback Route
        const fallbackBase = API_BASE_URL.replace('/api/v1', '');
        const fallbackRes = await fetch(`${fallbackBase}/courses/all/selection`);
        if (fallbackRes.ok) {
          const fallbackPayload = await fallbackRes.json();
          const extractedFallback = Array.isArray(fallbackPayload) ? fallbackPayload : (fallbackPayload.data || []);
          setDbCourses(extractedFallback);
        } else {
          setCourseFetchError(`สถานะการเชื่อมต่อล้มเหลว: ${res.status}`);
        }
      }
    } catch (err) {
      console.error('ไม่สามารถโหลดข้อมูลรายวิชาจากคลัง Database ได้:', err);
      setCourseFetchError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์คลังวิชาหลักได้');
    }
  };

  const fetchStudents = async () => {
    try {
      // 🌐 ปรับเป็น Dynamic URL รองรับระบบ Vercel
      let url = `${API_BASE_URL}/students?page=${currentPage}&limit=5&search=${search}`;
      if (selectedRisk) url += `&risk=${selectedRisk}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        setStudents(result.data);
        setTotalPages(result.meta.totalPages);
        setTotalItems(result.meta.total);
      }
    } catch (err) {
      console.error('ไม่สามารถเชื่อมต่อ API ได้:', err);
    }
  };

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, search, selectedRisk]);

  const handleCourseToggle = (courseString: string) => {
    const currentSelected = formData.courses;
    if (currentSelected.includes(courseString)) {
      setFormData({
        ...formData,
        courses: currentSelected.filter(c => c !== courseString)
      });
    } else {
      setFormData({
        ...formData,
        courses: [...currentSelected, courseString]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: formData.name,
      studentId: formData.studentId,
      email: formData.email.toLowerCase().trim(),
      year: Number(formData.year),
      gpa: Number(formData.gpa),
      attendanceRate: Number(formData.attendanceRate),
      droppedCourses: Number(formData.droppedCourses),
      risk: formData.risk,
      status: formData.status,
      major: formData.major,
      courses: formData.courses, 
      lecturers: formData.lecturersStr.split(',').map(l => l.trim()).filter(Boolean)
    };

    try {
      let res;
      // 🌐 ปรับเป็น Dynamic URL รองรับระบบ Vercel
      if (isEditing && editingTargetId) {
        res = await fetch(`${API_BASE_URL}/students/${editingTargetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(isEditing ? '🔄 อัปเดตข้อมูลนักศึกษาเรียบร้อย!' : '🎯 เพิ่มนักศึกษาใหม่เข้าระบบสำเร็จ!');
        handleCancelEdit();
        fetchStudents();
      } else {
        const err = await res.json();
        alert(`⛔ [Error]: ${err.message}`);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการติดต่อระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (student: Student) => {
    setIsEditing(true);
    setEditingTargetId(student.studentId);
    setFormData({
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      year: student.year,
      gpa: student.gpa,
      attendanceRate: student.attendanceRate,
      droppedCourses: student.droppedCourses,
      risk: student.risk as any, // 🟢 [แก้ไขจุดพังด่านสุดท้าย]: ใส่ความปลอดภัย as any เคลียร์ปัญหา Vercel Type Check
      status: student.status,
      major: student.major,
      courses: student.courses || [], 
      lecturersStr: student.lecturers.join(', ')
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTargetId(null);
    setFormData(initialFormState);
  };

  const handleDelete = async (idOrStudentId: string, name: string) => {
    if (!confirm(`⚠️ คุณแน่ใจใช่ไหมที่จะลบข้อมูลของ "${name}" ออกจากระบบถาวร?`)) return;
    
    try {
      // 🌐 ปรับเป็น Dynamic URL รองรับระบบ Vercel
      const res = await fetch(`${API_BASE_URL}/students/${idOrStudentId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('❌ ลบข้อมูลนักศึกษาเรียบร้อยแล้ว!');
        if (editingTargetId === idOrStudentId) handleCancelEdit();
        fetchStudents();
      } else {
        alert('ไม่สามารถลบข้อมูลได้');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedData = async () => {
    setIsLoading(true);
    const mockDataset = [
      { name: 'นายณัฐพงษ์ ศรีสะอาด', studentId: '6604101301', email: 'mju6604101301@mju.ac.th', year: 3, gpa: 3.85, attendanceRate: 98, droppedCourses: 0, risk: 'None', status: 'Active', major: 'วิทยาการคอมพิวเตอร์ MJU', courses: ['CSS311 Web Application Development', 'CSS421 Artificial Intelligence and Machine Learning'], lecturers: ['ผศ.ดร.สมชาย ใจดี', 'อ.ดร.สมหญิง เรียนเก่ง'] },
      { name: 'นางสาววิภาดา พรหมดี', studentId: '6604101305', email: 'mju6604101305@mju.ac.th', year: 3, gpa: 1.82, attendanceRate: 54, droppedCourses: 3, risk: 'High', status: 'Active', major: 'วิทยาการคอมพิวเตอร์ MJU', courses: ['CSS421 Artificial Intelligence and Machine Learning'], lecturers: ['ผศ.ดร.สมชาย ใจดี', 'รศ.ดร.มานพ เรียนดี'] },
      { name: 'นายธนกร ใจซื่อ', studentId: '6704101420', email: 'mju6704101420@mju.ac.th', year: 2, gpa: 2.15, attendanceRate: 72, droppedCourses: 1, risk: 'Medium', status: 'Active', major: 'วิทยาการคอมพิวเตอร์ MJU', courses: ['CSS311 Web Application Development'], lecturers: ['อ.นพดล ขยันคิด'] }
    ];

    try {
      // 🌐 ปรับเป็น Dynamic URL รองรับระบบ Vercel
      const res = await fetch(`${API_BASE_URL}/students/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: mockDataset })
      });
      if (res.ok) {
        setCurrentPage(1);
        fetchStudents();
        fetchAvailableCourses();
        alert('🚀 Seed ข้อมูลระบบเข้าสู่ MongoDB เรียบร้อย!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

          <div className="px-8 pt-4 flex justify-end gap-3 z-20 animate-[slideDown_0.5s_ease-out_both] transform-gpu">
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

          <div className="px-8 pt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-[slideRight_0.6s_ease-out_both] transform-gpu">
            <div>
              <h1 className={`text-2xl font-extralight tracking-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                🎓 ระบบจัดการวิเคราะห์ข้อมูล <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.05)]">MJU Computer Science</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">CRUD Engine Active • ตรวจพบสารสนเทศทั้งหมด {totalItems} รายการ</p>
            </div>
            <button 
              onClick={handleSeedData} 
              disabled={isLoading} 
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-white font-mono text-xs tracking-wider rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md active:scale-95 disabled:opacity-40"
            >
              ⚡ SEED & REFRESH DATA
            </button>
          </div>

          <div className="px-8 pt-4 flex gap-4 text-xs font-mono animate-[slideUp_0.5s_ease-out_0.1s_both] transform-gpu">
            <input 
              type="text" 
              placeholder="🔍 ค้นหาชื่อ หรือ รหัสนักศึกษา..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
              className={`border rounded-xl p-2.5 w-80 focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-white/80 border-zinc-200 text-zinc-800 focus:border-amber-600'}`} 
            />
            <select 
              value={selectedRisk} 
              onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }} 
              className={`border rounded-xl p-2.5 focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300' : 'bg-white/80 border-zinc-200 text-zinc-700'}`}
            >
              <option value="">🎯 แสดงระดับความเสี่ยงทั้งหมด</option>
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <main className="p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8 custom-scrollbar relative">
            
            <div className={`p-6 rounded-2xl border backdrop-blur-md h-fit shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 animate-[slideUp_0.5s_ease-out_0.2s_both] transform-gpu ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}>
              <div className={`flex justify-between items-center mb-4 border-b pb-2 ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <h3 className={`text-xs font-mono tracking-wider ${isEditing ? 'text-cyan-500 font-bold' : 'text-amber-500'}`}>
                  {isEditing ? '🔄 กำลังแก้ไขข้อมูลนักศึกษา' : '➕ กรอกประวัตินักศึกษาใหม่'}
                </h3>
                {isEditing && (
                  <button type="button" onClick={handleCancelEdit} className={`text-[10px] px-2 py-0.5 rounded font-mono transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'}`}>
                    ยกเลิกแก้ไข
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3 text-[11px] font-mono">
                <div>
                  <label className="block text-zinc-400/80 mb-0.5">ชื่อ-นามสกุล</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200 focus:border-amber-500' : 'border-zinc-300 text-zinc-800 focus:border-amber-600'}`} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400/80 mb-0.5">รหัสนักศึกษา</label>
                    <input required type="text" disabled={isEditing} value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className={`w-full bg-transparent border rounded-lg p-2 disabled:opacity-40 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200' : 'border-zinc-300 text-zinc-800'}`} placeholder="6604101xxx" />
                  </div>
                  <div>
                    <label className="block text-zinc-400/80 mb-0.5">อีเมล</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200' : 'border-zinc-300 text-zinc-800'}`} placeholder="xxx@mju.ac.th" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-zinc-400/80 mb-0.5">ชั้นปี</label>
                    <input type="number" min="1" max="8" value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200' : 'border-zinc-300 text-zinc-800'}`} />
                  </div>
                  <div>
                    <label className="block text-zinc-400/80 mb-0.5">GPAX</label>
                    <input type="number" step="0.01" min="0" max="4" value={formData.gpa} onChange={e => setFormData({...formData, gpa: Number(e.target.value)})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200' : 'border-zinc-300 text-zinc-800'}`} />
                  </div>
                  <div>
                    <label className="block text-zinc-400/80 mb-0.5">ถอน (W)</label>
                    <input type="number" min="0" value={formData.droppedCourses} onChange={e => setFormData({...formData, droppedCourses: Number(e.target.value)})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200' : 'border-zinc-300 text-zinc-800'}`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400/80 mb-0.5">เข้าเรียน (%)</label>
                    <input type="number" min="0" max="100" value={formData.attendanceRate} onChange={e => setFormData({...formData, attendanceRate: Number(e.target.value)})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200' : 'border-zinc-300 text-zinc-800'}`} />
                  </div>
                  <div>
                    <label className="block text-zinc-400/80 mb-0.5">ความเสี่ยง AI</label>
                    <select value={formData.risk} onChange={e => setFormData({...formData, risk: e.target.value as any})} className={`w-full border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'}`}>
                      <option value="None">None</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-amber-500 font-bold mb-1">
                    📚 เลือกวิชาลงทะเบียน (ดึงจาก Database อัตโนมัติ)
                  </label>
                  
                  <div className={`w-full max-h-40 overflow-y-auto p-2 border rounded-lg space-y-1.5 custom-scrollbar ${
                    theme === 'dark' ? 'bg-black/40 border-zinc-800' : 'bg-zinc-50 border-zinc-300'
                  }`}>
                    {dbCourses.length === 0 ? (
                      <div className="text-zinc-500 italic text-center py-4 space-y-1">
                        <div>⚠️ ไม่พบข้อมูลรายวิชาในคลังหลัก</div>
                        {courseFetchError && (
                          <div className="text-[9px] text-red-400 not-italic">{courseFetchError}</div>
                        )}
                        <div className="text-[9px] text-zinc-600 font-light">
                          (โปรดตรวจสอบว่าเปิด Backend Server หรือมี Data ในคอลเลกชันวิชาแล้ว)
                        </div>
                      </div>
                    ) : (
                      dbCourses.map((course) => {
                        const courseFullStr = `${course.courseCode} ${course.courseName}`;
                        const isChecked = formData.courses.includes(courseFullStr);

                        return (
                          <label 
                            key={course._id} 
                            className={`flex items-start gap-2 p-1.5 rounded-md cursor-pointer transition-colors text-[10px] ${
                              isChecked 
                                ? theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-500/5 text-amber-600 font-bold'
                                : theme === 'dark' ? 'hover:bg-zinc-900 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCourseToggle(courseFullStr)}
                              className="mt-0.5 accent-amber-500"
                            />
                            <div>
                              <span className="font-bold font-mono text-amber-500 mr-1">[{course.courseCode}]</span>
                              <span>{course.courseName}</span>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-1 font-mono flex justify-between">
                    <span>เลือกอยู่ทั้งหมด: {formData.courses.length} วิชา</span>
                    <button 
                      type="button" 
                      onClick={fetchAvailableCourses} 
                      className="text-amber-500 hover:underline text-[9px]"
                    >
                      🔄 รีเฟรชคลังวิชา
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400/80 mb-0.5">อาจารย์ผู้สอน (คั่นด้วยเครื่องหมายจุลภาค `,` )</label>
                  <input type="text" value={formData.lecturersStr} onChange={e => setFormData({...formData, lecturersStr: e.target.value})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200' : 'border-zinc-300 text-zinc-800'}`} />
                </div>

                <button type="submit" disabled={isLoading} className={`w-full py-2.5 rounded-xl mt-2 font-bold cursor-pointer transition-all ${
                  isEditing 
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg' 
                    : theme === 'dark' 
                      ? 'bg-zinc-900 hover:bg-amber-500 hover:text-white border border-zinc-800 text-zinc-400 shadow-md' 
                      : 'bg-zinc-200 hover:bg-amber-600 hover:text-white border border-zinc-300 text-zinc-700 shadow-xs'
                }`}>
                  {isEditing ? '💾 บันทึกการอัปเดตข้อมูล' : '💾 บันทึกลงฐานข้อมูล MONGODB'}
                </button>
              </form>
            </div>

            <div className={`lg:col-span-2 p-6 rounded-2xl border backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 animate-[slideUp_0.5s_ease-out_0.3s_both] transform-gpu ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}>
              <div className="overflow-x-auto text-[10px] font-mono custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-zinc-500 ${theme === 'dark' ? 'border-zinc-900 bg-black/20' : 'border-zinc-200 bg-zinc-100/50'}`}>
                      <th className="p-2.5">รหัสและชื่อ</th>
                      <th className="p-2.5">GPAX / เช็คชื่อ</th>
                      <th className="p-2.5">ความเสี่ยง AI</th>
                      <th className="p-2.5">วิชา / คณาจารย์</th>
                      <th className="p-2.5 text-center">จัดการข้อมูล</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-zinc-500 italic">ไม่พบข้อมูลในฐานข้อมูล ดึงข้อมูลจากระบบล้มเหลว หรือกรุณากดปุ่ม SEED ข้อมูล</td>
                      </tr>
                    ) : (
                      students.map((st) => (
                        <tr key={st._id} className={`border-b hover:bg-amber-500/[0.02] transition-colors ${theme === 'dark' ? 'border-zinc-900/40' : 'border-zinc-200/60'}`}>
                          <td className="p-2.5">
                            <div className="font-bold text-amber-500">{st.studentId}</div>
                            <div className={`font-light text-[11px] ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'}`}>{st.name} (ปี {st.year})</div>
                          </td>
                          <td className="p-2.5">
                            <div className={theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}>เทอมนี้: <span className="font-bold">{st.gpa.toFixed(2)}</span></div>
                            <div className="text-zinc-400 text-[9px]">เข้าเรียน: {st.attendanceRate}% | W: {st.droppedCourses}</div>
                          </td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold shadow-xs ${
                              st.risk === 'High' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                              st.risk === 'Medium' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                              'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            }`}>{st.risk}</span>
                          </td>
                          <td className="p-2.5 text-[9px] max-w-[130px] truncate">
                            <div className={`truncate ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>📚 {st.courses.join(', ') || '-'}</div>
                            <div className="truncate text-zinc-500">👨‍🏫 {st.lecturers.join(', ') || '-'}</div>
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => startEdit(st)} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500 hover:text-white rounded text-cyan-400 text-[9px] cursor-pointer transition-all shadow-2xs">
                                แก้ไข
                              </button>
                              <button onClick={() => handleDelete(st.studentId, st.name)} className="px-2 py-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white rounded text-red-400 text-[9px] cursor-pointer transition-all shadow-2xs">
                                ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className={`mt-4 pt-3 border-t flex justify-between items-center text-[10px] font-mono ${theme === 'dark' ? 'border-zinc-900 text-zinc-500' : 'border-zinc-200 text-zinc-600'}`}>
                <span>กำลังแสดงหน้า {currentPage} จากทั้งหมด {totalPages} หน้า</span>
                <div className="flex gap-2">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className={`px-3 py-1 rounded border disabled:opacity-30 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-200 border-zinc-300 text-zinc-700 hover:bg-zinc-300'}`}>ย้อนกลับ</button>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className={`px-3 py-1 rounded border disabled:opacity-30 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-200 border-zinc-300 text-zinc-700 hover:bg-zinc-300'}`}>ถัดไป</button>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>

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
          height: 5px;
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
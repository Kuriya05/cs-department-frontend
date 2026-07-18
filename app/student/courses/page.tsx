'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

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
  const color = theme === "dark" ? "rgba(16, 185, 129, 0.25)" : "rgba(4, 120, 87, 0.15)";
  
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
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] rounded-full bg-emerald-500/20 animate-[auroraPulse_20s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-600/15 animate-[auroraPulse_25s_ease-in-out_infinite_alternate_reverse]" />
    </div>
  );
}

// 📑 แก้ไข Interface ให้ตรงตามโครงสร้าง DTO ของ Backend
interface Course {
  _id?: string;
  courseCode: string;
  courseName: string;
  credit: number;       
  semester: string;     
  teacher: string;      
  averageScore: number; 
}

export default function CrudCoursesByYearPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [search, setSearch] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>(''); 

  const [isEditing, setIsEditing] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);

  // ปรับเปลี่ยนโครงสร้าง State ให้จับคู่กับ Backend Validation ล่าสุด
  const initialFormState = {
    courseCode: '',
    courseName: '',
    credit: 3,
    semester: 'ปี 1 ภาคเรียนที่ 1', 
    teacher: '',
    averageScore: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  // 📖 [READ] ดึงข้อมูลรายวิชาทั้งหมด
  const fetchCourses = async () => {
    try {
      const resCourses = await fetch('http://localhost:3001/api/v1/courses');
      if (resCourses.ok) {
        const data = await resCourses.json();
        setCourses(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error('การโหลดข้อมูลล้มเหลว:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 💾 [CREATE & UPDATE] ส่งข้อมูลแบบกรองเฉพาะฟิลด์ที่ Backend อนุญาต
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseCode || !formData.courseName || !formData.teacher) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }
    setIsLoading(true);

    // สร้าง Payload ให้คลีน ไร้เงาตัวแปรต้องห้าม (year, category, students, lecturers)
    const payload = {
      courseCode: formData.courseCode.toUpperCase().trim(),
      courseName: formData.courseName.trim(),
      credit: Number(formData.credit),
      semester: formData.semester, // ส่งเป็น String ตามสั่ง
      teacher: formData.teacher.trim(),
      averageScore: Number(formData.averageScore)
    };

    try {
      let res;
      if (isEditing && editingTargetId) {
        res = await fetch(`http://localhost:3001/api/v1/courses/${editingTargetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('http://localhost:3001/api/v1/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(isEditing ? '🔄 อัปเดตข้อมูลรายวิชาสำเร็จ!' : '🎯 เพิ่มรายวิชาเข้าคลังแผนการศึกษาสำเร็จ!');
        handleCancelEdit();
        fetchCourses();
      } else {
        const err = await res.json();
        alert(`⛔ [ข้อผิดพลาดจากเซิร์ฟเวอร์]: ${Array.isArray(err.message) ? err.message.join(', ') : err.message}`);
      }
    } catch (err) {
      alert('เกิดปัญหาเครือข่ายในการส่งข้อมูลวิชา');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditCourse = (course: Course) => {
    if (!course._id) return;
    setIsEditing(true);
    setEditingTargetId(course._id);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credit: course.credit,
      semester: course.semester || 'ปี 1 ภาคเรียนที่ 1',
      teacher: course.teacher || '',
      averageScore: course.averageScore || 0
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTargetId(null);
    setFormData(initialFormState);
  };

  const handleDeleteCourse = async (courseId: string | undefined, code: string) => {
    if (!courseId) return;
    if (!confirm(`⚠️ ยืนยันที่จะลบวิชา "${code}" ออกจากฐานข้อมูลคลังหลัก?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/v1/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('❌ ลบวิชาออกจากระบบสำเร็จ');
        if (editingTargetId === courseId) handleCancelEdit();
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Seed ข้อมูลจำลองให้สอดคล้องกับ DTO ใหม่ของฐานข้อมูล
  const handleSeedCourses = async () => {
    setIsLoading(true);
    const mockCourses = [
      { courseCode: 'CS101', courseName: 'Introduction to Computer Science', credit: 3, semester: 'ปี 1 ภาคเรียนที่ 1', teacher: 'อาจารย์ ดร.สมหญิง เรียนเก่ง', averageScore: 3.25 },
      { courseCode: 'CS204', courseName: 'Data Structures and Algorithms', credit: 3, semester: 'ปี 2 ภาคเรียนที่ 1', teacher: 'ผศ.ดร.สมชาย ใจดี', averageScore: 2.80 },
      { courseCode: 'CS311', courseName: 'Web Application Development', credit: 3, semester: 'ปี 3 ภาคเรียนที่ 1', teacher: 'อ.นพดล ขยันคิด', averageScore: 3.45 },
      { courseCode: 'CS421', courseName: 'Artificial Intelligence and ML', credit: 4, semester: 'ปี 4 ภาคเรียนที่ 2', teacher: 'รศ.ดร.มานพ เรียนดี', averageScore: 3.10 }
    ];

    try {
      for (const course of mockCourses) {
        await fetch('http://localhost:3001/api/v1/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course)
        });
      }
      fetchCourses();
      alert('🚀 Seed ข้อมูลรายวิชาคอมพิวเตอร์ตามข้อกำหนด DTO ใหม่สำเร็จ!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // กรองข้อมูลแยกตามชั้นปีการศึกษาโดยตรวจหาคำสำคัญในตัวแปรแบบข้อความ (String)
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.courseCode.toLowerCase().includes(search.toLowerCase()) || 
                          c.courseName.toLowerCase().includes(search.toLowerCase()) ||
                          c.teacher.toLowerCase().includes(search.toLowerCase());
    const matchesYear = selectedYearFilter === '' ? true : c.semester.includes(`ปี ${selectedYearFilter}`);
    return matchesSearch && matchesYear;
  });

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans relative transition-colors duration-700 ${theme === 'dark' ? 'bg-[#030305] text-zinc-300' : 'bg-[#f4f5f7] text-zinc-700'}`}>
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 transition-all duration-700 ${theme === 'dark' ? 'bg-gradient-to-b from-[#030305] via-[#050907] to-[#030305]' : 'bg-gradient-to-b from-[#f8f9fa] via-[#edf3f0] to-[#f4f5f7]'}`} />
        <CosmicAuroraGlow theme={theme} />
        <DiamondDustBackground theme={theme} />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <div className="px-8 pt-4 flex justify-end gap-3 z-20 animate-[slideDown_0.5s_ease-out_both]">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 shadow-sm ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-900 text-emerald-400' : 'bg-white/80 border-zinc-200 text-emerald-600'}`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 animate-[spinSlow_8s_linear_infinite]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.22 5.22l1.59 1.59m10.38 10.38l1.59 1.59M3 12h2.25m13.5 0H21M5.22 18.78l1.59-1.59M17.56 6.44l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform -rotate-12"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
          </div>

          <div className="px-8 pt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-[slideRight_0.6s_ease-out_both]">
            <div>
              <h1 className={`text-2xl font-extralight tracking-tight transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                📚 ระบบจัดการสารสนเทศโครงสร้างวิชา <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 filter drop-shadow-[0_2px_10px_rgba(16,185,129,0.05)]">รายชั้นปีและภาคเรียน</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Course Database Engine Active • ตรวจพบสารสนเทศหลักสูตรทั้งหมด {filteredCourses.length} วิชา</p>
            </div>
            <button 
              onClick={handleSeedCourses}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-mono text-xs tracking-wider rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md active:scale-95 disabled:opacity-40"
            >
              ⚡ SEED VALIDATED COURSES
            </button>
          </div>

          <div className="px-8 pt-4 flex flex-wrap gap-4 text-xs font-mono animate-[slideUp_0.5s_ease-out_0.1s_both]">
            <input 
              type="text" 
              placeholder="🔍 ค้นหารหัสวิชา, ชื่อวิชา หรือชื่ออาจารย์..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className={`border rounded-xl p-2.5 w-80 focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800 text-zinc-100 focus:border-emerald-500' : 'bg-white/80 border-zinc-200 text-zinc-800 focus:border-emerald-600'}`} 
            />
            
            <div className={`flex border rounded-xl p-1 backdrop-blur-sm ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
              <button onClick={() => setSelectedYearFilter('')} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedYearFilter === '' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-emerald-400'}`}>ทุกชั้นปี</button>
              <button onClick={() => setSelectedYearFilter('1')} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedYearFilter === '1' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-emerald-400'}`}>ปี 1</button>
              <button onClick={() => setSelectedYearFilter('2')} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedYearFilter === '2' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-emerald-400'}`}>ปี 2</button>
              <button onClick={() => setSelectedYearFilter('3')} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedYearFilter === '3' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-emerald-400'}`}>ปี 3</button>
              <button onClick={() => setSelectedYearFilter('4')} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedYearFilter === '4' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-emerald-400'}`}>ปี 4</button>
            </div>
          </div>

          <main className="p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8 custom-scrollbar relative">
            
            {/* 📋 Form CRUD ที่ปรับแต่งฟิลด์ให้ถูกต้องแบบ 100% */}
            <div className={`p-6 rounded-2xl border backdrop-blur-md h-fit shadow-md transition-all duration-500 animate-[slideUp_0.5s_ease-out_0.2s_both] ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}>
              <div className="flex justify-between items-center mb-4 border-b pb-2 border-zinc-800">
                <h3 className={`text-xs font-mono tracking-wider font-bold ${isEditing ? 'text-cyan-400' : 'text-emerald-400'}`}>
                  {isEditing ? '🔄 ปรับปรุงข้อมูลรายวิชา' : '➕ เพิ่มรายวิชาเข้าคลังหลัก'}
                </h3>
                {isEditing && (
                  <button type="button" onClick={handleCancelEdit} className="text-[9px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded hover:bg-zinc-700">
                    ยกเลิก
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-[11px] font-mono">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-zinc-400 block mb-0.5">รหัสวิชา</label>
                    <input required type="text" value={formData.courseCode} onChange={e => setFormData({...formData, courseCode: e.target.value})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200 focus:border-emerald-500' : 'border-zinc-300 text-zinc-800 focus:border-emerald-600'}`} placeholder="เช่น CS204" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-zinc-400 block mb-0.5">ชื่อรายวิชา</label>
                    <input required type="text" value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200 focus:border-emerald-500' : 'border-zinc-300 text-zinc-800 focus:border-emerald-600'}`} placeholder="เช่น Data Structures..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-zinc-400 block mb-0.5">หน่วยกิต (Credit)</label>
                    <input required type="number" min="1" max="6" value={formData.credit} onChange={e => setFormData({...formData, credit: Number(e.target.value)})} className={`w-full bg-transparent border rounded-lg p-2 ${theme === 'dark' ? 'border-zinc-800 text-zinc-200 focus:border-emerald-500' : 'border-zinc-300 text-zinc-800 focus:border-emerald-600'}`} />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-0.5">คะแนนเฉลี่ยวิชา (Average Score)</label>
                    <input required type="number" step="0.01" min="0" max="4" value={formData.averageScore} onChange={e => setFormData({...formData, averageScore: Number(e.target.value)})} className={`w-full bg-transparent border rounded-lg p-2 ${theme === 'dark' ? 'border-zinc-800 text-zinc-200 focus:border-emerald-500' : 'border-zinc-300 text-zinc-800 focus:border-emerald-600'}`} />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-0.5">ระบุชั้นปี / ภาคการศึกษา (Semester String)</label>
                  <select value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className={`w-full border rounded-lg p-2 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'}`}>
                    <option value="ปี 1 ภาคเรียนที่ 1">ชั้นปี 1 - ภาคเรียนที่ 1</option>
                    <option value="ปี 1 ภาคเรียนที่ 2">ชั้นปี 1 - ภาคเรียนที่ 2</option>
                    <option value="ปี 2 ภาคเรียนที่ 1">ชั้นปี 2 - ภาคเรียนที่ 1</option>
                    <option value="ปี 2 ภาคเรียนที่ 2">ชั้นปี 2 - ภาคเรียนที่ 2</option>
                    <option value="ปี 3 ภาคเรียนที่ 1">ชั้นปี 3 - ภาคเรียนที่ 1</option>
                    <option value="ปี 3 ภาคเรียนที่ 2">ชั้นปี 3 - ภาคเรียนที่ 2</option>
                    <option value="ปี 4 ภาคเรียนที่ 1">ชั้นปี 4 - ภาคเรียนที่ 1</option>
                    <option value="ปี 4 ภาคเรียนที่ 2">ชั้นปี 4 - ภาคเรียนที่ 2</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-0.5">อาจารย์ผู้สอน (Teacher)</label>
                  <input required type="text" value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} className={`w-full bg-transparent border rounded-lg p-2 transition-colors ${theme === 'dark' ? 'border-zinc-800 text-zinc-200 focus:border-emerald-500' : 'border-zinc-300 text-zinc-800 focus:border-emerald-600'}`} placeholder="ระบุชื่ออาจารย์ผู้สอนหลัก..." />
                </div>

                <button type="submit" disabled={isLoading} className={`w-full py-2.5 rounded-xl font-bold cursor-pointer transition-all ${isEditing ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'}`}>
                  {isEditing ? '💾 บันทึกการอัปเดตวิชา' : '💾 บันทึกข้อมูลเข้าฐานข้อมูล'}
                </button>
              </form>
            </div>

            {/* 📊 ตารางแสดงรายวิชาที่แมปกับ DTO ล่าสุด */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border backdrop-blur-md flex flex-col justify-between shadow-lg ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white/70 border-zinc-200'}`}>
              <div className="overflow-x-auto text-[10px] font-mono custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-zinc-500 ${theme === 'dark' ? 'border-zinc-900 bg-black/20' : 'border-zinc-200 bg-zinc-100/50'}`}>
                      <th className="p-3">รหัส / รายวิชา</th>
                      <th className="p-3">โครงสร้างหลักสูตร</th>
                      <th className="p-3">อาจารย์ผู้รับผิดชอบ</th>
                      <th className="p-3">คะแนนเฉลี่ยวิชา</th>
                      <th className="p-3 text-center">การจัดการข้อมูล</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-zinc-500 italic">ไม่พบข้อมูลรายวิชาในกลุ่มโครงสร้างที่เลือก กรุณาเปลี่ยนฟิลเตอร์หรือกดปุ่ม SEED ข้อมูลด้านบน</td>
                      </tr>
                    ) : (
                      filteredCourses.map((course) => (
                        <tr key={course._id} className={`border-b hover:bg-emerald-500/[0.01] transition-colors ${theme === 'dark' ? 'border-zinc-900/40' : 'border-zinc-200/60'}`}>
                          <td className="p-3">
                            <span className="font-bold text-emerald-400 text-[11px] block">[{course.courseCode}]</span>
                            <span className={`text-[11px] font-medium ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>{course.courseName}</span>
                          </td>
                          <td className="p-3 space-y-0.5">
                            <div className="text-emerald-400 font-bold">{course.semester}</div>
                            <div className="text-zinc-400 text-[9px]">ขนาดหน่วยกิต: {course.credit} นก.</div>
                          </td>
                          <td className="p-3 text-emerald-500 font-medium text-[10px]">
                            👨‍🏫 {course.teacher || <span className="text-zinc-600 italic">ไม่มีข้อมูลอาจารย์</span>}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              course.averageScore >= 3.0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              course.averageScore >= 2.0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>{course.averageScore ? course.averageScore.toFixed(2) : '0.00'}</span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex flex-col sm:flex-row gap-1 justify-center">
                              <button onClick={() => startEditCourse(course)} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500 hover:text-white rounded text-cyan-400 text-[9px] cursor-pointer transition-all shadow-sm">
                                แก้ไข
                              </button>
                              <button onClick={() => handleDeleteCourse(course._id, course.courseCode)} className="px-2 py-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white rounded text-red-400 text-[9px] cursor-pointer transition-all shadow-sm">
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

              <div className={`mt-4 pt-3 border-t text-[9px] font-mono text-center ${theme === 'dark' ? 'border-zinc-900 text-zinc-500' : 'border-zinc-200 text-zinc-600'}`}>
                คลิกแถบเมนูฟิลเตอร์ชั้นปีด้านบนเพื่อคัดกรองวิชาในคลังหลักตามโครงสร้างการศึกษา
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
          50% { transform: scale(1.12) translate(15px, -10px); opacity: 0.16; }
          100% { transform: scale(0.98) translate(-5px, 10px); opacity: 0.09; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)'};
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.3); }
      `}} />
    </div>
  );
}
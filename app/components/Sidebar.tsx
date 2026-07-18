'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  // 🧭 เพิ่ม State สำหรับควบคุมการยืด-หุบ (เริ่มต้นให้หุบไว้)
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    setUserRole(localStorage.getItem('role') || 'GUEST');
    setUsername(localStorage.getItem('username') || localStorage.getItem('name') || 'Guest User');
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    router.push('/login');
  };

  const allMenuItems = [
    { name: 'Dashboard ผู้บริหาร', path: '/dashboard', icon: '📊' },
    { name: 'ข้อมูลนักศึกษา (Students)', path: '/students', icon: '🎓' },
    { name: 'AI Academic Analytics', path: '/courses', icon: '📈' },
    { name: 'รายวิชาตามชั้นปี', path: '/student/courses', icon: '📚' },
    { name: 'AI Risk Prediction', path: '/predict-risk', icon: '🎯' },
    { name: 'AI Course Recommend', path: '/ai', icon: '💡' },
    { name: 'AI Workload Analytics', path: '/lecturers', icon: '👨‍🏫' },
  ];

  return (
    <aside 
      // 🎛️ ตรวจจับการเข้าใกล้ (Mouse Enter) และออกห่าง (Mouse Leave) พร้อมใส่ Transition การเคลื่อนไหว
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={`bg-zinc-950/30 dark:bg-zinc-950/40 backdrop-blur-xl border-r border-zinc-900/40 dark:border-zinc-900/60 p-5 flex flex-col justify-between h-screen shrink-0 font-sans z-20 animate-[slideRight_0.5s_ease-out_both] transform-gpu transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20 items-center' : 'w-66'
      }`}
    >
      
      {/* 🔝 UPPER SECTION: Brand Identity & Menu Links */}
      <div className="space-y-6 w-full flex flex-col items-center">
        
        {/* 🤖 Brand Identity Header */}
        <div className={`flex flex-col gap-2.5 border-b border-zinc-900/50 pb-4 w-full ${isCollapsed ? 'items-center' : ''}`}>
          <div className="text-lg font-extralight tracking-[0.1em] text-zinc-100 font-mono flex items-center justify-center gap-2">
            <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] animate-[pulse_3s_infinite]">🤖</span>
            {!isCollapsed && (
              <span className="animate-[fadeIn_0.2s_ease-out] whitespace-nowrap">
                AI-CS <span className="font-serif italic text-cyan-400 font-normal">MIS</span>
              </span>
            )}
          </div>
          
          {/* Status Capsule Dynamic Badge */}
          {!isCollapsed && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.02] w-fit mx-auto animate-[fadeIn_0.2s_ease-out]">
              <span className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse"></span>
              <span className="text-[9px] font-mono tracking-wider font-bold text-cyan-400/90 uppercase whitespace-nowrap">
                STATUS: {userRole} MODE
              </span>
            </div>
          )}
        </div>

        {/* 🧭 Premium Navigation Links */}
        <nav className="flex flex-col gap-1.5 text-xs w-full">
          {allMenuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                title={isCollapsed ? item.name : undefined}
                className={`px-3 py-2.5 rounded-xl transition-all duration-300 font-medium flex items-center group transform-gpu cursor-pointer ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-950/40 via-cyan-950/20 to-transparent text-cyan-400 border border-cyan-500/20 shadow-[0_4px_20px_rgba(34,211,238,0.03)]' 
                    : 'text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-sm opacity-80 group-hover:scale-110 transition-transform duration-300 shrink-0 ${isActive ? 'opacity-100 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]' : ''}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="tracking-wide truncate animate-[fadeIn_0.2s_ease-out] whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
                
                {/* Active Indicator Glow Dot */}
                {isActive && !isCollapsed && (
                  <span className="relative flex h-1.5 w-1.5 shrink-0 animate-[fadeIn_0.2s_ease-out]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ⬇️ LOWER SECTION: Profile Identity & Dynamic Console Utility */}
      <div className="space-y-4 border-t border-zinc-900/50 pt-4 w-full flex flex-col items-center">
        
        {/* 👤 Account Identity Monitor */}
        <div className={`p-3 rounded-xl border border-zinc-900/60 bg-black/20 flex items-center w-full transition-all ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs text-cyan-400 font-mono font-bold shadow-xs shrink-0 select-none">
            {username?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-[fadeIn_0.2s_ease-out]">
              <p className="text-[11px] font-medium text-zinc-300 truncate tracking-wide">{username}</p>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{userRole?.toLowerCase()}</p>
            </div>
          )}
        </div>

        {/* 🔘 Dual System Control Buttons (Home & Logout) */}
        <div className={`grid gap-2 text-[10px] font-mono tracking-wider font-bold w-full ${isCollapsed ? 'grid-cols-1 justify-items-center' : 'grid-cols-2'}`}>
          {/* ปุ่มกลับหน้าหลัก */}
          <Link 
            href="/" 
            title="🏠 HOME"
            className={`py-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer transform-gpu active:scale-95 shadow-2xs ${
              isCollapsed ? 'w-10 h-10 text-sm' : 'w-full'
            }`}
          >
            {isCollapsed ? '🏠' : '🏠 HOME'}
          </Link>
          
          {/* ปุ่มออกจากระบบ */}
          <button 
            onClick={handleLogout}
            type="button"
            title="🛑 LOGOUT"
            className={`py-2 rounded-xl bg-red-950/20 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 text-red-400/80 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer transform-gpu active:scale-95 shadow-2xs ${
              isCollapsed ? 'w-10 h-10 text-sm' : 'w-full'
            }`}
          >
            {isCollapsed ? '🛑' : '🛑 LOGOUT'}
          </button>
        </div>

        {/* 🧾 Signature Developer Credit */}
        {!isCollapsed && (
          <div className="flex flex-col gap-0.5 pl-0.5 w-full text-left animate-[fadeIn_0.2s_ease-out]">
            <span className="text-[8px] tracking-[0.2em] font-mono font-bold text-zinc-600 uppercase">
              ENGINEERED BY
            </span>
            <span className="text-[10px] font-serif italic text-zinc-400/80 tracking-wide hover:text-cyan-400 transition-colors duration-300">
              Kuriya Thathe
            </span>
          </div>
        )}
      </div>

      {/* Inject custom global keyframe animation for standard fade-in */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </aside>
  );
}
'use client';

export default function Navbar() {
  return (
    <header className="h-16 w-full border-b border-zinc-900/40 dark:border-zinc-900/60 bg-zinc-950/10 dark:bg-zinc-950/20 backdrop-blur-md px-6 lg:px-8 flex items-center justify-between z-30 animate-[slideDown_0.4s_ease-out_both] transform-gpu">
      
      {/* 🗓️ System Year Badge (Premium Capsule Design) */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] shadow-[0_2px_10px_rgba(34,211,238,0.02)] transition-all duration-300 hover:border-cyan-500/20">
        <span className="text-[10px] font-mono tracking-[0.15em] font-medium text-zinc-400">
          SYSTEM YEAR:
        </span>
        <span className="text-[10px] font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
          2569
        </span>
      </div>

      {/* 🌐 Network Status (Live Cloud Connected) */}
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.01] transition-all duration-300">
        <div className="relative flex h-2 w-2">
          {/* Outer Glowing Ring */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-45"></span>
          {/* Inner Core */}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
        </div>
        <span className="text-[9px] text-zinc-500 font-mono tracking-[0.2em] font-bold uppercase">
          Live Cloud Connected
        </span>
      </div>

    </header>
  );
}
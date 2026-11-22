import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, Sparkles, ShieldCheck, FileText, Briefcase, GraduationCap, 
  Code2, Zap, ArrowUpRight, Cpu 
} from 'lucide-react';

/**
 * FloatingResume3D Component
 * Premium 3D animated resume visualization with:
 * - White theme & Dark theme support
 * - 3D perspective depth with smooth interactive mouse parallax
 * - Continuous dual-pass glowing AI laser scanner
 * - Floating ATS Score Panel (98/100, 100% ATS Ready)
 * - Neural AI Engine badge
 * - 95% Match Score badge
 * - Verified ATS Skills tags (Next.js, React, Node.js, TypeScript, PostgreSQL, Tailwind)
 * - 3D flowing satin ribbons
 * - Continuous gentle 3D floating animation
 */
export default function FloatingResume3D({ 
  candidateName = 'Alex Rivera', 
  jobTitle = 'Senior AI Full-Stack Engineer',
  theme = 'white', // 'white' | 'dark'
  onInspectATS
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const isWhite = theme === 'white';

  // Mouse Parallax Effect (smooth 3D spring tilt)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Dampened tilt values (-8deg to +8deg)
    const rotateY = (x / (rect.width / 2)) * 7;
    const rotateX = -(y / (rect.height / 2)) * 7;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const initials = candidateName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AR';

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[480px] h-[550px] flex items-center justify-center select-none"
      style={{ perspective: '1400px' }}
    >
      {/* 3D Container: Outer layer has continuous gentle float, inner layer has mouse parallax */}
      <div 
        className="relative w-full h-full flex items-center justify-center animate-float-3d"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered 
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` 
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
          }}
        >
        {/* Soft Ambient Glow Halo behind the document */}
        <div 
          className="absolute inset-4 rounded-3xl blur-3xl opacity-60 pointer-events-none -z-10"
          style={{
            background: isWhite
              ? 'radial-gradient(circle, rgba(99, 53, 245, 0.28) 0%, rgba(167, 139, 250, 0.2) 45%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 53, 245, 0.45) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 75%)'
          }}
        />

        {/* Outer 3D Satin Ribbon Loop (Passes through depth behind sheet) */}
        <svg 
          className="absolute -left-16 bottom-8 w-68 h-68 pointer-events-none -z-10 opacity-80 drop-shadow-[0_20px_35px_rgba(99,53,245,0.35)]"
          viewBox="0 0 200 200" 
          fill="none"
        >
          <path
            d="M25 175 C45 110, 85 75, 145 95 C185 110, 180 165, 130 170 C75 175, 45 125, 65 65 C75 35, 110 15, 150 25"
            stroke="url(#ribbonBack3DGrad)"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="ribbonBack3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4318FF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* The 3D Resume Document Card */}
        <div 
          className={`relative z-10 w-[360px] sm:w-[395px] backdrop-blur-xl rounded-3xl p-6 overflow-hidden transition-colors duration-300 ${
            isWhite 
              ? 'bg-white/95 border border-purple-100 shadow-[0_25px_60px_-12px_rgba(99,53,245,0.18),0_8px_24px_rgba(0,0,0,0.04)] text-[#1F2937]' 
              : 'bg-[#131126]/95 border border-white/15 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(99,53,245,0.22)] text-white'
          }`}
          style={{
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Continuous Glowing AI Scanner Laser Line + Trailing Pulse */}
          <div 
            className="absolute left-0 right-0 pointer-events-none z-30"
            style={{
              height: '2px',
              background: isWhite
                ? 'linear-gradient(90deg, transparent 0%, rgba(99,53,245,0.3) 15%, #38BDF8 50%, #A855F7 85%, transparent 100%)'
                : 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.8) 25%, #A855F7 50%, rgba(56, 189, 248, 0.8) 75%, transparent 100%)',
              boxShadow: isWhite
                ? '0 0 16px 3px rgba(168, 85, 247, 0.6), 0 0 28px 6px rgba(56, 189, 248, 0.4)'
                : '0 0 20px 4px rgba(168, 85, 247, 0.8), 0 0 40px 10px rgba(56, 189, 248, 0.5)',
              animation: 'aiLaserScan 4s ease-in-out infinite',
            }}
          >
            <div 
              className="absolute -inset-x-0 -top-3 -bottom-3 opacity-30 blur-sm pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), rgba(168,85,247,0.6), transparent)'
              }}
            />
          </div>

          {/* Top Document Header: Avatar + Candidate Details */}
          <div className={`flex items-start justify-between gap-3 pb-3.5 border-b ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6335F5] via-[#8B5CF6] to-[#38BDF8] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 border border-white/40">
                {initials}
              </div>
              <div>
                <h3 className={`text-base font-extrabold tracking-tight leading-tight ${isWhite ? 'text-[#111827]' : 'text-white'}`}>
                  {candidateName}
                </h3>
                <p className={`text-xs font-semibold ${isWhite ? 'text-[#6335F5]' : 'text-[#A78BFA]'}`}>{jobTitle}</p>
              </div>
            </div>

            <div className={`text-[10px] space-y-0.5 text-right font-medium ${isWhite ? 'text-[#6B7280]' : 'text-gray-400'}`}>
              <div>alex@example.com</div>
              <div>San Francisco, CA</div>
              <div className={isWhite ? 'text-[#3B82F6]' : 'text-[#38BDF8]'}>github.com/alexr</div>
            </div>
          </div>

          {/* Section 1: Professional Summary */}
          <div className={`py-3 border-b ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
            <div className={`flex items-center gap-1.5 text-xs font-bold mb-1.5 ${isWhite ? 'text-[#1F2937]' : 'text-gray-200'}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center ${isWhite ? 'bg-[#EDE9FE] text-[#6335F5]' : 'bg-[#6335F5]/30 text-[#A78BFA]'}`}>
                <FileText className="w-2.5 h-2.5" />
              </div>
              <span>Professional Summary</span>
            </div>
            <p className={`text-[11px] leading-relaxed pl-5 ${isWhite ? 'text-[#4B5563]' : 'text-gray-300'}`}>
              High-impact engineer with 6+ years designing scalable cloud architectures, high-concurrency systems, and production GenAI pipelines.
            </p>
          </div>

          {/* Section 2: Work Experience */}
          <div className={`py-3 border-b ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
            <div className={`flex items-center gap-1.5 text-xs font-bold mb-1.5 ${isWhite ? 'text-[#1F2937]' : 'text-gray-200'}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center ${isWhite ? 'bg-[#EDE9FE] text-[#6335F5]' : 'bg-[#6335F5]/30 text-[#A78BFA]'}`}>
                <Briefcase className="w-2.5 h-2.5" />
              </div>
              <span>Experience</span>
            </div>
            <div className="pl-5 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-bold ${isWhite ? 'text-[#111827]' : 'text-white'}`}>Staff AI Engineer • ScaleGrid Inc.</span>
                <span className={`text-[10px] font-mono font-semibold ${isWhite ? 'text-[#6335F5]' : 'text-[#38BDF8]'}`}>2022 – Present</span>
              </div>
              <p className={`text-[11px] ${isWhite ? 'text-[#4B5563]' : 'text-gray-300'}`}>
                • Reduced inference latency by 42% through quantized models and vector caching.
              </p>
            </div>
          </div>

          {/* Section 3: Education */}
          <div className={`py-3 border-b ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
            <div className={`flex items-center gap-1.5 text-xs font-bold mb-1.5 ${isWhite ? 'text-[#1F2937]' : 'text-gray-200'}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center ${isWhite ? 'bg-[#EDE9FE] text-[#6335F5]' : 'bg-[#6335F5]/30 text-[#A78BFA]'}`}>
                <GraduationCap className="w-2.5 h-2.5" />
              </div>
              <span>Education</span>
            </div>
            <div className="pl-5 flex items-center justify-between text-[11px]">
              <div>
                <span className={`font-bold ${isWhite ? 'text-[#111827]' : 'text-white'}`}>B.S. Computer Science</span>
                <p className={`text-[10px] ${isWhite ? 'text-[#6B7280]' : 'text-gray-400'}`}>UC Berkeley • Magna Cum Laude</p>
              </div>
              <span className={`text-[10px] font-mono ${isWhite ? 'text-[#6B7280]' : 'text-gray-400'}`}>2018 – 2022</span>
            </div>
          </div>

          {/* Section 4: Skills Pills with Match Checkmarks */}
          <div className="pt-2.5">
            <div className={`flex items-center gap-1.5 text-xs font-bold mb-2 ${isWhite ? 'text-[#1F2937]' : 'text-gray-200'}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center ${isWhite ? 'bg-[#EDE9FE] text-[#6335F5]' : 'bg-[#6335F5]/30 text-[#A78BFA]'}`}>
                <Code2 className="w-2.5 h-2.5" />
              </div>
              <span>Verified ATS Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-5">
              {['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind'].map((skill, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                    isWhite
                      ? 'bg-[#FAF5FF] border border-[#DDD6FE] text-[#581C87] hover:bg-[#EDE9FE]'
                      : 'bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <Check className={`w-2.5 h-2.5 stroke-[3] ${isWhite ? 'text-emerald-600' : 'text-[#34D399]'}`} />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating 3D ATS Score Panel (Top-Left, translateZ = 45px) */}
        <div 
          onClick={onInspectATS}
          className="absolute -top-4 -left-6 z-30 cursor-pointer group"
          style={{
            transform: 'translateZ(45px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="animate-badge-float-1">
            <div className={`backdrop-blur-xl rounded-2xl px-4 py-3 flex items-center gap-3 hover:scale-105 transition-all duration-200 ${
              isWhite 
                ? 'bg-white/95 border border-emerald-300 shadow-[0_15px_35px_rgba(16,185,129,0.2),0_4px_12px_rgba(0,0,0,0.04)]' 
                : 'bg-[#17142E]/95 border border-emerald-500/40 shadow-[0_15px_35px_rgba(16,185,129,0.25)]'
            }`}>
              {/* Circular Progress Indicator */}
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className={isWhite ? 'text-emerald-100' : 'text-white/10'}
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={isWhite ? 'text-emerald-500' : 'text-emerald-400'}
                    strokeDasharray="98, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className={`absolute font-black text-xs ${isWhite ? 'text-emerald-950' : 'text-white'}`}>98</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className={`w-3.5 h-3.5 ${isWhite ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <span className={`text-xs font-black ${isWhite ? 'text-[#111827]' : 'text-white'}`}>100% ATS Ready</span>
                </div>
                <p className={`text-[10px] font-bold ${isWhite ? 'text-emerald-700' : 'text-emerald-300'}`}>Single-Column Parse ✓</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating 3D AI Analysis Indicator (Top-Right, translateZ = 40px) */}
        <div 
          className="absolute -top-5 -right-5 z-30 pointer-events-none"
          style={{
            transform: 'translateZ(40px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="animate-badge-float-2">
            <div className="bg-gradient-to-r from-[#6335F5] to-[#7C3AED] rounded-2xl px-3.5 py-2 shadow-[0_15px_30px_rgba(99,53,245,0.35)] border border-purple-300/50 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#38BDF8] animate-pulse" />
              <div>
                <div className="text-[11px] font-black text-white leading-tight">Neural AI Engine</div>
                <div className="text-[9px] text-purple-200 font-medium">Keywords Synced 100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating 3D Match Indicator (Bottom-Right, translateZ = 35px) */}
        <div 
          onClick={onInspectATS}
          className="absolute -bottom-5 -right-6 z-30 cursor-pointer group"
          style={{
            transform: 'translateZ(35px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="animate-badge-float-1">
            <div className={`backdrop-blur-xl rounded-2xl px-4 py-3 flex items-center gap-3 hover:scale-105 transition-all duration-200 ${
              isWhite 
                ? 'bg-white/95 border border-purple-200 shadow-[0_15px_35px_rgba(99,53,245,0.18),0_4px_12px_rgba(0,0,0,0.04)]' 
                : 'bg-[#17142E]/95 border border-purple-400/30 shadow-[0_15px_35px_rgba(99,53,245,0.3)]'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isWhite 
                  ? 'bg-[#EDE9FE] border border-purple-200 text-[#6335F5]' 
                  : 'bg-purple-500/20 border border-purple-400/40 text-[#A78BFA]'
              }`}>
                <Sparkles className={`w-5 h-5 ${isWhite ? 'text-[#6335F5]' : 'text-[#38BDF8]'}`} />
              </div>
              <div>
                <div className={`text-xs font-bold ${isWhite ? 'text-[#111827]' : 'text-white'}`}>95% Match Score</div>
                <div className={`text-[10px] font-medium ${isWhite ? 'text-[#6B7280]' : 'text-gray-300'}`}>Top 2% Applicant Tier</div>
              </div>
            </div>
          </div>
        </div>

        {/* Foreground 3D Satin Ribbon (Sweeping around bottom-left corner) */}
        <svg 
          className="absolute -left-14 -bottom-6 w-60 h-52 pointer-events-none z-40 drop-shadow-2xl" 
          viewBox="0 0 200 160" 
          fill="none"
        >
          <path
            d="M15 135 C50 160, 100 145, 130 110 C155 80, 145 45, 115 40 C80 35, 50 70, 60 105 C70 135, 115 150, 180 115"
            stroke="url(#ribbonFront3DGrad)"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="ribbonFront3DGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="40%" stopColor="#6335F5" />
              <stop offset="75%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>

        </div>
      </div>
    </div>
  );
}

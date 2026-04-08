import { useState } from 'react'
import { navLinks } from '../../data/mockData'
import { Menu, X, Activity } from 'lucide-react'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Top Detail: F1 Speed Line & DRS Zone Indicator */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-800">
        <div className="h-full bg-[#FFD700] w-1/3 animate-pulse shadow-[0_0_10px_#FFD700]" />
      </div>

      {/* --- FINISH LINE ACCENT (LEFT/RIGHT) --- */}
      <div className="absolute inset-y-0 left-0 w-12 opacity-[0.05] bg-[repeating-conic-gradient(#fff_0%_25%,transparent_0%_50%)] bg-[size:10px_10px]" />
      <div className="absolute inset-y-0 right-0 w-12 opacity-[0.05] bg-[repeating-conic-gradient(#fff_0%_25%,transparent_0%_50%)] bg-[size:10px_10px]" />

      <div className="relative container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section / Race ID */}
          <div className="flex items-center gap-4">
            <div className="bg-[#FFD700] p-1 skew-x-[-15deg] w-7 h-7 flex items-center justify-center overflow-hidden">
              <img 
                src="/sbdg.png"  // Sesuaikan ekstensinya (.png, .jpg, atau .webp)
                alt="Sonic Bandung Logo" 
                className="w-full h-full object-cover skew-x-[15deg]" 
              />
            </div>
            <div className="flex flex-col">
              <span className="bebas text-xl text-white tracking-tighter leading-none italic">SONIC BANDUNG</span>
              <span className="text-[8px] text-[#FFD700] font-mono tracking-[0.3em] uppercase">Telemetry.v17</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center h-full">
            <ul className="flex items-center gap-2 h-full">
              {navLinks.map(({ label, href }, idx) => (
                <li key={label} className="h-full group relative">
                  <a
                    href={href}
                    className="relative flex items-center px-8 h-full text-white/70 hover:text-[#FFD700] font-black italic tracking-widest text-[11px] uppercase transition-all duration-300"
                  >
                    {/* Hover Background: F1 Red/Yellow accent */}
                    <span className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Text Layer */}
                    <span className="relative z-10">{label}</span>
                    
                    {/* Gear Shift Underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#FFD700] group-hover:w-full transition-all duration-500 ease-out" />
                    <span className="absolute top-0 left-0 w-[1px] h-0 bg-white/10 group-hover:h-1/2 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Info (F1 Style) */}
          <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-8">
             <div className="flex flex-col items-end">
                <span className="text-[9px] text-white/30 font-mono tracking-widest">CURRENT_LAP</span>
                <span className="text-sm font-black italic text-white">S17 / BDO</span>
             </div>
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative">
                <div className="absolute inset-0 border-t-2 border-[#FFD700] rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-[#FFD700]">MAX</span>
             </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/40">PIT_STOP</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-neutral-900 border border-neutral-800 text-white hover:text-[#FFD700] transition-colors skew-x-[-10deg]"
            >
              <div className="skew-x-[10deg]">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-[#0A0A0A] border-t border-[#FFD700]/30 shadow-2xl animate-race-slide overflow-hidden">
            {/* Checkerboard Pattern BG */}
            <div className="absolute inset-0 opacity-[0.03] bg-[repeating-conic-gradient(#fff_0%_25%,transparent_0%_50%)] bg-[size:20px_20px]" />
            
            <ul className="relative py-6">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-8 py-4 text-white hover:text-black hover:bg-[#FFD700] font-black italic tracking-widest text-sm transition-all duration-300 border-b border-white/5 group"
                  >
                    <span>{label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">🏁</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style >{`
        @keyframes race-slide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-race-slide {
          animation: race-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </nav>
  )
}

export default Navbar
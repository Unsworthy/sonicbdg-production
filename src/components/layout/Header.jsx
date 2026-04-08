import React from 'react';

const Header = () => {
  return (
    <header className="relative bg-[#050505] py-16 md:py-24 lg:py-48 overflow-hidden min-h-[100vh] md:min-h-[700px] flex items-center font-sans">
      
      {/* --- F1 TELEMETRY BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHZpZXdCb3g9IjAgMCA0IDQiPjxnIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjQiPjxwYXRoIGQ9Ik0wIDBoMnYySDBWMHptMiAySDR2MkgwVjB6bTIgMEg0djJIMlYyek0wIDJoMnYySDBWMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px]" />

        {/* Speed Lines */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"
            style={{ 
              top: `${15 + (i * 10)}%`, 
              transform: `skewY(-15deg) translateX(${i * 10}px)`,
              opacity: 1 - (i * 0.1)
            }}
          />
        ))}

        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[150%] h-full bg-[#FFD700]/5 rounded-full blur-[100px] md:blur-[150px]" />
      </div>

      {/* --- FINISH LINE CHECKERBOARD (MOBILE OPTIMIZED) --- */}
      <div 
        className="absolute inset-y-0 left-0 w-[60px] md:w-[250px] opacity-10 -skew-x-[15deg] md:-skew-x-[20deg]" 
        style={{ 
          backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
          backgroundSize: '20px 20px',
          maskImage: 'linear-gradient(to right, #000 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, #000 40%, transparent 100%)'
        }} 
      />
      <div 
        className="absolute inset-y-0 right-0 w-[60px] md:w-[250px] opacity-10 skew-x-[15deg] md:skew-x-[20deg]" 
        style={{ 
          backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
          backgroundSize: '20px 20px',
          maskImage: 'linear-gradient(to left, #000 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, #000 40%, transparent 100%)'
        }} 
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center">
        
        {/* --- TOP BADGE --- */}
        <div className="mb-10 md:mb-16 flex items-center gap-2 md:gap-3">
          <div className="w-8 md:w-12 h-1 bg-[#FFD700]" />
          <div className="px-3 md:px-6 py-2 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center gap-2 md:gap-3 shadow-xl relative overflow-hidden">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
            </span>
            <span className="text-white/60 font-medium italic tracking-[0.1em] md:tracking-[0.3em] uppercase text-[8px] md:text-[10px] whitespace-nowrap">
              BDO Hub // Status: <span className="text-[#FFD700] font-bold">OPTIMAL</span>
            </span>
          </div>
          <div className="w-8 md:w-12 h-1 bg-[#FFD700]" />
        </div>

        {/* --- TITLE SECTION (RESPONSIVE) --- */}
        <div className="flex flex-col items-center select-none italic bebas uppercase tracking-tighter text-[18vw] md:text-[13rem] leading-[0.8] md:leading-[0.7] group relative w-full">
          
          <div className="absolute -top-4 md:-top-6 left-0 md:-left-10 text-[8px] md:text-[10px] text-white/20 tracking-widest font-mono">
            DATA_STREAM // S-BDO.v17
          </div>

          {/* SONIC (5 Layers White Ghosting) */}
          <div className="relative flex items-center justify-center skew-x-[-8deg]">
            <span className="absolute text-white/5 -translate-x-48 blur-2xl">SONIC</span>
            <span className="absolute text-white/5 -translate-x-36 blur-xl">SONIC</span>
            <span className="absolute text-white/10 -translate-x-24 blur-lg">SONIC</span>
            <span className="absolute text-white/15 -translate-x-12 blur-md">SONIC</span>
            <span className="absolute text-white/30 -translate-x-6 blur-sm">SONIC</span>
            <span className="relative text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">SONIC</span>
          </div>

          {/* BANDUNG (5 Layers Yellow Ghosting) */}
          <div className="relative flex items-center justify-center mt-6 skew-x-[-8deg]">
            <span className="absolute text-[#FFD700]/5 -translate-x-48 blur-2xl">BANDUNG</span>
            <span className="absolute text-[#FFD700]/5 -translate-x-36 blur-xl">BANDUNG</span>
            <span className="absolute text-[#FFD700]/10 -translate-x-24 blur-lg">BANDUNG</span>
            <span className="absolute text-[#FFD700]/15 -translate-x-12 blur-md">BANDUNG</span>
            <span className="absolute text-[#FFD700]/30 -translate-x-6 blur-sm">BANDUNG</span>
            <span className="relative text-[#FFD700] brightness-125 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">BANDUNG</span>
          </div>


          <div className="absolute -bottom-4 md:-bottom-6 right-0 md:-right-10 text-[8px] md:text-[10px] text-white/20 tracking-widest font-mono">
            CHASSIS: SB-ONIC-17
          </div>
        </div>

        {/* --- STATS BAR (MOBILE GRID 2x2) --- */}
        <div className="mt-20 md:mt-28 w-full max-w-6xl bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-sm p-1.5 md:p-2 shadow-2xl relative overflow-hidden">
          {/* Rev Lights */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-60 scale-75 md:scale-100">
            {[...Array(15)].map((_,i) => (
              <div key={i} className={`w-2 md:w-4 h-1 rounded-full animate-pulse ${i < 5 ? 'bg-white' : i < 10 ? 'bg-[#FFD700]' : 'bg-white'}`}/>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2 pt-4 md:pt-6">
            {[
              ['500+', 'Members'],
              ['S17', 'Season'],
              ['BDO', 'Region'],
              ['100%', 'Power']
            ].map(([val, label], idx) => (
              <div key={label} className="bg-[#020202] p-4 md:p-6 flex flex-col items-center md:items-start border border-neutral-800 transition-all hover:border-[#FFD700]/40 rounded-sm">
                <span className="text-[8px] md:text-[10px] text-white/30 font-bold tracking-[0.2em] md:tracking-[0.4em] mb-1 uppercase">{label}</span>
                <span className={`text-3xl md:text-5xl font-black italic tracking-tighter ${idx === 3 ? 'text-[#FFD700]' : 'text-white'}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>

      <button
        onClick={() => document.getElementById('daftar').scrollIntoView({ behavior: 'smooth' })}
        className="mt-12 md:mt-16 group relative overflow-hidden px-10 md:px-16 py-4 md:py-5 bg-[#FFD700] text-black transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.3)] skew-x-[-12deg] w-full md:w-auto">
        <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center justify-center gap-3 font-black italic uppercase tracking-[0.2em] text-lg md:text-xl skew-x-[12deg]">
          Join Community 🏁
        </span>
      </button>

      </div>

      {/* --- TRACK KERB --- */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 md:h-2 flex opacity-70">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-[#FFD700]' : 'bg-white'}`} />
        ))}
      </div>

      <style >{`
        @keyframes drift {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 0.4; }
          100% { transform: translate(100px, -40px); opacity: 0; }
        }
        .animate-drift { animation: drift linear infinite; }
      `}</style>
    </header>
  );
};

export default Header;
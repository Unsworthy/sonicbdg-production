import React from 'react';
import { Instagram, Twitter, MessageCircle, Music } from 'lucide-react';

const sponsors = [
  { name: 'DANA', logo: '/Dana.png' },
  { name: 'Infinix', logo: '/Kingfinix.png' },
  { name: 'BiznetHome', logo: '/Biznet.png' },
  { name: 'TTRacing', logo: '/TTRacing.png' },
  { name: 'Mills', logo: '/Mills.png' },
];

const SponsorCarousel = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-black via-[#0A0A0A] to-black py-10 border-t border-[#FFD700]/20">
      {/* Title Area */}
      <div className="text-center mb-8 px-4">
        <h3 className="bebas text-[clamp(22px,5vw,36px)] text-[#FFD700] tracking-[0.2em] italic">
          OFFICIAL <span className="text-white">PARTNERS</span>
        </h3>
        <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
          <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
          <span className="font-mono text-[9px] text-white/40 tracking-[0.35em] uppercase">Supporting The Yellow Hedgehog</span>
          <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
        </div>
      </div>

      {/* Carousel Track */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-infinite hover:[animation-play-state:paused]">
          {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, idx) => (
            <div
              key={`${sponsor.name}-${idx}`}
              className="flex-shrink-0 w-[140px] mx-[10px] sm:w-[180px] sm:mx-[14px] lg:w-[220px] lg:mx-6 group"
            >
              <div className="relative h-[90px] sm:h-[110px] flex items-center justify-center bg-white/[0.04] border border-white/10 rounded-2xl transition-all duration-500 group-hover:bg-white/[0.07] group-hover:border-[#FFD700]/50 group-hover:shadow-[0_0_28px_rgba(255,215,0,0.18)] p-5 sm:p-6 overflow-hidden">
                
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 via-[#FFD700]/7 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="relative max-h-full max-w-full object-contain filter grayscale brightness-[2] opacity-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-[1.08]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />

                {/* Fallback Text */}
                <div className="hidden absolute inset-0 items-center justify-center">
                  <span className="bebas text-xl text-white/60 group-hover:text-[#FFD700] transition-colors uppercase tracking-widest">
                    {sponsor.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-infinite {
          animation: scroll-infinite 25s linear infinite;
        }
      `}} />
    </div>
  );
};

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/sonicregbandung', color: 'hover:text-pink-500' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/sonicregbandung', color: 'hover:text-blue-400' },
    { icon: MessageCircle, label: 'Discord', href: '#', color: 'hover:text-indigo-500' },
    { icon: Music, label: 'TikTok', href: '#', color: 'hover:text-white' },
  ];

  const quickLinks = ['Jadwal Pertandingan', 'Watch Party', 'Galeri', 'Bergabung'];

  return (
    <footer className="relative bg-gradient-to-b from-[#0A0A0A] to-black border-t-4 border-[#FFD700] mt-16 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjE1LDAsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
      </div>

      {/* Top Animated Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent animate-pulse" />

      <div className="relative">
        <SponsorCarousel />

        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            {/* 1. About Section */}
            <div className="text-center md:text-left">
              <h3 className="bebas text-4xl text-[#FFD700] mb-6 tracking-widest italic">
                SONIC <span className="text-white">BANDUNG</span>
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium max-w-xs mx-auto md:mx-0">
                Komunitas resmi fans ONIC Esports regional Bandung. Wadah berkumpulnya para Sonic untuk mendukung Landak Kuning dari Kota Kembang.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10 mx-auto md:mx-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">500+ Active Members</span>
              </div>
            </div>

            {/* 2. Quick Links */}
            <div className="text-center">
              <h4 className="bebas text-2xl text-[#FFD700] mb-6 tracking-widest">NAVIGATION</h4>
              <ul className="space-y-4">
                {quickLinks.map((item) => (
                  <li key={item}>
                    <a 
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="text-white/40 hover:text-[#FFD700] transition-all duration-300 text-sm font-bold uppercase tracking-widest hover:tracking-[0.2em]"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Socials Section */}
            <div className="text-center md:text-right">
              <h4 className="bebas text-2xl text-[#FFD700] mb-6 tracking-widest">CONNECT WITH US</h4>
              <div className="flex justify-center md:justify-end gap-4 mb-8">
                {socialLinks.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={`group relative w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:scale-110 ${color}`}
                  >
                    <Icon className="w-5 h-5 text-white/40 group-hover:text-current transition-colors z-10" />
                    <div className="absolute inset-0 bg-[#FFD700]/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
              <p className="text-white/30 text-[10px] font-mono leading-loose uppercase tracking-[0.2em]">
                Official Region <br />
                <span className="text-[#FFD700]">#SonicBandung #OnicEsports</span>
              </p>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} Sonic Bandung Community // Unit_022
            </p>
            <div className="bebas text-2xl text-[#FFD700] tracking-[0.2em] flex items-center gap-4">
              <span className="opacity-50">#RACINGTOVICTORY</span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              <span className="text-white opacity-80">GO ONIC!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-0 left-0 w-48 h-1 bg-gradient-to-r from-[#FFD700] to-transparent opacity-20" />
      <div className="absolute bottom-0 right-0 w-48 h-1 bg-gradient-to-l from-[#FFD700] to-transparent opacity-20" />
    </footer>
  );
};

export default Footer;
import { useState } from 'react'
import { Instagram, Twitter, MessageCircle, Film, ChevronDown, Globe, Users } from 'lucide-react'

const iconMap = {
  Instagram,
  Twitter,
  Discord: MessageCircle,
  TikTok: Film,
}

const SocialMedia = () => {
  const [activeMenu, setActiveMenu] = useState(null)

  const socialData = [
    { 
      label: 'Instagram', 
      links: [
        { name: 'ONIC OFFICIAL', url: 'https://instagram.com/onic.esports' },
        { name: 'SONIC REPUBLIC', url: 'https://instagram.com/sonic.republic' },
        { name: 'SONIC BANDUNG', url: 'https://instagram.com/sonicregbandung' }
      ]
    },
    { 
      label: 'TikTok', 
      links: [
        { name: 'ONIC OFFICIAL', url: 'https://tiktok.com/@onic.esports' },
        { name: 'SONIC BANDUNG', url: 'https://tiktok.com/@sonicregbandung' }
      ]
    },
    { 
      label: 'Discord', 
      links: [
        { name: 'OFFICIAL SERVER', url: 'https://discord.gg/y5gc6bq7K' }
      ]
    }
  ]

  return (
    <section id="social" className="relative py-24 bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        
        {/* Header ala Network Status */}
        <div className="inline-block mb-12">
          <p className="font-mono text-[10px] text-[#FFD700] tracking-[0.5em] uppercase mb-2 animate-pulse">
            Connection_Established // 100% Signal
          </p>
          <h2 className="bebas text-6xl md:text-8xl text-white italic tracking-tighter">
            SOCIAL <span className="text-[#FFD700]">NETWORK</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {socialData.map((item) => {
            const Icon = iconMap[item.label]
            const isOpen = activeMenu === item.label

            return (
              <div key={item.label} className="relative">
                {/* Main Button */}
                <button
                  onClick={() => setActiveMenu(isOpen ? null : item.label)}
                  className={`flex items-center gap-4 px-8 py-4 skew-x-[-15deg] transition-all duration-300 border-2 font-black uppercase tracking-wider text-sm
                    ${isOpen 
                      ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.4)]' 
                      : 'bg-transparent text-[#FFD700] border-[#FFD700]/30 hover:border-[#FFD700]'}`}
                >
                  <div className="skew-x-[15deg] flex items-center gap-3">
                    {Icon && <Icon className={`w-5 h-5 ${isOpen ? 'animate-bounce' : ''}`} />}
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu ala Tech UI */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-[#0A0A0A] border border-[#FFD700]/50 p-2 z-50 shadow-[0_15px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-[#0A0A0A] border-t border-l border-[#FFD700]/50 rotate-45" />
                    
                    {item.links.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3 hover:bg-[#FFD700] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {link.name.includes('OFFICIAL') ? <Globe className="w-3 h-3 group-hover:text-black" /> : <Users className="w-3 h-3 group-hover:text-black" />}
                          <span className="font-mono text-[11px] font-bold text-white group-hover:text-black tracking-tighter">
                            {link.name}
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-[#FFD700] group-hover:bg-black rounded-full" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Closing Decoration */}
        <div className="mt-20 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1 w-12 rounded-full ${i === 2 ? 'bg-[#FFD700]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <style >{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
    </section>
  )
}

export default SocialMedia
import React, { useState, useEffect, useRef } from 'react'
import { Trophy, Database, Clock, ChevronLeft, ChevronRight, Zap, Radio, Play } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// --- HELPER FUNCTIONS ---

// Mengambil ID video dari berbagai format URL YouTube
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Parsing tanggal dengan fallback WIB
const parseMatchDate = (dateStr) => {
  if (!dateStr) return null;
  if (!dateStr.includes('Z') && !dateStr.match(/[+-]\d{2}:\d{2}$/)) {
    return new Date(dateStr + '+07:00');
  }
  return new Date(dateStr);
};

// --- SUB-COMPONENTS ---

const TeamLogo = ({ src, name, size = 'md' }) => {
  const sz = size === 'lg' ? 'w-12 h-12 md:w-16 md:h-16' : 'w-8 h-8 md:w-10 md:h-10'
  return src ? (
    <img src={src} alt={name} className={`${sz} object-contain brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
      onError={e => { e.target.style.display = 'none' }} />
  ) : (
    <div className={`${sz} rounded-sm bg-neutral-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/30 italic`}>
      {name?.slice(0, 3).toUpperCase()}
    </div>
  )
}

const SkeletonCard = () => (
  <div className="shrink-0 w-[280px] md:w-[320px] h-[300px] bg-neutral-900/20 skew-x-[-3deg] border border-white/5 animate-pulse" />
)

const MatchCard = ({ match }) => {
  const isFinished = match.finished
  const isVictory = isFinished && match.onic_won
  const isDefeat = isFinished && match.onic_won === false

  return (
    <div className={`relative shrink-0 w-[280px] md:w-[320px] transition-all duration-300 ${isVictory ? 'hover:-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-neutral-900/80 skew-x-[-3deg] border-l-4 transition-all duration-500 ${
        isVictory ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
        isDefeat  ? 'border-red-500' :
        'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.1)]'
      }`} />

      <div className="relative p-5 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">{match.division || 'PRO'} // DIV</span>
            <span className="text-[9px] font-bold text-[#FFD700] italic uppercase">{match.tournament?.split(' ').slice(0,2).join(' ')}</span>
          </div>
          {isFinished ? (
            <div className={`px-2 py-1 skew-x-[-15deg] text-[9px] font-black italic border ${
              isVictory ? 'bg-green-500 border-green-400 text-black' :
              isDefeat ? 'bg-red-600 border-red-500 text-white' : 'bg-neutral-800 text-white/50'
            }`}>
              <span className="inline-block skew-x-[15deg]">{isVictory ? 'VICTORY' : 'FINISHED'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
              </span>
              <span className="text-[9px] font-mono text-[#FFD700] animate-pulse">UPCOMING</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 py-4 border-y border-white/5">
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo src={match.logo1} name={match.team1} size="lg" />
            <span className="text-[10px] font-black italic text-white tracking-widest uppercase text-center">{match.team1}</span>
          </div>
          <div className="flex flex-col items-center shrink-0 px-2">
            {isFinished ? (
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1 border border-white/10 italic">
                <span className={`text-2xl font-black ${match.score1 > match.score2 ? 'text-green-500' : 'text-white/40'}`}>{match.score1}</span>
                <span className="text-white/20 text-xs">-</span>
                <span className={`text-2xl font-black ${match.score2 > match.score1 ? 'text-green-500' : 'text-white/40'}`}>{match.score2}</span>
              </div>
            ) : (
              <div className="bebas text-3xl text-white/10 italic">VS</div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo src={match.logo2} name={match.team2} size="lg" />
            <span className="text-[10px] font-black italic text-white tracking-widest uppercase text-center">{match.team2}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40 font-mono text-[9px]">
            <Clock className="w-3 h-3 text-[#FFD700]" />
            {match.time}
          </div>
          {!isFinished && match.stream ? (
            <a href={match.stream} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1 bg-[#FFD700] text-black text-[9px] font-black italic skew-x-[-15deg] hover:bg-white transition-colors">
              <span className="inline-block skew-x-[15deg]">WATCH 🏁</span>
            </a>
          ) : (
            <span className="text-[9px] font-mono text-white/20">END_SESSION</span>
          )}
        </div>
      </div>
    </div>
  )
}

const OngoingCard = ({ match }) => {
  const [playVideo, setPlayVideo] = useState(false);
  const videoId = getYouTubeId(match.stream);

  return (
    <div className="relative shrink-0 w-[300px] md:w-[400px]">
      <div className="absolute inset-0 bg-neutral-900/90 skew-x-[-2deg] border-l-4 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.2)]" />
      
      <div className="relative p-5 z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-tighter">Live Broadcast</span>
          </div>
          <div className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black italic skew-x-[-10deg]">
            LIVE NOW
          </div>
        </div>

        {/* Video Player Section */}
        <div className="relative aspect-video mb-4 bg-black border border-white/5 overflow-hidden">
          {playVideo && videoId ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Match Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/api/placeholder/400/225'} 
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[1px]" 
                alt="Stream Preview"
              />
              <button 
                onClick={() => setPlayVideo(true)}
                className="group relative z-10 flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-current ml-1" />
                </div>
                <span className="text-[10px] font-black text-white italic tracking-[.2em]">WATCH STREAM</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Score Display */}
        <div className="flex items-center justify-between gap-4 py-3 border-t border-white/10 bg-black/20 px-2">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-black text-white/60 mb-1 truncate w-full text-center uppercase">{match.team1}</span>
            <span className="bebas text-5xl text-white leading-none">{match.score1 || 0}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bebas text-xl text-red-600 italic">VS</div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-black text-white/60 mb-1 truncate w-full text-center uppercase">{match.team2}</span>
            <span className="bebas text-5xl text-white leading-none">{match.score2 || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const HorizontalSlider = ({ items, renderItem }) => {
  const ref = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const checkScroll = () => {
    if (!ref.current) return
    setCanLeft(ref.current.scrollLeft > 0)
    setCanRight(ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth - 10)
  }

  useEffect(() => {
    const el = ref.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [items])

  const scroll = (dir) => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      {canLeft && (
        <button onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-2 bg-[#FFD700] text-black hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div ref={ref}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map((item, i) => (
          <div key={item.id || i}>{renderItem(item)}</div>
        ))}
      </div>

      {canRight && (
        <button onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-2 bg-[#FFD700] text-black hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

// --- MAIN COMPONENT ---

const MatchSchedule = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [now, setNow] = useState(new Date()) // ✅ satu-satunya 'now'

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 5000) // update tiap 5 detik
    return () => clearInterval(timer)
  }, [])

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date_obj', { ascending: true })
    if (!error) setMatches(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMatches()
    const channel = supabase
      .channel('realtime_matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        fetchMatches()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const MATCH_DURATION_MS = 4 * 60 * 60 * 1000 // ← pindah ke sini, di luar filter

  const results = matches.filter(m => m.finished)

  const ongoing = matches.filter(m => {
    if (m.finished || !m.date_obj) return false
    const matchTime = parseMatchDate(m.date_obj)
    if (!matchTime) return false
    return matchTime <= now && (now - matchTime) < MATCH_DURATION_MS // ✅ pakai state
  })

  const upcoming = matches.filter(m => {
    if (m.finished || !m.date_obj) return false
    const matchTime = parseMatchDate(m.date_obj)
    if (!matchTime) return false
    return matchTime > now // ✅ pakai state
  })

  const activeMatches = activeTab === 'upcoming' ? upcoming : results

  return (
    <section id="jadwal" className="relative py-24 bg-[#050505] overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(#FFD700_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#FFD700]" />
              <span className="text-[10px] font-mono text-[#FFD700] tracking-[0.4em] uppercase">Match Calendar // 2026</span>
            </div>
            <h2 className="bebas text-6xl md:text-8xl text-white italic leading-none">
              MATCH <span className="text-[#FFD700]">SCHEDULE</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 border border-white/10 bg-black/40 skew-x-[-10deg]">
            <Database className="w-3 h-3 text-[#FFD700] skew-x-[10deg]" />
            <span className="text-[10px] font-black italic text-white skew-x-[10deg] tracking-widest uppercase">Connected</span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex mb-10">
          <div className="flex bg-white/5 border border-white/10 p-1 gap-1">
            {['upcoming', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-mono text-xs uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-[#FFD700] text-black font-black' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab} {tab === 'upcoming' ? (upcoming.length > 0 && `(${upcoming.length})`) : (results.length > 0 && `(${results.length})`)}
              </button>
            ))}
          </div>
        </div>

        {/* ONGOING SECTION */}
        {!loading && ongoing.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="bebas text-3xl md:text-4xl text-white italic">
                ONGOING <span className="text-red-500">MATCHES</span>
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
            </div>
            <HorizontalSlider
              items={ongoing}
              renderItem={(match) => <OngoingCard match={match} />}
            />
          </div>
        )}

        {/* MAIN LIST SECTION */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : activeMatches.length === 0 ? (
          <div className="border border-white/5 bg-neutral-900/20 p-20 text-center skew-x-[-3deg]">
            <div className="skew-x-[3deg]">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-white/10" />
              <p className="bebas text-2xl text-white/20 italic tracking-widest">
                {activeTab === 'upcoming' ? 'NO UPCOMING SESSIONS' : 'NO RESULTS FOUND'}
              </p>
            </div>
          </div>
        ) : (
          <HorizontalSlider
            items={activeMatches}
            renderItem={(match) => <MatchCard match={match} />}
          />
        )}
      </div>

      <style>{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

export default MatchSchedule;
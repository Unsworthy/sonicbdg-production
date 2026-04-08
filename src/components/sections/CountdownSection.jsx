import React, { useState, useEffect } from 'react'
import { useCountdown } from '../../hooks/useCountdown'
import { Timer, Radio, AlertTriangle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const CountdownBox = ({ label, value }) => (
  <div className="relative flex flex-col items-center group flex-1 min-w-[70px] md:min-w-[100px]">
    <div className="absolute inset-0 bg-black/60 border-l-2 border-[#FFD700] skew-x-[-10deg] backdrop-blur-sm" />
    <div className="relative px-2 py-3 md:px-5 md:py-3 flex flex-col items-center z-10">
      <span className="text-3xl md:text-6xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] bebas">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[8px] md:text-[10px] font-mono font-bold text-[#FFD700] tracking-[0.2em] md:tracking-[0.3em] uppercase mt-1">
        {label}
      </span>
    </div>
  </div>
)

const CountdownSection = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const now = new Date()

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase
        .from('matches')
        .select('*')
        .order('date_obj', { ascending: true })
      if (data) setMatches(data)
      setLoading(false)
    }
    fetchMatches()
  }, [])

  const upcoming = matches.filter(m => !m.finished && m.date_obj && new Date(m.date_obj) > now)
  const nextMatch = upcoming[0] ?? matches.filter(m => !m.finished)[0] ?? null
  const countdown = useCountdown(nextMatch?.date_obj ? new Date(nextMatch.date_obj) : null)

  const isRoyalDerby = nextMatch && (
    (nextMatch.team1?.toLowerCase().includes('onic') && nextMatch.team2?.toLowerCase().includes('rrq')) ||
    (nextMatch.team1?.toLowerCase().includes('rrq') && nextMatch.team2?.toLowerCase().includes('onic'))
  )

  const items = [
    { label: 'Days', value: countdown?.days ?? 0 },
    { label: 'Hours', value: countdown?.hours ?? 0 },
    { label: 'Mins', value: countdown?.minutes ?? 0 },
    { label: 'Secs', value: countdown?.seconds ?? 0 },
  ]

  if (loading) {
    return (
      <section className="py-24 bg-[#050505] text-center border-y border-white/5">
        <span className="bebas text-2xl text-white/20 italic tracking-[0.5em] animate-pulse">INITIALIZING...</span>
      </section>
    )
  }

  if (!nextMatch) {
    return (
      <section className="py-24 bg-[#050505] text-center border-y border-white/5">
        <span className="bebas text-2xl text-white/20 italic tracking-[0.5em]">NO UPCOMING MATCH</span>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden border-y border-white/5 min-h-[700px] md:min-h-[600px] flex items-center">
      {/* Background foto */}
      <div className="absolute inset-0">
        <img
          src="/onicbg.jpeg"
          alt="background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/95 via-black/80 to-black/95" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 z-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-white/10 pb-4 text-[9px] md:text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2 md:gap-3">
            <Radio className="w-3 h-3 md:w-4 md:h-4 text-red-600 animate-pulse" />
            <span>Race Control // <span className="text-white">Live Monitoring</span></span>
          </div>
          
          {/* Tournament Name + Logo */}
          <div className="flex items-center italic truncate max-w-[200px] md:max-w-none justify-end">
            <img 
              src="/mpl.png" 
              alt="MPL Logo" 
              className="h-3 md:h-4 w-auto mr-2 object-contain"
            />
            <span className="truncate">{nextMatch.tournament}</span>
          </div>
        </div>

        {/* Royal Derby Banner */}
        {isRoyalDerby && (
          <div className="flex justify-center mb-8 animate-pulse">
            <div className="relative px-6 py-2 md:px-12 md:py-3 skew-x-[-15deg] bg-red-600 border-2 border-[#FFD700] shadow-[0_0_30px_rgba(220,20,60,0.4)]">
              <div className="flex items-center gap-2 md:gap-4 skew-x-[15deg]">
                <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-[#FFD700]" />
                <span className="bebas text-xl md:text-3xl text-white tracking-[0.1em] md:tracking-[0.2em]">ROYAL DERBY</span>
              </div>
            </div>
          </div>
        )}

        {/* VS Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 mb-12">
          {/* Team 1 */}
          <div className="flex flex-row md:flex-col items-center gap-4 flex-1 w-full md:w-auto justify-end md:justify-center">
            <span className="bebas text-3xl md:text-6xl text-white italic tracking-widest drop-shadow-lg text-right md:text-center order-1 md:order-2">
              {nextMatch.team1}
            </span>
            <div className="order-2 md:order-1">
              {nextMatch.logo1 ? (
                <img src={nextMatch.logo1} alt={nextMatch.team1}
                  className="w-16 h-16 md:w-36 md:h-36 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
              ) : (
                <div className="w-16 h-16 md:w-36 md:h-36 bg-white/10 border border-white/20 flex items-center justify-center bebas text-xl md:text-3xl text-white/30 italic">
                  {nextMatch.team1?.slice(0,3)}
                </div>
              )}
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center">
            <div className="bg-black/60 backdrop-blur-sm px-6 py-1 md:px-8 md:py-3 border border-white/10 skew-x-[-15deg]">
              <span className="bebas text-5xl md:text-9xl text-[#FFD700] italic skew-x-[15deg] drop-shadow-[0_0_25px_rgba(255,215,0,0.5)]">VS</span>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex flex-row md:flex-col items-center gap-4 flex-1 w-full md:w-auto justify-start md:justify-center">
            <div className="">
              {nextMatch.logo2 ? (
                <img src={nextMatch.logo2} alt={nextMatch.team2}
                  className="w-16 h-16 md:w-36 md:h-36 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]" />
              ) : (
                <div className="w-16 h-16 md:w-36 md:h-36 bg-white/10 border border-white/20 flex items-center justify-center bebas text-xl md:text-3xl text-white/30 italic">
                  {nextMatch.team2?.slice(0,3)}
                </div>
              )}
            </div>
            <span className="bebas text-3xl md:text-6xl text-white italic tracking-widest drop-shadow-lg text-left md:text-center">
              {nextMatch.team2}
            </span>
          </div>
        </div>

        {/* Countdown + Time */}
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <div className="flex flex-row justify-center gap-2 md:gap-6 w-full max-w-md md:max-w-none">
            {items.map(item => <CountdownBox key={item.label} {...item} />)}
          </div>

          <div className="w-full max-w-md md:w-auto bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-4 md:px-8 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#FFD700]" />
                <div>
                  <p className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest">Grid Start Time</p>
                  <p className="text-base md:text-lg font-black text-white italic">{nextMatch.time}</p>
                </div>
            </div>
            
            {nextMatch.stream && (
              <a href={nextMatch.stream} target="_blank" rel="noopener noreferrer"
                className="w-full md:w-auto text-center px-6 py-3 bg-[#FFD700] text-black font-black text-xs md:text-sm italic uppercase tracking-widest hover:bg-white transition-all md:skew-x-[-10deg]">
                <span className="inline-block md:skew-x-[10deg]">Join The Chat 🏁</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{` .bebas { font-family: 'Bebas Neue', sans-serif; } `}</style>
    </section>
  )
}

export default CountdownSection
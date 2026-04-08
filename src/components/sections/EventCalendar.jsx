import { useState, useEffect } from 'react'
import { Calendar, Flag, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const EventItem = ({ event }) => (
  <div className="group flex gap-6 items-start relative pb-10 last:pb-0">
    <div className="absolute left-[45px] top-20 bottom-0 w-px bg-gradient-to-b from-[#FFD700] via-white/10 to-transparent z-0 group-last:hidden" />
    
    <div className="relative shrink-0 z-10">
      <div className="bg-[#FFD700] text-black skew-x-[-15deg] w-[90px] py-3 text-center transition-transform group-hover:scale-110 duration-300 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
        <div className="skew-x-[15deg]">
          <span className="bebas text-4xl block leading-none">{event.day}</span>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest">{event.month}</span>
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FFD700] rounded-full animate-pulse" />
    </div>

    <div className="flex-1 bg-white/5 border border-white/5 p-6 skew-x-[-5deg] transition-all group-hover:bg-white/10 group-hover:border-[#FFD700]/30">
      <div className="skew-x-[5deg]">
        <div className="flex items-center gap-2 mb-2">
          <Flag className="w-3 h-3 text-[#FFD700]" />
          <span className="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">Session_Verified // Ready</span>
        </div>
        <h4 className="bebas text-2xl md:text-3xl text-white italic tracking-wider group-hover:text-[#FFD700] transition-colors">
          {event.title}
        </h4>
        <p className="text-white/60 text-sm font-medium leading-relaxed mt-2 max-w-2xl">
          {event.description}
        </p>
        <div className="absolute top-0 right-0 p-2 opacity-20">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  </div>
)

const EventCalendar = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      if (!error) setEvents(data)
      setLoading(false)
    }
    fetchEvents()
  }, [])

  return (
    <section id="kegiatan" className="relative py-24 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">
        
        <div className="flex items-center gap-6 mb-16">
          <div className="relative">
            <Calendar className="w-12 h-12 text-[#FFD700] relative z-10" />
            <div className="absolute inset-0 bg-[#FFD700]/20 blur-xl rounded-full" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#FFD700] tracking-[0.5em] uppercase mb-1">Time_Table // Season_2026</p>
            <h2 className="bebas text-5xl md:text-7xl text-white italic tracking-tighter">
              KALENDER <span className="text-[#FFD700]">KEGIATAN</span>
            </h2>
          </div>
        </div>

        <div className="space-y-2">
          {loading && (
            <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest text-center py-10">
              Loading_Schedule...
            </div>
          )}
          {!loading && events.length === 0 && (
            <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest text-center py-10">
              No_Events_Found // Tambah via Admin Panel
            </div>
          )}
          {!loading && events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="px-6 py-2 border border-white/10 bg-white/5 rounded-full">
            <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
              End of Schedule // <span className="text-[#FFD700]">All Systems Nominal</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
    </section>
  )
}

export default EventCalendar
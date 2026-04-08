import { useState, useEffect } from 'react'
import { MapPin, Calendar, Clock, ExternalLink, Radio } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const WatchPartyCard = ({ wp }) => {
  const formattedDate = new Date(wp.date).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Fungsi otomatis membuat link Google Maps berdasarkan nama lokasi
  const handleLocationClick = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wp.location)}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="group relative bg-[#0A0A0A] border border-white/10 overflow-hidden transition-all duration-300">
      {/* Accent Line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD700] z-20 group-hover:w-2 transition-all" />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto overflow-hidden bg-neutral-900">
          <img 
            // Ambil dari image_url Supabase, fallback ke /wp.jpeg jika kosong
            src={wp.image_url || "/wp.jpeg"} 
            alt={wp.title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent opacity-60 md:opacity-100" />
          <div className="absolute top-4 left-4 bg-[#FFD700] text-black text-[10px] font-mono font-black px-3 py-1 skew-x-[-15deg]">
            <span className="inline-block skew-x-[15deg]">SONIC_EVENT</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:w-3/5 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-3 h-3 text-red-600 animate-pulse" />
              <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">Status // Ready_To_Gather</span>
            </div>
            
            <h3 className="bebas text-3xl md:text-4xl text-white italic tracking-wider mb-4 group-hover:text-[#FFD700] transition-colors">
              {wp.title}
            </h3>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-white/60 font-mono text-[11px] uppercase tracking-tighter">
                <MapPin className="w-4 h-4 text-[#FFD700]" />
                <span className="truncate">Loc: {wp.location}</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 font-mono text-[11px] uppercase tracking-tighter">
                <Calendar className="w-4 h-4 text-[#FFD700]" />
                <span>Date: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 font-mono text-[11px] uppercase tracking-tighter">
                <Clock className="w-4 h-4 text-[#FFD700]" />
                <span>Open Gate: {wp.time} WIB</span>
              </div>
            </div>
          </div>

          {/* Action Button: Navigate */}
          <button 
            onClick={handleLocationClick}
            className="relative group/btn w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 skew-x-[-15deg] group-hover/btn:bg-[#FFD700] transition-all duration-300" />
            <div className="relative py-3 border border-white/10 skew-x-[-15deg] group-hover/btn:border-[#FFD700] flex items-center justify-center gap-3">
              <span className="bebas text-xl text-white group-hover/btn:text-black italic skew-x-[15deg]">NAVIGATE TO GRID</span>
              <ExternalLink className="w-4 h-4 text-[#FFD700] group-hover/btn:text-black skew-x-[15deg]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

const WatchParty = () => {
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParties = async () => {
      const { data, error } = await supabase
        .from('watch_parties')
        .select('*')
        .order('date', { ascending: true })
      
      if (!error) setParties(data)
      setLoading(false)
    }
    fetchParties()
  }, [])

  return (
    <section id="watch-party" className="relative py-24 bg-[#050505] overflow-hidden border-b border-white/5">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-l-4 border-[#FFD700] pl-6">
          <div>
            <p className="font-mono text-[10px] text-[#FFD700] tracking-[0.5em] uppercase mb-2">Location // Intelligence</p>
            <h2 className="bebas text-6xl md:text-8xl text-white italic tracking-tighter leading-none">
              WATCH <span className="text-[#FFD700]">PARTY</span>
            </h2>
          </div>
          <div className="hidden md:block font-mono text-[10px] text-white/20 text-right">
            <p>TOTAL_EVENTS: 0{parties.length}</p>
            <p>REGION: BANDUNG_ID</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && parties.length === 0 && (
          <div className="text-center py-20 font-mono text-[10px] text-white/20 uppercase tracking-widest">
            No_Events_Scheduled // Cek Admin Panel untuk Update
          </div>
        )}

        {/* Data List */}
        {!loading && parties.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {parties.map((wp) => (
              <WatchPartyCard key={wp.id} wp={wp} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
    </section>
  )
}

export default WatchParty
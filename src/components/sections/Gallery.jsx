import { useState, useEffect } from 'react'
import { Camera, Scan, X, Download, ChevronLeft, ChevronRight, Folder } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const Gallery = () => {
  const [photos, setPhotos] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeAlbum, setActiveAlbum] = useState('all') // State untuk filter album
  const [selected, setSelected] = useState(null) // index foto yang dibuka di lightbox

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // 1. Fetch Daftar Album untuk tombol filter
      const { data: albumData } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (albumData) setAlbums(albumData)

      // 2. Fetch Foto (dengan filter jika activeAlbum bukan 'all')
      let query = supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (activeAlbum !== 'all') {
        query = query.eq('album_id', activeAlbum)
      }

      const { data: photoData, error } = await query
      if (!error) setPhotos(photoData)
      
      setLoading(false)
    }

    fetchData()
  }, [activeAlbum]) // Akan reload setiap kali filter album diklik

  const openPhoto = (idx) => setSelected(idx)
  const closePhoto = () => setSelected(null)
  const prevPhoto = () => setSelected(i => (i - 1 + photos.length) % photos.length)
  const nextPhoto = () => setSelected(i => (i + 1) % photos.length)

  // Keyboard navigation untuk Lightbox
  useEffect(() => {
    if (selected === null) return
    const handleKey = (e) => {
      if (e.key === 'Escape') closePhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, photos])

  const handleDownload = async (photo) => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = photo.caption || 'sonic-bandung-photo.jpg'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  return (
    <section id="galeri" className="relative py-24 bg-[#050505] border-b border-white/5 overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-y-0 left-1/4 w-px bg-white/5" />
      <div className="absolute inset-y-0 left-2/4 w-px bg-white/5" />
      <div className="absolute inset-y-0 left-3/4 w-px bg-white/5" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#FFD700] text-black skew-x-[-15deg]">
              <Camera className="w-8 h-8 skew-x-[15deg]" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#FFD700] tracking-[0.4em] uppercase">Visual_Archive // Log</p>
              <h2 className="bebas text-5xl md:text-7xl text-white italic tracking-tighter">
                GALERI <span className="text-[#FFD700]">KEGIATAN</span>
              </h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 font-mono text-[10px] text-white/30 uppercase border-r border-white/10 pr-6">
            <Scan className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Encrypted_Files: {photos.length} Units</span>
          </div>
        </div>

        {/* ALBUM FILTER SYSTEM */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 px-3 border-r border-white/10 mr-2 shrink-0">
            <Folder className="w-4 h-4 text-[#FFD700]" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Filter_By:</span>
          </div>
          
          <button 
            onClick={() => setActiveAlbum('all')}
            className={`px-6 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all shrink-0
              ${activeAlbum === 'all' ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'border-white/10 text-white/40 hover:border-white/30'}`}
          >
            ALL_PHOTOS
          </button>

          {albums.map((album) => (
            <button 
              key={album.id}
              onClick={() => setActiveAlbum(album.id)}
              className={`px-6 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all shrink-0 whitespace-nowrap
                ${activeAlbum === album.id ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'border-white/10 text-white/40 hover:border-white/30'}`}
            >
              {album.name}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-20 font-mono text-white/20 uppercase tracking-widest text-xs border border-dashed border-white/5 bg-white/[0.01]">
            No_Assets_Found_In_This_Folder // Upload via Admin Panel
          </div>
        )}

        {/* Photo Grid */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => openPhoto(idx)}
                className="group relative aspect-square overflow-hidden cursor-pointer"
              >
                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFD700] z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FFD700] z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />

                <div className="w-full h-full bg-[#0A0A0A] border border-white/5 group-hover:border-[#FFD700]/30 transition-all duration-500 overflow-hidden relative">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="font-mono text-[10px] text-[#FFD700] uppercase tracking-widest border border-[#FFD700]/50 px-3 py-1">
                      VIEW FULL
                    </span>
                  </div>
                  {/* CRT Scanline Effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closePhoto}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Info */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <p className="font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">
                  {photos[selected]?.caption || `IMG_ARCHIVE_${photos[selected]?.id.slice(0,5)}`}
                </p>
                <p className="font-mono text-[9px] text-white/30 uppercase">
                  Index: {selected + 1} / {photos.length}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(photos[selected])}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black font-mono text-[10px] uppercase tracking-widest hover:bg-white transition-all font-black"
                >
                  <Download className="w-3 h-3" />
                  Save_Asset
                </button>
                <button
                  onClick={closePhoto}
                  className="p-2 border border-white/20 text-white/50 hover:text-white hover:border-[#FFD700] transition-all bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image View */}
            <div className="relative border border-white/10 group bg-black">
              <img
                src={photos[selected]?.url}
                alt={photos[selected]?.caption}
                className="w-full max-h-[70vh] object-contain mx-auto"
              />

              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-white/10 text-white hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-white/10 text-white hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip (Bottom) */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto py-2 no-scrollbar justify-center">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelected(idx)}
                    className={`shrink-0 w-16 h-16 overflow-hidden border-2 transition-all
                      ${idx === selected ? 'border-[#FFD700] scale-110' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

export default Gallery
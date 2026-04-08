import { useState, useEffect } from 'react'
import {
  Settings, Tv, Calendar, Image as ImageIcon,
  PlusCircle, Upload, Clock, MapPin,
  Activity, ShieldAlert, LogOut, Trash2, CheckCircle, Trophy,
  Folder, Eye, X, RefreshCw
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import AdminLogin from './AdminLogin'

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-3 mb-6 border-l-4 border-[#FFD700] pl-4">
    <Icon className="w-6 h-6 text-[#FFD700]" />
    <h3 className="bebas text-3xl text-white tracking-wider italic">{children}</h3>
  </div>
)

const Toast = ({ message, type = 'success' }) => {
  if (!message) return null
  return (
    <div className={`mb-6 p-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest
      ${type === 'success' ? 'bg-green-900/20 border border-green-600/30 text-green-400' : 'bg-red-900/20 border border-red-600/30 text-red-400'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
      {message}
    </div>
  )
}

// ─────────────────────────────────────────
// Match Form
// ─────────────────────────────────────────
const MatchForm = ({ showToast }) => {
  const [matches, setMatches] = useState([])
  const [availableLogos, setAvailableLogos] = useState([])
  const [form, setForm] = useState({
    team1: '', team2: '', tournament: '', division: 'PRO',
    time: '', date_obj: '', stream: '', logo1: '', logo2: '',
    finished: false, score1: 0, score2: 0, onic_won: false,
  })
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchMatches()
    fetchLogos()
  }, [])

  const fetchMatches = async () => {
    const { data } = await supabase.from('matches').select('*').order('date_obj', { ascending: true })
    if (data) setMatches(data)
  }

  const fetchLogos = async () => {
    const { data, error } = await supabase.storage.from('gallery').list('logos', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' }
    })

    if (error) {
      console.error('Error fetching logos:', error)
      return
    }

    if (data) {
      const logos = data
        .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '.keep')
        .map(file => ({
          name: file.name,
          url: supabase.storage.from('gallery').getPublicUrl(`logos/${file.name}`).data.publicUrl
        }))
      setAvailableLogos(logos)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Konversi datetime-local ke ISO string dengan timezone WIB (+07:00)
      // Input datetime-local = "2026-04-10T15:15" (tanpa timezone)
      // Kita asumsikan admin input dalam WIB, jadi tambah +07:00
      let dateObjISO = form.date_obj
      if (form.date_obj && !form.date_obj.includes('+') && !form.date_obj.endsWith('Z')) {
        dateObjISO = form.date_obj + ':00+07:00'
      }
      const payload = {
        ...form,
        date_obj: dateObjISO,
        score1: parseInt(form.score1),
        score2: parseInt(form.score2),
      }
      if (editId) {
        const { error } = await supabase.from('matches').update(payload).eq('id', editId)
        if (error) throw error
        showToast('Match berhasil diupdate!')
        setEditId(null)
      } else {
        const { error } = await supabase.from('matches').insert([payload])
        if (error) throw error
        showToast('Match berhasil ditambahkan!')
      }
      resetForm()
      fetchMatches()
    } catch (err) {
      showToast('Gagal: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (match) => {
    setEditId(match.id)
    setForm({
      team1: match.team1, team2: match.team2,
      tournament: match.tournament, division: match.division || 'PRO',
      time: match.time, date_obj: match.date_obj ? match.date_obj.slice(0, 16) : '',
      stream: match.stream || '', logo1: match.logo1 || '', logo2: match.logo2 || '',
      finished: match.finished, score1: match.score1, score2: match.score2,
      onic_won: match.onic_won || false,
    })
    window.scrollTo({ top: document.getElementById('admin').offsetTop, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus match ini?')) return
    await supabase.from('matches').delete().eq('id', id)
    showToast('Match dihapus!')
    fetchMatches()
  }

  const resetForm = () => {
    setEditId(null)
    setForm({
      team1: '', team2: '', tournament: '', division: 'PRO',
      time: '', date_obj: '', stream: '', logo1: '', logo2: '',
      finished: false, score1: 0, score2: 0, onic_won: false,
    })
  }

  const LogoSelector = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">{label}</label>

      {availableLogos.length === 0 ? (
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest py-3">
          ⚠ Belum ada logo di folder logos/
        </p>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2">
            {availableLogos.map(logo => (
              <button
                key={logo.name}
                type="button"
                onClick={() => onChange(value === logo.url ? '' : logo.url)}
                className={`p-2 border transition-all bg-white/5 hover:border-[#FFD700]/60
                  ${value === logo.url ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10'}`}
                title={logo.name}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="w-full h-10 object-contain"
                  onError={e => { e.target.style.opacity = '0.2' }}
                />
              </button>
            ))}
          </div>

          {value && (
            <div className="flex items-center gap-3 mt-1 p-2 border border-[#FFD700]/20 bg-[#FFD700]/5">
              <img src={value} alt="selected" className="w-8 h-8 object-contain" />
              <p className="font-mono text-[9px] text-[#FFD700] uppercase tracking-widest">Logo dipilih ✓</p>
              <button
                type="button"
                onClick={() => onChange('')}
                className="ml-auto font-mono text-[9px] text-white/30 hover:text-red-400 uppercase"
              >
                ✕ clear
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Team 1 (ONIC)_</label>
            <input type="text" value={form.team1} onChange={e => setForm(p => ({...p, team1: e.target.value}))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold" required />
          </div>
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Team 2 (Lawan)_</label>
            <input type="text" value={form.team2} onChange={e => setForm(p => ({...p, team2: e.target.value}))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LogoSelector label="Logo Team 1_" value={form.logo1} onChange={val => setForm(p => ({...p, logo1: val}))} />
          <LogoSelector label="Logo Team 2_" value={form.logo2} onChange={val => setForm(p => ({...p, logo2: val}))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Tournament_</label>
            <input type="text" value={form.tournament} onChange={e => setForm(p => ({...p, tournament: e.target.value}))}
              placeholder="MPL ID S17 - Week 1"
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold" required />
          </div>
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Division_</label>
            <input type="text" value={form.division} onChange={e => setForm(p => ({...p, division: e.target.value}))}
              placeholder="PRO"
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Tanggal & Jam_ <span className="text-white/30">(WIB / GMT+7)</span></label>
            <input type="datetime-local" value={form.date_obj} onChange={e => setForm(p => ({...p, date_obj: e.target.value}))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold appearance-none" required />
          </div>
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Tampil Waktu_</label>
            <input type="text" value={form.time} onChange={e => setForm(p => ({...p, time: e.target.value}))}
              placeholder="28 Maret 17:00 WIB"
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Stream URL_ (opsional)</label>
          <input type="url" value={form.stream} onChange={e => setForm(p => ({...p, stream: e.target.value}))}
            placeholder="https://youtube.com/..."
            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold" />
        </div>

        <div className="bg-white/5 border border-white/10 p-6 space-y-4">
          <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Match Result_ (isi kalau sudah selesai)</label>
          <div className="flex items-center gap-4">
            <input type="checkbox" id="finished" checked={form.finished}
              onChange={e => setForm(p => ({...p, finished: e.target.checked}))}
              className="w-4 h-4 accent-[#FFD700]" />
            <label htmlFor="finished" className="font-mono text-xs text-white uppercase tracking-widest">Match Sudah Selesai</label>
          </div>
          {form.finished && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest">Skor {form.team1 || 'Team 1'}_</label>
                <input type="number" min="0" value={form.score1} onChange={e => setForm(p => ({...p, score1: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold text-center text-2xl" />
              </div>
              <div className="flex items-end justify-center pb-3">
                <span className="bebas text-4xl text-white/20 italic">VS</span>
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest">Skor {form.team2 || 'Team 2'}_</label>
                <input type="number" min="0" value={form.score2} onChange={e => setForm(p => ({...p, score2: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none font-bold text-center text-2xl" />
              </div>
              <div className="md:col-span-3 flex items-center gap-4">
                <input type="checkbox" id="onic_won" checked={form.onic_won}
                  onChange={e => setForm(p => ({...p, onic_won: e.target.checked}))}
                  className="w-4 h-4 accent-green-500" />
                <label htmlFor="onic_won" className="font-mono text-xs text-green-400 uppercase tracking-widest">ONIC Menang ✓</label>
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#FFD700] text-black py-5 font-black uppercase hover:bg-white transition-all active:scale-95 disabled:opacity-50">
          <Trophy className="w-5 h-5" />
          <span className="bebas text-2xl italic tracking-widest">
            {loading ? 'MENYIMPAN...' : editId ? 'UPDATE MATCH' : 'TAMBAH MATCH'}
          </span>
        </button>

        {editId && (
          <button type="button" onClick={resetForm}
            className="w-full py-3 border border-white/10 text-white/30 font-mono text-xs uppercase tracking-widest hover:text-white transition-all">
            Cancel Edit
          </button>
        )}
      </form>

      {matches.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">Existing Matches ({matches.length})</p>
          <div className="space-y-2">
            {matches.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-white/5 border border-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  {m.logo1 && <img src={m.logo1} alt={m.team1} className="w-8 h-8 object-contain" />}
                  <div>
                    <p className="font-bold text-white text-sm">{m.team1} vs {m.team2}</p>
                    <p className="font-mono text-[9px] text-white/30 uppercase">{m.tournament} — {m.time}</p>
                    {m.finished && <p className="font-mono text-[9px] text-green-400">{m.score1} - {m.score2} {m.onic_won ? '✓ ONIC WIN' : ''}</p>}
                  </div>
                  {m.logo2 && <img src={m.logo2} alt={m.team2} className="w-8 h-8 object-contain" />}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(m)}
                    className="px-3 py-1 border border-[#FFD700]/30 text-[#FFD700] font-mono text-[10px] hover:bg-[#FFD700]/10 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(m.id)}
                    className="px-3 py-1 border border-red-600/30 text-red-500 font-mono text-[10px] hover:bg-red-600/10 transition-all">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// Gallery Manager (NEW)
// ─────────────────────────────────────────
const GalleryManager = ({ albums, showToast, onAlbumCreated }) => {
  const [activeAlbum, setActiveAlbum] = useState('all')
  const [photos, setPhotos] = useState([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  // Upload state
  const [photoFile, setPhotoFile] = useState(null)
  const [photoCaption, setPhotoCaption] = useState('')
  const [selectedAlbumId, setSelectedAlbumId] = useState('')
  const [photoFolder, setPhotoFolder] = useState('gallery')
  const [uploading, setUploading] = useState(false)
  // Album create state
  const [newAlbumName, setNewAlbumName] = useState('')
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false)

  useEffect(() => {
    fetchPhotos()
  }, [activeAlbum])

  const fetchPhotos = async () => {
    setLoadingPhotos(true)
    let query = supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (activeAlbum !== 'all') query = query.eq('album_id', activeAlbum)
    const { data, error } = await query
    if (!error && data) setPhotos(data)
    setLoadingPhotos(false)
  }

  const handleDeletePhoto = async (photo) => {
    if (!confirm(`Hapus foto "${photo.caption || photo.id}"?`)) return
    setDeletingId(photo.id)
    try {
      // Delete from storage jika ada file_path
      if (photo.file_path) {
        await supabase.storage.from('gallery').remove([photo.file_path])
      }
      // Delete from DB
      const { error } = await supabase.from('gallery').delete().eq('id', photo.id)
      if (error) throw error
      showToast('Foto berhasil dihapus!')
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
    } catch (err) {
      showToast('Gagal hapus: ' + err.message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteAlbum = async (album) => {
    if (!confirm(`Hapus album "${album.name}"? Foto di album ini TIDAK ikut terhapus (akan jadi unassigned).`)) return
    const { error } = await supabase.from('albums').delete().eq('id', album.id)
    if (error) { showToast('Gagal hapus album: ' + error.message, 'error'); return }
    showToast(`Album "${album.name}" dihapus!`)
    onAlbumCreated() // trigger refresh albums di parent
    if (activeAlbum === album.id) setActiveAlbum('all')
  }

  const handleCreateAlbum = async (e) => {
    e.preventDefault()
    if (!newAlbumName.trim()) return
    setIsCreatingAlbum(true)
    const { error } = await supabase.from('albums').insert([{ name: newAlbumName.trim() }])
    if (!error) {
      showToast('Album baru berhasil dibuat!')
      setNewAlbumName('')
      onAlbumCreated()
    } else {
      showToast('Gagal buat album: ' + error.message, 'error')
    }
    setIsCreatingAlbum(false)
  }

  const handlePhotoUpload = async (e) => {
    e.preventDefault()
    if (!photoFile) return
    setUploading(true)
    try {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const filePath = `${photoFolder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, photoFile, { upsert: false })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath)

      if (photoFolder === 'gallery') {
        const { error: dbError } = await supabase.from('gallery').insert([{
          url: publicUrl,
          caption: photoCaption || photoFile.name,
          file_path: filePath,
          // ✅ FIX: simpan album_id jika dipilih
          album_id: selectedAlbumId || null,
        }])
        if (dbError) throw dbError
      }

      showToast(`File berhasil diupload${selectedAlbumId ? ' ke album!' : '!'}`)
      setPhotoFile(null)
      setPhotoCaption('')
      fetchPhotos()
    } catch (err) {
      showToast('Gagal upload: ' + err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const albumName = (id) => {
    if (id === 'all') return 'ALL PHOTOS'
    return albums.find(a => a.id === id)?.name || 'Unknown'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ── Kolom Kiri: Album Management ── */}
      <div className="lg:col-span-1 space-y-6">

        {/* Create Album */}
        <div className="bg-white/[0.02] p-6 border border-white/5">
          <SectionTitle icon={PlusCircle}>MANAGE_FOLDERS</SectionTitle>
          <form onSubmit={handleCreateAlbum} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">New_Album_Name</label>
              <input
                type="text"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="CONTOH: NOBAR MPL S13"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-all text-sm font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={isCreatingAlbum || !newAlbumName}
              className="w-full py-3 bg-white/10 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-all disabled:opacity-50"
            >
              {isCreatingAlbum ? 'CREATING...' : 'CREATE_NEW_FOLDER'}
            </button>
          </form>

          {/* Album List */}
          <div className="pt-6 border-t border-white/5 mt-6">
            <p className="font-mono text-[9px] text-white/20 uppercase mb-3 text-center tracking-widest">
              Active_Folders ({albums.length})
            </p>
            <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {albums.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 group">
                  <div>
                    <p className="font-mono text-[10px] text-white/60 uppercase">{a.name}</p>
                    <p className="font-mono text-[9px] text-white/20">ID: {a.id.slice(0, 8)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAlbum(a)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                    title="Hapus Album"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {albums.length === 0 && (
                <p className="font-mono text-[9px] text-white/20 text-center py-4 uppercase">Belum ada album</p>
              )}
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white/[0.02] p-6 border border-white/5">
          <SectionTitle icon={ImageIcon}>ASSET_UPLOAD</SectionTitle>
          <form onSubmit={handlePhotoUpload} className="space-y-5">

            {/* Destination Bucket */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Destination_Bucket</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPhotoFolder('gallery')}
                  className={`flex-1 py-3 font-mono text-[10px] uppercase tracking-widest border transition-all
                    ${photoFolder === 'gallery' ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'}`}>
                  📸 GALLERY
                </button>
                <button type="button" onClick={() => setPhotoFolder('logos')}
                  className={`flex-1 py-3 font-mono text-[10px] uppercase tracking-widest border transition-all
                    ${photoFolder === 'logos' ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'}`}>
                  🏆 LOGOS
                </button>
              </div>
            </div>

            {/* Album Selector — hanya untuk gallery */}
            {photoFolder === 'gallery' && (
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Assign_To_Album</label>
                <select
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0D0D0D]">-- NO ALBUM (GENERAL) --</option>
                  {albums.map(a => (
                    <option key={a.id} value={a.id} className="bg-[#0D0D0D] text-white">📂 {a.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Caption */}
            {photoFolder === 'gallery' && (
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Caption_</label>
                <input type="text" value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Contoh: Atmosfer Nobar di Warunk Upnormal"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-all text-sm font-bold" />
              </div>
            )}

            {/* Drop Zone */}
            <div className="group relative border-2 border-dashed border-white/10 hover:border-[#FFD700]/50 transition-all p-8 text-center cursor-pointer bg-white/[0.02]">
              <input type="file" accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <Upload className="w-8 h-8 text-white/10 group-hover:text-[#FFD700] transition-colors mx-auto mb-3" />
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                {photoFile ? `✓ READY: ${photoFile.name}` : 'DRAG_ASSET_OR_BROWSE'}
              </p>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={!photoFile || uploading}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-black uppercase tracking-widest transition-all text-sm
                  ${photoFile && !uploading ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>
                <Upload className="w-4 h-4" />
                <span className="bebas text-xl italic">{uploading ? 'UPLOADING...' : 'UPLOAD'}</span>
              </button>
              {photoFile && (
                <button type="button" onClick={() => { setPhotoFile(null); setPhotoCaption('') }}
                  className="px-4 border border-white/10 text-white/30 hover:text-red-500 hover:border-red-500 transition-all bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── Kolom Kanan: Gallery Viewer/Manager ── */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle icon={Eye}>GALLERY_MANAGER</SectionTitle>
          <button
            onClick={fetchPhotos}
            className="flex items-center gap-2 px-3 py-2 border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-all font-mono text-[10px] uppercase"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {/* Filter by Album */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveAlbum('all')}
            className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all shrink-0
              ${activeAlbum === 'all' ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'border-white/10 text-white/40 hover:border-white/30'}`}
          >
            ALL ({photos.length})
          </button>
          {albums.map(album => (
            <button
              key={album.id}
              onClick={() => setActiveAlbum(album.id)}
              className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all shrink-0 whitespace-nowrap
                ${activeAlbum === album.id ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'border-white/10 text-white/40 hover:border-white/30'}`}
            >
              {album.name}
            </button>
          ))}
        </div>

        {/* Folder Label */}
        <div className="flex items-center gap-2 mb-4 font-mono text-[10px] text-white/20 uppercase tracking-widest">
          <Folder className="w-3 h-3 text-[#FFD700]" />
          <span>Viewing: {albumName(activeAlbum)}</span>
          <span className="ml-auto">{photos.length} assets</span>
        </div>

        {/* Loading Skeleton */}
        {loadingPhotos && (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingPhotos && photos.length === 0 && (
          <div className="text-center py-16 font-mono text-white/20 uppercase tracking-widest text-xs border border-dashed border-white/5 bg-white/[0.01]">
            No_Assets_In_This_Folder
          </div>
        )}

        {/* Photo Grid */}
        {!loadingPhotos && photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map(photo => (
              <div key={photo.id} className="group relative aspect-square border border-white/5 overflow-hidden bg-black/40">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <div>
                    {photo.caption && (
                      <p className="font-mono text-[9px] text-white/80 uppercase leading-relaxed line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                    {photo.album_id && (
                      <p className="font-mono text-[9px] text-[#FFD700]/70 mt-1">
                        📂 {albums.find(a => a.id === photo.album_id)?.name || 'Album'}
                      </p>
                    )}
                    {!photo.album_id && (
                      <p className="font-mono text-[9px] text-white/30 mt-1">📂 General</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    disabled={deletingId === photo.id}
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-[9px] uppercase tracking-widest hover:bg-red-600/40 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    {deletingId === photo.id ? 'DELETING...' : 'DELETE_ASSET'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Main AdminPanel
// ─────────────────────────────────────────
const AdminPanel = () => {
  const { user, logout } = useAuth()
  const [watchPartyForm, setWatchPartyForm] = useState({ title: '', location: '', date: '', time: '' })
  const [eventForm, setEventForm] = useState({ title: '', desc: '', date: '' })
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [loading, setLoading] = useState({ wp: false, event: false })
  const [wpFile, setWpFile] = useState(null)
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    const { data } = await supabase.from('albums').select('*').order('created_at', { ascending: false })
    if (data) setAlbums(data)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000)
  }

  const handleWPSubmit = async (e) => {
    e.preventDefault()
    setLoading(p => ({ ...p, wp: true }))
    try {
      let publicUrl = ''
      if (wpFile) {
        const fileExt = wpFile.name.split('.').pop()
        const fileName = `wp-${Date.now()}.${fileExt}`
        const filePath = `watch-parties/${fileName}`
        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, wpFile)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('gallery').getPublicUrl(filePath)
        publicUrl = data.publicUrl
      }
      const { error } = await supabase.from('watch_parties').insert([{
        title: watchPartyForm.title,
        location: watchPartyForm.location,
        date: watchPartyForm.date,
        time: watchPartyForm.time,
        image_url: publicUrl
      }])
      if (error) throw error
      showToast('Watch Party Berhasil Di-deploy!')
      setWatchPartyForm({ title: '', location: '', date: '', time: '' })
      setWpFile(null)
    } catch (err) {
      showToast('Gagal: ' + err.message, 'error')
    } finally {
      setLoading(p => ({ ...p, wp: false }))
    }
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()
    setLoading(p => ({ ...p, event: true }))
    try {
      const dateObj = new Date(eventForm.date)
      const { error } = await supabase.from('events').insert([{
        title: eventForm.title,
        description: eventForm.desc,
        date: eventForm.date,
        day: dateObj.getDate(),
        month: dateObj.toLocaleString('id-ID', { month: 'short' }),
      }])
      if (error) throw error
      showToast('Kegiatan berhasil ditambahkan!')
      setEventForm({ title: '', desc: '', date: '' })
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setLoading(p => ({ ...p, event: false }))
    }
  }

  if (!user) return <AdminLogin />

  return (
    <section id="admin" className="relative py-24 bg-[#080808] border-t border-white/5">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-red-600/10 border border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <Settings className="w-10 h-10 text-red-600 animate-spin-slow" />
            </div>
            <div>
              <h2 className="bebas text-6xl text-white italic tracking-tighter">
                ADMIN <span className="text-[#FFD700]">PANEL</span>
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="font-mono text-[10px] text-[#FFD700] tracking-[0.3em] uppercase">
                  {user.email} // Root_Access
                </p>
              </div>
            </div>
          </div>
          <button onClick={logout}
            className="mt-6 md:mt-0 flex items-center gap-2 px-5 py-3 border border-red-600/40 text-red-500 font-mono text-xs uppercase tracking-widest hover:bg-red-600/10 transition-all">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <Toast message={toast.message} type={toast.type} />

        <div className="bg-[#0D0D0D] border border-white/10 p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <Activity className="w-48 h-48 text-white" />
          </div>

          {/* FORM 1: Match Schedule */}
          <div className="mb-20">
            <SectionTitle icon={Trophy}>TAMBAH / UPDATE JADWAL MATCH</SectionTitle>
            <MatchForm showToast={showToast} />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

          {/* FORM 2: Watch Party */}
          <div className="mb-20">
            <SectionTitle icon={Tv}>TAMBAH WATCH PARTY</SectionTitle>
            <form onSubmit={handleWPSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Match_Name_</label>
                <input type="text" value={watchPartyForm.title}
                  onChange={(e) => setWatchPartyForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="CONTOH: ONIC VS RRQ - GRAND FINAL"
                  className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold tracking-wide" required />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Location_Venue_</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input type="text" value={watchPartyForm.location}
                    onChange={(e) => setWatchPartyForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 pl-12 pr-5 py-4 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Date_</label>
                  <input type="date" value={watchPartyForm.date}
                    onChange={(e) => setWatchPartyForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold appearance-none" required />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Time_</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="time" value={watchPartyForm.time}
                      onChange={(e) => setWatchPartyForm(p => ({ ...p, time: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-4 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold appearance-none" required />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Event_Poster_ (16:9 Recommended)</label>
                <div className="relative border border-dashed border-white/20 p-4 bg-white/5 hover:border-[#FFD700]/50 transition-all">
                  <input type="file" accept="image/*"
                    onChange={(e) => setWpFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer" />
                  <p className="font-mono text-[10px] text-white/40 text-center uppercase">
                    {wpFile ? `✓ Selected: ${wpFile.name}` : 'Click to upload poster'}
                  </p>
                </div>
              </div>
              <button type="submit" disabled={loading.wp}
                className="md:col-span-2 flex items-center justify-center gap-3 bg-[#FFD700] text-black py-5 font-black uppercase hover:bg-white transition-all active:scale-95 disabled:opacity-50">
                <PlusCircle className="w-5 h-5" />
                <span className="bebas text-2xl italic tracking-widest">
                  {loading.wp ? 'MENYIMPAN...' : 'DEPLOY EVENT TO SYSTEM'}
                </span>
              </button>
            </form>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

          {/* FORM 3: Kegiatan */}
          <div className="mb-20">
            <SectionTitle icon={Calendar}>TAMBAH KEGIATAN</SectionTitle>
            <form onSubmit={handleEventSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Event_Heading_</label>
                <input type="text" value={eventForm.title}
                  onChange={(e) => setEventForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Brief_Description_</label>
                <textarea rows="3" value={eventForm.desc}
                  onChange={(e) => setEventForm(p => ({ ...p, desc: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold resize-none" required />
              </div>
              <div className="max-w-xs space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">Event_Date_</label>
                <input type="date" value={eventForm.date}
                  onChange={(e) => setEventForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold" required />
              </div>
              <button type="submit" disabled={loading.event}
                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-5 font-black uppercase tracking-widest transition-all disabled:opacity-50">
                <Calendar className="w-5 h-5 text-[#FFD700]" />
                <span className="bebas text-2xl italic">
                  {loading.event ? 'MENYIMPAN...' : 'UPDATE CALENDAR'}
                </span>
              </button>
            </form>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

          {/* FORM 4: Gallery & Album Management (UPDATED) */}
          <div>
            <GalleryManager
              albums={albums}
              showToast={showToast}
              onAlbumCreated={fetchAlbums}
            />
          </div>
        </div>

        {/* Console */}
        <div className="mt-12 bg-black/80 p-6 border border-white/5 font-mono text-[11px] text-white/40 shadow-inner space-y-2">
          <div className="flex gap-4"><span className="text-[#FFD700]">[SYSTEM]</span><span>Supabase connection established.</span></div>
          <div className="flex gap-4"><span className="text-blue-500">[STORAGE]</span><span>Buckets: gallery/ & logos/ ready.</span></div>
          <div className="flex gap-4"><span className="text-green-500">[AUTH]</span><span>{user.email} authenticated via Supabase Auth.</span></div>
        </div>
      </div>

      <style>{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

export default AdminPanel
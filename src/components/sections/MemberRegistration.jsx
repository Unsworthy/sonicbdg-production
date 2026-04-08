import { useState } from 'react'
import { Users, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import { bandungAreas } from '../../data/mockData'
import { supabase } from '../../lib/supabase'

const initialForm = {
  namaLengkap: '',
  instagram: '',
  whatsapp: '',
  area: '',
}

const MemberRegistration = () => {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const { error } = await supabase.from('members').insert([{
      nama_lengkap: form.namaLengkap,
      instagram: form.instagram,
      whatsapp: form.whatsapp,
      area: form.area,
    }])
    if (error) throw error
    setSubmitted(true)
    setForm(initialForm)
    setTimeout(() => setSubmitted(false), 5000)
  } catch (err) {
    alert('Gagal mendaftar: ' + err.message)
  }
}

  return (
    <section id="daftar" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-[#FFD700] mb-2">
            <Zap className="w-5 h-5 fill-[#FFD700]" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase">Recruitment_Phase // Open</span>
          </div>
          <h2 className="bebas text-5xl md:text-7xl text-white italic tracking-tighter">
            BECOME A <span className="text-[#FFD700]">MEMBER</span>
          </h2>
          <p className="text-white/40 font-mono text-xs mt-2 uppercase tracking-widest">
            Join the biggest Sonic community in Bandung region.
          </p>
        </div>

        <div className="relative group">
          {/* Decorative Borders */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-transparent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-[#0A0A0A] border border-white/10 p-8 md:p-12 shadow-2xl">
            {submitted && (
              <div className="mb-8 p-4 bg-[#FFD700] text-black skew-x-[-10deg] flex items-center gap-4 animate-in zoom-in duration-300">
                <ShieldCheck className="w-6 h-6 skew-x-[10deg]" />
                <span className="font-bold skew-x-[10deg] uppercase tracking-tighter">
                  Data Terkirim! Cek WhatsApp kamu secara berkala, {form.namaLengkap}.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] tracking-widest uppercase">
                  Full Name_
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={form.namaLengkap}
                  onChange={handleChange}
                  placeholder="Kairiacu"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-colors font-bold tracking-wide"
                  required
                />
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] tracking-widest uppercase">
                  IG Handle_
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-colors font-bold tracking-wide"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] tracking-widest uppercase">
                  WA Number_
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+62 xxx xxx xxx"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-colors font-bold tracking-wide"
                  required
                />
              </div>

              {/* Area Bandung */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#FFD700] tracking-widest uppercase">
                  Region Area_
                </label>
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="w-full bg-[#151515] border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-colors font-bold tracking-wide appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-[#0A0A0A]">Pilih Area</option>
                  {bandungAreas.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-[#0A0A0A]">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="group relative w-full bg-[#FFD700] text-black py-5 overflow-hidden transition-all hover:pr-12"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <span className="bebas text-3xl italic tracking-widest">SUBMIT REGISTRATION</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                  {/* Decorative bar on hover */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/40 opacity-40 group-hover:animate-shine" />
                </button>
              </div>
            </form>

            {/* Form Footer */}
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white/20" />
                <span className="font-mono text-[9px] text-white/20 uppercase">Community Rules Applied</span>
              </div>
              <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">
                System_ID: <span className="text-white/40">SNC-BDG-2026</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .animate-shine {
          animation: shine 0.8s;
        }
      `}</style>
    </section>
  )
}

export default MemberRegistration
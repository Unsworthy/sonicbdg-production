import { useState } from 'react'
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, LogIn, Eye, EyeOff, Zap } from 'lucide-react'

const AdminLogin = ({ onSuccess }) => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError('Email atau password salah. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-32 bg-[#050505] flex items-center justify-center border-t border-white/5 min-h-[600px]">
      {/* BG glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="relative p-4 bg-[#FFD700]/10 border border-[#FFD700]/30">
              <ShieldAlert className="w-12 h-12 text-[#FFD700]" />
              <div className="absolute inset-0 bg-[#FFD700]/10 blur-xl animate-pulse" />
            </div>
          </div>
          <h2 className="bebas text-5xl text-white italic tracking-tighter mb-1">
            ADMIN <span className="text-[#FFD700]">ACCESS</span>
          </h2>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">
            Sonic_Bandung // Secure_Terminal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 shadow-2xl">

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-600/30 font-mono text-xs text-red-400 uppercase tracking-widest">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">
                Admin_Email_
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sonicbandung.id"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold tracking-wide"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#FFD700] uppercase tracking-widest">
                Password_
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 pr-12 text-white focus:border-[#FFD700] focus:outline-none transition-all font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#FFD700] text-black py-4 font-black uppercase tracking-tight hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="bebas text-xl italic tracking-widest">AUTHENTICATING...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="bebas text-xl italic tracking-widest">LOGIN TO ADMIN</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 font-mono text-[9px] text-white/20 text-center uppercase tracking-widest">
            Hanya admin resmi Sonic Bandung yang bisa mengakses panel ini.
          </p>
        </div>

        {/* Console bar */}
        <div className="mt-4 bg-black/80 border border-white/5 px-4 py-2 font-mono text-[9px] text-white/20 flex justify-between">
          <span>[AUTH] Waiting for credentials...</span>
          <span className="text-[#FFD700]">SNB-SEC-v2</span>
        </div>
      </div>

      <style>{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
    </section>
  )
}

export default AdminLogin

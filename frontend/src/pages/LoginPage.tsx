import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/utils/api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      const { data } = await api.post('/api/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      setAuth(data.user, data.access_token)
      toast.success(`Welcome back, ${data.user.full_name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(45,148,105,0.08) 0%, transparent 60%), #080f0a' }}>
      <div className="w-full max-w-md" style={{ animation: 'slideUp 0.4s ease-out' }}>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand)' }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>SocialGenius</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>From Invisible to Unstoppable</p>
        </div>

        <div className="card">
          <h1 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>Password</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
            No account?{' '}
            <Link to="/register" className="font-medium" style={{ color: 'var(--brand-light)' }}>Create one free</Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
          A product of{' '}
          <a href="https://www.themindsetgenius.com" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-light)' }}>
            The Mindset Genius
          </a>
          {' '}· Strategist Ayub
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/utils/api'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ email:'', password:'', full_name:'', phone:'' })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', form)
      setAuth(data.user, data.access_token)
      toast.success("Account created! Let's set up your business.")
      navigate('/onboarding')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(45,148,105,0.08) 0%, transparent 60%), #080f0a' }}>
      <div className="w-full max-w-md" style={{ animation: 'slideUp 0.4s ease-out' }}>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand)' }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>SocialGenius</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Start your journey to social media dominance</p>
        </div>

        <div className="card">
          <h1 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>Create your account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name:'full_name', label:'Full Name',           type:'text',     placeholder:'Your full name' },
              { name:'email',     label:'Email Address',       type:'email',    placeholder:'you@example.com' },
              { name:'phone',     label:'Phone (optional)',    type:'tel',      placeholder:'+61 4XX XXX XXX' },
              { name:'password',  label:'Password',            type:'password', placeholder:'Min. 8 characters' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>{f.label}</label>
                <input type={f.type} className="input-field" placeholder={f.placeholder}
                  value={(form as any)[f.name]}
                  onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                  required={f.name !== 'phone'} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create Account — Free'}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--brand-light)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

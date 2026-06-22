import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BUSINESS_TYPES, SYDNEY_SUBURBS } from '@/utils/constants'
import { TrendingUp, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import { useBusinessStore } from '@/store/businessStore'

const STEPS = [
  { num: 1, title: 'Business Details',   subtitle: 'Tell us about your business' },
  { num: 2, title: 'Location & Contact', subtitle: 'Where are you based?' },
  { num: 3, title: 'Online Presence',    subtitle: 'Your current platforms' },
  { num: 4, title: "You\'re ready!",    subtitle: "Let\'s run your first audit" },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { setActiveBusiness } = useBusinessStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: \'\', business_type: \'\', description: \'\',
    suburb: \'\', address: \'\', postcode: \'\', website: \'\', phone: \'\', whatsapp: \'\',
    instagram_username: \'\', tiktok_username: \'\', youtube_channel_id: \'\',
    ubereats_business_id: \'\', doordash_business_id: \'\', hungrypanda_business_id: \'\',
  })

  const set_ = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))
  const step1Valid = form.name.trim() && form.business_type
  const step2Valid = form.suburb.trim()

  async function handleFinish() {
    setLoading(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v.trim() !== \'\'))
      const { data } = await api.post(\'/api/businesses/\', payload)
      await api.post(`/api/businesses/${data.id}/complete-onboarding`)
      setActiveBusiness(data)
      toast.success(\'Business set up! Redirecting to dashboard…\')
      navigate(\'/dashboard\')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || \'Setup failed\')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
         style={{ background: \'radial-gradient(ellipse at 50% 0%, rgba(45,148,105,0.1) 0%, transparent 60%), #080f0a\' }}>

      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: \'var(--brand)\' }}>
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white" style={{ fontFamily: \'Sora\' }}>SocialGenius</span>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                 style={{
                   background: step > s.num ? \'var(--brand)\' : step === s.num ? \'rgba(45,148,105,0.2)\' : \'rgba(255,255,255,0.05)\',
                   color: step > s.num ? \'white\' : step === s.num ? \'var(--brand-light)\' : \'var(--muted)\',
                   border: step === s.num ? \'1px solid rgba(45,148,105,0.5)\' : \'none\',
                 }}>
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-0.5 rounded transition-all"
                   style={{ background: step > s.num ? \'var(--brand)\' : \'rgba(255,255,255,0.1)\' }} />
            )}
          </div>
        ))}
      </div>

      <div className="card w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: \'Sora\' }}>{STEPS[step-1].title}</h1>
          <p className="text-sm mt-1" style={{ color: \'var(--muted)\' }}>{STEPS[step-1].subtitle}</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: \'var(--muted)\' }}>Business Name *</label>
              <input className="input-field" placeholder="e.g. Spice Palace Restaurant"
                value={form.name} onChange={e => set_(\'name\', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: \'var(--muted)\' }}>Business Type *</label>
              <select className="input-field" value={form.business_type} onChange={e => set_(\'business_type\', e.target.value)}>
                <option value="">Select your business type…</option>
                {BUSINESS_TYPES.map(bt => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: \'var(--muted)\' }}>Short Description</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="What does your business do? Who are your customers?"
                value={form.description} onChange={e => set_(\'description\', e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: \'var(--muted)\' }}>Suburb *</label>
              <select className="input-field" value={form.suburb} onChange={e => set_(\'suburb\', e.target.value)}>
                <option value="">Select your suburb…</option>
                {SYDNEY_SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {[
              { field: \'address\',  label: \'Street Address\', placeholder: \'45 Auburn Road, Auburn NSW 2144\' },
              { field: \'postcode\', label: \'Postcode\',        placeholder: \'2144\' },
              { field: \'website\',  label: \'Website\',         placeholder: \'https://yourbusiness.com.au\' },
              { field: \'phone\',    label: \'Phone\',           placeholder: \'+61 4XX XXX XXX\' },
              { field: \'whatsapp\', label: \'WhatsApp Number\', placeholder: \'+61 4XX XXX XXX\' },
            ].map(row => (
              <div key={row.field}>
                <label className="block text-sm mb-1.5" style={{ color: \'var(--muted)\' }}>{row.label}</label>
                <input className="input-field" placeholder={row.placeholder}
                  value={(form as any)[row.field]} onChange={e => set_(row.field, e.target.value)} />
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg px-4 py-3 text-sm" style={{ background: \'rgba(255,255,255,0.04)\', color: \'var(--muted)\' }}>
              Enter handles below. Live platform connections happen in the D1 audit — this helps us find your profiles now.
            </div>
            {[
              { field: \'instagram_username\', label: \'Instagram\', prefix: \'@\', placeholder: \'yourbusiness\' },
              { field: \'tiktok_username\',    label: \'TikTok\',    prefix: \'@\', placeholder: \'yourbusiness\' },
              { field: \'youtube_channel_id\', label: \'YouTube\',   prefix: \'\',  placeholder: \'Channel name or URL\' },
            ].map(row => (
              <div key={row.field}>
                <label className="block text-sm mb-1.5" style={{ color: \'var(--muted)\' }}>{row.label}</label>
                <div className="flex">
                  {row.prefix && (
                    <span className="input-field w-auto px-3 rounded-r-none border-r-0 text-sm"
                          style={{ color: \'var(--muted)\', background: \'rgba(255,255,255,0.03)\' }}>{row.prefix}</span>
                  )}
                  <input className={`input-field flex-1 ${row.prefix ? \'rounded-l-none\' : \'\' }`}
                    placeholder={row.placeholder}
                    value={(form as any)[row.field]} onChange={e => set_(row.field, e.target.value)} />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: \'var(--muted)\' }}>Delivery Platforms (optional)</label>
              {[
                { field: \'ubereats_business_id\',    label: \'UberEats Business ID\' },
                { field: \'doordash_business_id\',    label: \'DoorDash Store ID\' },
                { field: \'hungrypanda_business_id\', label: \'HungryPanda Store ID\' },
              ].map(row => (
                <div key={row.field} className="mb-2">
                  <input className="input-field text-sm" placeholder={row.label}
                    value={(form as any)[row.field]} onChange={e => set_(row.field, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                 style={{ background: \'rgba(45,148,105,0.15)\' }}>
              <Check className="w-8 h-8" style={{ color: \'var(--brand-light)\' }} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: \'Sora\' }}>
              {form.name} is ready!
            </h2>
            <p className="text-sm mb-6" style={{ color: \'var(--muted)\' }}>
              We\'ll audit your social media presence across all 9 dimensions and show you exactly where your biggest revenue opportunities are.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: \'Type\',    value: BUSINESS_TYPES.find(b => b.value === form.business_type)?.label ?? \'—\' },
                { label: \'Suburb\',  value: form.suburb || \'—\' },
                { label: \'Platforms\', value: [form.instagram_username && \'IG\', form.tiktok_username && \'TT\', form.youtube_channel_id && \'YT\'].filter(Boolean).join(\', \') || \'GMB\' },
              ].map(item => (
                <div key={item.label} className="rounded-lg p-3 text-center" style={{ background: \'rgba(255,255,255,0.04)\' }}>
                  <div className="text-xs mb-1" style={{ color: \'var(--muted)\' }}>{item.label}</div>
                  <div className="text-xs font-medium text-white truncate">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep(s => s-1)} className="btn-ghost flex items-center gap-1.5 text-sm">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <div className="flex-1" />
          {step < 4 ? (
            <button
              onClick={() => setStep(s => s+1)}
              disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
              className="btn-primary flex items-center gap-1.5 text-sm">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleFinish} disabled={loading} className="btn-primary text-sm">
              {loading ? \'Setting up…\' : \'Run My First Audit →\'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

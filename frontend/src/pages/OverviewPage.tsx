import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { DIMENSIONS, getScoreColor, getScoreGrade } from '@/utils/constants'
import { useAuthStore } from '@/store/authStore'
import api from '@/utils/api'
import { AlertTriangle, Zap, TrendingUp, RefreshCw } from 'lucide-react'

interface DimData {
  dimension_number: number
  short_name: string
  score: number | null
  grade: string | null
  status: string
  quick_wins: string[]
}

interface OverviewData {
  has_business: boolean
  business: any
  overall_score: number | null
  completed_dimensions: number
  total_dimensions: number
  dimensions: DimData[]
  next_recommended_action: string
  estimated_revenue_opportunity: string
}

export default function OverviewPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data: d } = await api.get('/api/dashboard/overview')
      if (!d.has_business) { navigate('/onboarding'); return }
      setData(d)
    } catch { /* handled by interceptor */ }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3" style={{ color: 'var(--muted)' }}>
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading your intelligence…</span>
      </div>
    </div>
  )

  if (!data) return null

  const overall = data.overall_score
  const overallColor = getScoreColor(overall)
  const circumference = 2 * Math.PI * 52

  const radarData = DIMENSIONS.map(d => {
    const row = data.dimensions.find(x => x.dimension_number === d.number)
    return { subject: `D${d.number}`, score: row?.score ?? 0, fullMark: 100 }
  })

  const sorted = [...data.dimensions].sort((a, b) => (a.score ?? 101) - (b.score ?? 101))
  const criticalCount = data.dimensions.filter(d => d.score !== null && d.score <= 40).length
  const topPriority = sorted.find(d => d.score !== null)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora' }}>
          Good day, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          {data.business?.name} · {data.business?.suburb} · {data.completed_dimensions}/9 dimensions audited
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        {/* Score ring */}
        <div className="card flex flex-col items-center justify-center py-8">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(45,148,105,0.1)" strokeWidth="10" />
              {overall !== null && (
                <circle cx="60" cy="60" r="52" fill="none" stroke={overallColor} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(overall / 100) * circumference} ${circumference}`}
                  className="score-ring" />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {overall !== null ? (
                <>
                  <span className="text-3xl font-bold" style={{ fontFamily: 'Sora', color: overallColor }}>{Math.round(overall)}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>/ 100</span>
                </>
              ) : (
                <span className="text-sm text-center px-2" style={{ color: 'var(--muted)' }}>No audits yet</span>
              )}
            </div>
          </div>
          <div className="mt-3 text-center">
            <div className="text-sm font-semibold text-white">SocialGenius Score</div>
            {overall !== null && (
              <div className="text-xs mt-0.5" style={{ color: overallColor }}>{getScoreGrade(overall)}</div>
            )}
          </div>
        </div>

        {/* Critical alert */}
        <div className="card flex flex-col justify-center" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} />
            <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>Critical Gaps</span>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Sora', color: '#ef4444' }}>
            {criticalCount}
          </div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>
            {criticalCount === 0 ? 'No critical dimensions — great start!' : `dimension${criticalCount > 1 ? 's' : ''} scoring below 40 — fix these first`}
          </div>
          {topPriority && (
            <button onClick={() => navigate(`/dashboard/d${topPriority.dimension_number}`)}
                    className="mt-4 text-xs flex items-center gap-1 font-medium" style={{ color: '#ef4444' }}>
              Fix D{topPriority.dimension_number} first →
            </button>
          )}
        </div>

        {/* Revenue opportunity */}
        <div className="card flex flex-col justify-center" style={{ borderColor: 'rgba(232,180,35,0.2)', background: 'rgba(232,180,35,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" style={{ color: 'var(--gold)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Revenue Opportunity</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Sora', color: 'var(--gold)' }}>
            +25–40%
          </div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>
            estimated revenue increase from fixing your top 3 gaps
          </div>
          <button onClick={() => navigate('/dashboard/roadmap')}
                  className="mt-4 text-xs flex items-center gap-1 font-medium" style={{ color: 'var(--gold)' }}>
            View roadmap →
          </button>
        </div>
      </div>

      {/* Next action banner */}
      <div className="rounded-xl px-5 py-4 mb-8 flex items-center gap-3"
           style={{ background: 'rgba(45,148,105,0.08)', border: '1px solid rgba(45,148,105,0.2)' }}>
        <TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-light)' }} />
        <div className="flex-1">
          <span className="text-sm text-white font-medium">Next: </span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>{data.next_recommended_action}</span>
        </div>
        <button onClick={() => navigate('/dashboard/d1')} className="btn-primary text-sm py-2 px-4 flex-shrink-0">
          Run D1 Audit →
        </button>
      </div>

      {/* Radar + Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: 'Sora' }}>9-Dimension Radar</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(45,148,105,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'DM Sans' }} />
              <Radar name="Score" dataKey="score" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
            <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'Sora' }}>Priority Fix List</h2>
          </div>
          <div className="space-y-2">
            {sorted.slice(0, 6).map((d, i) => {
              const dim = DIMENSIONS.find(x => x.number === d.dimension_number)!
              const color = getScoreColor(d.score)
              return (
                <button key={d.dimension_number} onClick={() => navigate(`/dashboard/d${d.dimension_number}`)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                  <span className="text-xs w-4 flex-shrink-0" style={{ color: 'var(--muted)' }}>#{i+1}</span>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dim.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">D{d.dimension_number} — {d.short_name}</div>
                    {d.status === 'not_audited' && <div className="text-xs" style={{ color: 'var(--muted)' }}>Not yet audited</div>}
                  </div>
                  {d.score !== null ? (
                    <span className="text-sm font-bold flex-shrink-0" style={{ fontFamily: 'Sora', color }}>{Math.round(d.score)}</span>
                  ) : (
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted)' }}>—</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* All 9 dimension cards */}
      <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: 'Sora' }}>All 9 Dimensions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIMENSIONS.map(d => {
          const row = data.dimensions.find(x => x.dimension_number === d.number)
          const score = row?.score ?? null
          const color = getScoreColor(score)
          return (
            <button key={d.key} onClick={() => navigate(d.route)}
                    className="card-hover text-left group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>D{d.number}</span>
                </div>
                <span className="text-lg font-bold" style={{ fontFamily: 'Sora', color }}>
                  {score !== null ? Math.round(score) : '—'}
                </span>
              </div>
              <div className="w-full h-1 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: `${score ?? 0}%`, backgroundColor: color }} />
              </div>
              <div className="text-sm font-semibold text-white mb-0.5 leading-tight">{d.shortName}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{d.tagline}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

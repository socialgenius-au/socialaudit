import { useNavigate } from 'react-router-dom'
import { DIMENSIONS } from '@/utils/constants'
import { Map, Zap, ChevronRight, Lock } from 'lucide-react'

const PHASES = [
  {
    num: 1, name: 'Immediate Revenue', timeframe: 'Weeks 1–4',
    promise: '+10–15% revenue', color: '#10b981', dims: [1, 2, 3],
    conditions: [
      'Complete all Google Business Profile fields within 7 days',
      'Respond to every review within 24 hours',
      'Add a booking/order link to all platforms',
    ],
  },
  {
    num: 2, name: 'Amplify & Advertise', timeframe: 'Months 2–3',
    promise: '+20–30% total', color: '#8b5cf6', dims: [4, 5, 6],
    conditions: [
      'Phase 1 conditions maintained',
      'Minimum $500/month ad budget committed',
      'Post minimum 3× per week on primary platform',
    ],
  },
  {
    num: 3, name: 'Content & Influence', timeframe: 'Months 4–6',
    promise: '+35–50% total', color: '#f97316', dims: [7, 8, 9],
    conditions: [
      'Phase 1 & 2 conditions maintained',
      'Content calendar followed consistently',
      'At least 1 influencer collaboration completed',
    ],
  },
]

export default function RoadmapPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: 'rgba(232,180,35,0.15)' }}>
          <Map className="w-5 h-5" style={{ color: 'var(--gold)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora' }}>Growth Roadmap</h1>
          <p style={{ color: 'var(--muted)' }}>Your 6-month plan from current score to 80+. Built on your 9-dimension audit.</p>
        </div>
      </div>

      {/* Promise banner */}
      <div className="card mb-8" style={{ borderColor: 'rgba(232,180,35,0.25)', background: 'rgba(232,180,35,0.04)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4" style={{ color: 'var(--gold)' }} />
          <span className="font-semibold" style={{ color: 'var(--gold)', fontFamily: 'Sora' }}>The Promise</span>
        </div>
        <p className="text-white text-base leading-relaxed">
          Follow all three phases and SocialGenius projects a{' '}
          <span className="font-bold" style={{ color: 'var(--gold)' }}>+35–50% increase in revenue</span>{' '}
          within 6 months — driven by more footfall, more orders, and higher customer lifetime value.
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
          * Based on benchmarks from Sydney SMBs who followed the 9-dimension framework. Results depend on consistent execution.
        </p>
      </div>

      <div className="space-y-5">
        {PHASES.map(phase => (
          <div key={phase.num} className="card">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                     style={{ background: `${phase.color}20`, color: phase.color, border: `1px solid ${phase.color}30` }}>
                  {phase.num}
                </div>
                <div>
                  <div className="font-semibold text-white" style={{ fontFamily: 'Sora' }}>{phase.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{phase.timeframe}</div>
                </div>
              </div>
              <div className="text-sm font-bold" style={{ color: phase.color }}>{phase.promise}</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {phase.dims.map(n => {
                const d = DIMENSIONS.find(x => x.number === n)!
                return (
                  <button key={n} onClick={() => navigate(`/dashboard/d${n}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{ background: `${d.color}12`, color: d.color, border: `1px solid ${d.color}20` }}
                          onMouseEnter={e => (e.currentTarget.style.background = `${d.color}25`)}
                          onMouseLeave={e => (e.currentTarget.style.background = `${d.color}12`)}>
                    D{n} {d.shortName} <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                )
              })}
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)', fontSize: '10px' }}>
                Conditions You Must Meet
              </div>
              <div className="space-y-1.5">
                {phase.conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--muted)' }}>
                    <div className="w-4 h-4 rounded flex-shrink-0 mt-0.5" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6 flex items-center gap-4" style={{ borderStyle: 'dashed', borderColor: 'rgba(45,148,105,0.2)' }}>
        <Lock className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
        <div>
          <div className="text-sm font-medium text-white mb-0.5">Full Roadmap Engine — Sprint 12</div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            In Sprint 12, the roadmap auto-generates from your live audit scores, with personalised tasks,
            due dates, progress tracking, and a PDF export for client proposals.
          </p>
        </div>
      </div>
    </div>
  )
}

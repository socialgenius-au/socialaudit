import { useNavigate } from 'react-router-dom'
import { DIMENSIONS, getScoreColor } from '@/utils/constants'
import { ArrowLeft, Construction } from 'lucide-react'

interface Props { num: number; sprint: number }

export default function DimensionStubPage({ num, sprint }: Props) {
  const navigate = useNavigate()
  const d = DIMENSIONS.find(x => x.number === num)!

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm mb-6 transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
        <ArrowLeft className="w-4 h-4" /> Back to Overview
      </button>

      <div className="flex items-start gap-3 mb-8">
        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: d.color }} />
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>D{d.number}</div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora' }}>{d.name}</h1>
          <p style={{ color: 'var(--muted)' }}>{d.tagline}</p>
        </div>
      </div>

      <div className="card text-center py-20" style={{ borderStyle: 'dashed', borderColor: 'rgba(45,148,105,0.2)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
             style={{ background: 'rgba(45,148,105,0.1)' }}>
          <Construction className="w-7 h-7" style={{ color: 'var(--brand-light)' }} />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Sora' }}>
          Sprint {sprint} — Coming Soon
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
          The full <strong className="text-white">D{d.number} {d.shortName}</strong> audit engine —
          sub-component scoring, competitor benchmarking, action recommendations and revenue
          impact estimates — will be built in Sprint {sprint}.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          {num > 1 && (
            <button onClick={() => navigate(`/dashboard/d${num - 1}`)} className="btn-ghost text-sm">
              ← D{num - 1}
            </button>
          )}
          {num < 9 && (
            <button onClick={() => navigate(`/dashboard/d${num + 1}`)} className="btn-secondary text-sm">
              D{num + 1} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

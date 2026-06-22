import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBusinessStore } from '@/store/businessStore'
import { getScoreColor, getScoreGrade } from '@/utils/constants'
import api from '@/utils/api'
import {
  ArrowLeft, RefreshCw, MapPin, Star, Search, FileText,
  Globe, TrendingUp, Users, BarChart2, AlertTriangle, CheckCircle, ChevronRight
} from 'lucide-react'

interface SubScore {
  name: string
  score: number
  max: number
  status: 'critical' | 'needs_work' | 'strong' | 'na'
  insight: string
}

interface D1Result {
  total_score: number
  gbp_completeness_score: number
  search_ranking_score: number
  citation_score: number
  seo_signals_score: number
  review_velocity_score: number
  posts_score: number
  maps_score: number
  competitor_intel_score: number
  // GBP detail
  gbp_photos_count: number
  gbp_posts_active: boolean
  gbp_booking_link: boolean
  gbp_qa_answered: boolean
  google_rating: number | null
  total_google_reviews: number
  reviews_per_month: number
  response_rate: number
  local_pack_present: boolean
  primary_keyword_rank: number | null
  citation_count: number
  nap_consistency_score: number
  missing_directories: string[]
  mobile_speed_score: number | null
  schema_markup_present: boolean
  maps_embedded: boolean
  priority_fixes: Array<{ title: string; impact: string; effort: string; revenue_impact: string }>
  competitor_comparison: Array<{ name: string; suburb: string; score: number; review_count: number; rating: number }>
  estimated_revenue_impact: string
  audited_at: string
  business_name: string
  suburb: string
}

const SUB_COMPONENTS = [
  { key: 'gbp_completeness_score',  label: 'GBP Completeness',      max: 20, icon: <FileText className="w-4 h-4" /> },
  { key: 'search_ranking_score',    label: 'Local Search Ranking',   max: 20, icon: <Search className="w-4 h-4" /> },
  { key: 'citation_score',          label: 'Citations & Directories',max: 15, icon: <Globe className="w-4 h-4" /> },
  { key: 'seo_signals_score',       label: 'Local SEO Signals',      max: 15, icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'review_velocity_score',   label: 'Review Velocity',        max: 15, icon: <Star className="w-4 h-4" /> },
  { key: 'posts_score',             label: 'Posts & Activity',       max: 5,  icon: <BarChart2 className="w-4 h-4" /> },
  { key: 'maps_score',              label: 'Maps Ranking Factors',   max: 5,  icon: <MapPin className="w-4 h-4" /> },
  { key: 'competitor_intel_score',  label: 'Competitor Intelligence',max: 5,  icon: <Users className="w-4 h-4" /> },
]

function gradeFromScore(score: number, max: number): 'critical' | 'needs_work' | 'strong' {
  const pct = (score / max) * 100
  if (pct <= 40) return 'critical'
  if (pct <= 70) return 'needs_work'
  return 'strong'
}

const GRADE_COLOR = { critical: '#ef4444', needs_work: '#f59e0b', strong: '#22c55e' }
const GRADE_BG    = { critical: 'rgba(239,68,68,0.1)', needs_work: 'rgba(245,158,11,0.1)', strong: 'rgba(34,197,94,0.1)' }

export default function D1Page() {
  const navigate = useNavigate()
  const { activeBusiness } = useBusinessStore()
  const [result, setResult] = useState<D1Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'competitors' | 'fixes'>('overview')

  const businessId = activeBusiness?.id

  useEffect(() => {
    if (businessId) loadLatest()
  }, [businessId])

  async function loadLatest() {
    setLoading(true)
    try {
      const { data } = await api.get(`/api/d1/${businessId}/latest`)
      setResult(data)
    } catch (err: any) {
      if (err.response?.status !== 404) console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function runAudit() {
    if (!businessId) return
    setRunning(true)
    try {
      const { data } = await api.post(`/api/d1/${businessId}/audit`)
      setResult(data)
    } catch (err: any) {
      console.error('Audit failed:', err.response?.data)
    } finally {
      setRunning(false)
    }
  }

  const score = result?.total_score ?? null
  const scoreColor = getScoreColor(score)
  const circumference = 2 * Math.PI * 40

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">

      {/* Back */}
      <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm mb-6 transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
        <ArrowLeft className="w-4 h-4" /> Back to Overview
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#10b981' }} />
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>D1</div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora' }}>Local SEO & Presence Intelligence</h1>
            <p className="mt-1" style={{ color: 'var(--muted)' }}>
              Get found by buyers right now — GMB, local rankings, citations, reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {result && (
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(score! / 100) * circumference} ${circumference}`}
                  className="score-ring" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold" style={{ fontFamily: 'Sora', color: scoreColor }}>{Math.round(score!)}</span>
                <span className="text-xs" style={{ color: 'var(--muted)', fontSize: '9px' }}>/100</span>
              </div>
            </div>
          )}
          <button onClick={runAudit} disabled={running || !businessId}
                  className="btn-primary flex items-center gap-2 text-sm"
                  style={{ background: running ? 'var(--brand-dark)' : 'var(--brand)' }}>
            <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Auditing…' : result ? 'Re-run Audit' : 'Run D1 Audit'}
          </button>
        </div>
      </div>

      {/* Running state */}
      {running && (
        <div className="card mb-6 flex items-center gap-4" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
          <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0" style={{ color: '#10b981' }} />
          <div>
            <div className="text-sm font-medium text-white">Running your D1 audit…</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Checking Google Business Profile · Local rankings · Citations · Review velocity · Competitor benchmarking
            </div>
          </div>
        </div>
      )}

      {/* No result yet */}
      {!result && !loading && !running && (
        <div className="card text-center py-16" style={{ borderStyle: 'dashed', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
               style={{ background: 'rgba(16,185,129,0.1)' }}>
            <MapPin className="w-7 h-7" style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Sora' }}>No D1 Audit Yet</h2>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--muted)' }}>
            Run your first Local SEO audit to see exactly where you stand — your Google Business Profile score,
            local ranking position, citation gaps, review velocity, and how you compare to your top 3 competitors.
          </p>
          <button onClick={runAudit} disabled={!businessId} className="btn-primary">
            Run D1 Audit Now →
          </button>
        </div>
      )}

      {/* Results */}
      {result && !running && (
        <>
          {/* Revenue impact banner */}
          {result.estimated_revenue_impact && (
            <div className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3"
                 style={{ background: 'rgba(232,180,35,0.06)', border: '1px solid rgba(232,180,35,0.2)' }}>
              <TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
              <div>
                <span className="text-sm font-medium text-white">Revenue Opportunity: </span>
                <span className="text-sm" style={{ color: 'var(--gold)' }}>{result.estimated_revenue_impact}</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
            {(['overview', 'details', 'competitors', 'fixes'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                      className="flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all"
                      style={{
                        background: activeTab === tab ? 'rgba(45,148,105,0.2)' : 'transparent',
                        color: activeTab === tab ? 'var(--brand-light)' : 'var(--muted)',
                      }}>
                {tab === 'fixes' ? 'Priority Fixes' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Sub-component scores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SUB_COMPONENTS.map(sub => {
                  const raw = (result as any)[sub.key] as number
                  const grade = gradeFromScore(raw, sub.max)
                  return (
                    <div key={sub.key} className="card">
                      <div className="flex items-center justify-between mb-3">
                        <div style={{ color: GRADE_COLOR[grade] }}>{sub.icon}</div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: GRADE_BG[grade], color: GRADE_COLOR[grade] }}>
                          {grade === 'needs_work' ? 'Needs Work' : grade.charAt(0).toUpperCase() + grade.slice(1)}
                        </span>
                      </div>
                      <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Sora', color: GRADE_COLOR[grade] }}>
                        {Math.round(raw)}<span className="text-sm font-normal text-white opacity-40">/{sub.max}</span>
                      </div>
                      <div className="text-xs font-medium text-white mb-2">{sub.label}</div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                             style={{ width: `${(raw / sub.max) * 100}%`, backgroundColor: GRADE_COLOR[grade] }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Key metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Google Rating',    value: result.google_rating ? `${result.google_rating}★` : 'N/A',
                    color: result.google_rating && result.google_rating >= 4.0 ? '#22c55e' : '#ef4444' },
                  { label: 'Total Reviews',    value: result.total_google_reviews || '0', color: 'var(--text)' },
                  { label: 'Reviews/Month',    value: result.reviews_per_month ? result.reviews_per_month.toFixed(1) : '0', color: 'var(--text)' },
                  { label: 'Response Rate',    value: result.response_rate ? `${Math.round(result.response_rate)}%` : '0%',
                    color: result.response_rate >= 80 ? '#22c55e' : result.response_rate >= 50 ? '#f59e0b' : '#ef4444' },
                ].map(m => (
                  <div key={m.label} className="card text-center py-4">
                    <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Sora', color: m.color }}>{m.value}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Status flags */}
              <div className="card">
                <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'Sora' }}>Profile Status Checks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'In Local Pack (Maps Top 3)', value: result.local_pack_present },
                    { label: 'Booking Link Active',         value: result.gbp_booking_link },
                    { label: 'Google Posts Active',         value: result.gbp_posts_active },
                    { label: 'Q&A Answered',                value: result.gbp_qa_answered },
                    { label: 'Schema Markup Present',       value: result.schema_markup_present },
                    { label: 'Google Maps Embedded',        value: result.maps_embedded },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <span className="text-sm" style={{ color: 'var(--muted)' }}>{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        {item.value
                          ? <><CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} /><span className="text-xs" style={{ color: '#22c55e' }}>Yes</span></>
                          : <><AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} /><span className="text-xs" style={{ color: '#ef4444' }}>No</span></>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-5">

              {/* GBP Photos */}
              <div className="card">
                <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'Sora' }}>Google Business Profile</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Photos', value: result.gbp_photos_count,
                      status: result.gbp_photos_count >= 20 ? 'strong' : result.gbp_photos_count >= 10 ? 'needs_work' : 'critical',
                      benchmark: '20+ recommended' },
                    { label: 'Citations Found', value: result.citation_count,
                      status: result.citation_count >= 15 ? 'strong' : result.citation_count >= 8 ? 'needs_work' : 'critical',
                      benchmark: '15+ directories' },
                    { label: 'Keyword Rank', value: result.primary_keyword_rank ? `#${result.primary_keyword_rank}` : 'Not ranked',
                      status: !result.primary_keyword_rank ? 'critical' : result.primary_keyword_rank <= 3 ? 'strong' : result.primary_keyword_rank <= 7 ? 'needs_work' : 'critical',
                      benchmark: 'Top 3 = Local Pack' },
                  ].map(m => (
                    <div key={m.label} className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Sora', color: GRADE_COLOR[m.status as keyof typeof GRADE_COLOR] }}>
                        {m.value}
                      </div>
                      <div className="text-xs font-medium text-white mb-0.5">{m.label}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.benchmark}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Directories */}
              {result.missing_directories && result.missing_directories.length > 0 && (
                <div className="card" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Sora' }}>
                      Missing from {result.missing_directories.length} Directories
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_directories.map(dir => (
                      <span key={dir} className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                        {dir}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
                    Each missing directory reduces your citation score and local ranking authority.
                  </p>
                </div>
              )}

              {/* NAP Consistency */}
              <div className="card">
                <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'Sora' }}>NAP Consistency</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                      <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                      <circle cx="30" cy="30" r="24" fill="none" strokeWidth="6" strokeLinecap="round"
                        stroke={getScoreColor(result.nap_consistency_score)}
                        strokeDasharray={`${(result.nap_consistency_score / 100) * (2 * Math.PI * 24)} ${2 * Math.PI * 24}`}
                        className="score-ring" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold" style={{ fontFamily: 'Sora', color: getScoreColor(result.nap_consistency_score) }}>
                        {Math.round(result.nap_consistency_score)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white mb-1">Name · Address · Phone consistency</div>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      Google cross-references your NAP across all directories. Inconsistencies reduce local ranking trust.
                      {result.nap_consistency_score < 80 && ' Fix mismatches across all citations immediately.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPETITORS TAB */}
          {activeTab === 'competitors' && (
            <div className="space-y-4">
              {result.competitor_comparison && result.competitor_comparison.length > 0 ? (
                <>
                  <div className="card" style={{ borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.03)' }}>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                      Benchmarked against your top competitors in <strong className="text-white">{result.suburb}</strong>.
                      Your D1 score: <span style={{ color: scoreColor, fontWeight: 700 }}>{Math.round(score!)}</span>.
                    </p>
                  </div>
                  {result.competitor_comparison.map((c, i) => (
                    <div key={i} className="card flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                           style={{ background: 'rgba(255,255,255,0.08)' }}>#{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{c.name}</div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>{c.suburb}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold" style={{ fontFamily: 'Sora', color: getScoreColor(c.score) }}>
                          {Math.round(c.score)}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>{c.rating}★ · {c.review_count} reviews</div>
                      </div>
                      <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: getScoreColor(c.score) }} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="card text-center py-12" style={{ color: 'var(--muted)' }}>
                  Competitor data will appear after running the audit with a connected Google Places API key.
                </div>
              )}
            </div>
          )}

          {/* FIXES TAB */}
          {activeTab === 'fixes' && (
            <div className="space-y-4">
              <div className="card" style={{ borderColor: 'rgba(232,180,35,0.2)', background: 'rgba(232,180,35,0.03)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Total Revenue Opportunity</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {result.estimated_revenue_impact || 'Fix the items below to unlock your revenue potential.'}
                </p>
              </div>

              {result.priority_fixes && result.priority_fixes.length > 0 ? (
                result.priority_fixes.map((fix, i) => (
                  <div key={i} className="card flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                         style={{ background: i === 0 ? 'rgba(239,68,68,0.15)' : i <= 2 ? 'rgba(245,158,11,0.15)' : 'rgba(45,148,105,0.15)',
                                  color: i === 0 ? '#ef4444' : i <= 2 ? '#f59e0b' : '#22c55e' }}>
                      {i+1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white mb-1">{fix.title}</div>
                      <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                        <span>Impact: <strong style={{ color: 'var(--text)' }}>{fix.impact}</strong></span>
                        <span>Effort: <strong style={{ color: 'var(--text)' }}>{fix.effort}</strong></span>
                        {fix.revenue_impact && (
                          <span style={{ color: '#22c55e' }}>📈 {fix.revenue_impact}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--muted)' }} />
                  </div>
                ))
              ) : (
                <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
                  Run the audit to generate your personalised priority fix list.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

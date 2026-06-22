import { useState } from 'react'
import { BUSINESS_TYPES, DIMENSIONS } from '@/utils/constants'
import { BookOpen, TrendingUp, Filter } from 'lucide-react'

const CASES = [
  { id:1, title:'Auburn Café 3× Reviews in 60 Days', type:'cafe', dim:1, location:'Auburn NSW',
    outcome:'After completing their Google Business Profile and launching a review generation campaign, a local café jumped from 23 to 71 reviews and entered the Local Pack for "café Auburn" — previously held by a competitor.',
    revenue:18, followers:null, timeframe:'60 days', featured:true },
  { id:2, title:'Hair Salon Books Out via Instagram Reels', type:'hair_salon', dim:8, location:'Parramatta NSW',
    outcome:'A Parramatta hair salon with 800 followers went fully booked 3 weeks in advance after posting 3 Reels per week showing transformations. Zero paid ads — pure organic content strategy.',
    revenue:35, followers:420, timeframe:'4 months', featured:true },
  { id:3, title:'NDIS Provider 4× Enquiries with GMB Optimisation', type:'ndis_provider', dim:1, location:'Liverpool NSW',
    outcome:'An NDIS support provider added full services, photos, and weekly posts to Google Business Profile. Monthly enquiries rose from 8 to 34 within 90 days — zero ad spend.',
    revenue:null, followers:null, timeframe:'90 days', featured:false },
  { id:4, title:'Tutoring Centre Fills All Slots via TikTok', type:'tutoring', dim:8, location:'Chatswood NSW',
    outcome:'An HSC tutoring centre began posting study tips and student testimonials on TikTok. Within 6 months all 40 weekly slots were filled with a waiting list — no paid promotion.',
    revenue:45, followers:1200, timeframe:'6 months', featured:true },
  { id:5, title:'Restaurant UberEats Rating 3.9→4.7 = +28% Orders', type:'restaurant', dim:2, location:'Bankstown NSW',
    outcome:'After responding to all negative reviews, updating menu photos, and running a review campaign via WhatsApp, a halal restaurant lifted their UberEats rating and saw monthly delivery orders surge.',
    revenue:28, followers:null, timeframe:'45 days', featured:true },
  { id:6, title:'Beauty Salon Nano-Influencers Drive 60 New Clients', type:'beauty_salon', dim:9, location:'Hurstville NSW',
    outcome:'A beauty salon partnered with 3 local nano-influencers (2K–8K followers) for complimentary treatments in exchange for Instagram posts. Generated 60 new bookings in 6 weeks at a total cost of $450.',
    revenue:22, followers:340, timeframe:'6 weeks', featured:false },
  { id:7, title:'Real Estate Agent Builds Brand on YouTube', type:'real_estate', dim:8, location:'Castle Hill NSW',
    outcome:'A Hills District agent started weekly suburb market update videos on YouTube. Within 8 months, 40% of their leads cited YouTube as their first touchpoint — replacing expensive flyer campaigns.',
    revenue:31, followers:890, timeframe:'8 months', featured:false },
  { id:8, title:'Medical Centre Dominates "GP Near Me" in 3 Suburbs', type:'medical_centre', dim:1, location:'Merrylands NSW',
    outcome:'By fixing their GBP, building citations across 12 directories and generating 80+ reviews, a medical centre moved from position 8 to position 2 in the local pack across three target suburbs.',
    revenue:null, followers:null, timeframe:'3 months', featured:false },
]

export default function SocialProofPage() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [dimFilter, setDimFilter] = useState(0)

  const filtered = CASES.filter(c =>
    (typeFilter === 'all' || c.type === typeFilter) &&
    (dimFilter === 0 || c.dim === dimFilter)
  )
  const featured = filtered.filter(c => c.featured)
  const rest = filtered.filter(c => !c.featured)

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: 'rgba(45,148,105,0.12)' }}>
          <BookOpen className="w-5 h-5" style={{ color: 'var(--brand-light)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora' }}>Social Proof Library</h1>
          <p style={{ color: 'var(--muted)' }}>Real results from Sydney SMBs using the 9-dimension framework. Filter by your business type or dimension.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4" style={{ color: 'var(--muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Filter</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Business Type</label>
            <select className="input-field text-sm py-2" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              {BUSINESS_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Dimension</label>
            <select className="input-field text-sm py-2" value={dimFilter} onChange={e => setDimFilter(Number(e.target.value))}>
              <option value={0}>All Dimensions</option>
              {DIMENSIONS.map(d => <option key={d.number} value={d.number}>D{d.number} — {d.shortName}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-12" style={{ color: 'var(--muted)' }}>No cases match this filter.</div>
      )}

      {featured.length > 0 && (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Featured Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {featured.map(c => <CaseCard key={c.id} c={c} />)}
          </div>
        </>
      )}
      {rest.length > 0 && (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>More Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map(c => <CaseCard key={c.id} c={c} />)}
          </div>
        </>
      )}
    </div>
  )
}

function CaseCard({ c }: { c: typeof CASES[0] }) {
  const dim = DIMENSIONS.find(d => d.number === c.dim)!
  const typeLabel = BUSINESS_TYPES.find(b => b.value === c.type)?.label ?? c.type
  return (
    <div className="card-hover flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${dim.color}15`, color: dim.color }}>
          D{dim.number} {dim.shortName}
        </span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{c.location}</span>
        {c.featured && <span className="ml-auto text-xs font-medium" style={{ color: 'var(--gold)' }}>★</span>}
      </div>
      <div className="text-xs font-medium mb-2" style={{ color: 'var(--brand-light)' }}>{typeLabel}</div>
      <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{c.title}</h3>
      <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: 'var(--muted)' }}>{c.outcome}</p>
      <div className="flex flex-wrap gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        {c.revenue && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
            <span className="text-xs font-bold" style={{ color: '#22c55e' }}>+{c.revenue}% revenue</span>
          </div>
        )}
        {c.followers && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>+{c.followers}% followers</span>
        )}
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>{c.timeframe}</span>
      </div>
    </div>
  )
}

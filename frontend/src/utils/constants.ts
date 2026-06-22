export interface DimensionConfig {
  number: number
  key: string
  name: string
  shortName: string
  tagline: string
  color: string
  route: string
}

export const DIMENSIONS: DimensionConfig[] = [
  { number:1, key:'d1', name:'Local SEO & Presence Intelligence',       shortName:'Local SEO',       tagline:'Get found by buyers right now',          color:'#10b981', route:'/dashboard/d1' },
  { number:2, key:'d2', name:'Reputation & Trust Intelligence',          shortName:'Reputation',      tagline:'Turn reviews into revenue',              color:'#3b82f6', route:'/dashboard/d2' },
  { number:3, key:'d3', name:'Conversion & Monetisation Intelligence',   shortName:'Conversion',      tagline:'Convert attention into bookings',         color:'#f59e0b', route:'/dashboard/d3' },
  { number:4, key:'d4', name:'Paid & Advertising Intelligence',          shortName:'Advertising',     tagline:'Stop wasting ad spend',                  color:'#8b5cf6', route:'/dashboard/d4' },
  { number:5, key:'d5', name:'Audience & Platform Intelligence',         shortName:'Audience',        tagline:'Know exactly who to target',             color:'#06b6d4', route:'/dashboard/d5' },
  { number:6, key:'d6', name:'Discoverability & Content Intelligence',   shortName:'Discoverability', tagline:'Get found everywhere organically',       color:'#ec4899', route:'/dashboard/d6' },
  { number:7, key:'d7', name:'Viral Trend Intelligence',                 shortName:'Viral Trends',    tagline:'Ride trends before competitors',         color:'#f97316', route:'/dashboard/d7' },
  { number:8, key:'d8', name:'Content Strategy & Production',            shortName:'Content',         tagline:'Build a content machine',                color:'#84cc16', route:'/dashboard/d8' },
  { number:9, key:'d9', name:'Influencer & Partnership Intelligence',    shortName:'Influencers',     tagline:'Multiply reach with local voices',       color:'#e11d48', route:'/dashboard/d9' },
]

export const BUSINESS_TYPES = [
  { value:'restaurant',     label:'Restaurant / Takeaway' },
  { value:'cafe',           label:'Café / Coffee Shop' },
  { value:'beauty_salon',   label:'Beauty Salon' },
  { value:'hair_salon',     label:'Hair Salon / Barber' },
  { value:'nail_salon',     label:'Nail Salon' },
  { value:'real_estate',    label:'Real Estate Agency' },
  { value:'medical_centre', label:'Medical Centre / GP' },
  { value:'dental',         label:'Dental Clinic' },
  { value:'physiotherapy',  label:'Physiotherapy / Allied Health' },
  { value:'ndis_provider',  label:'NDIS Provider' },
  { value:'tutoring',       label:'Tutoring Centre' },
  { value:'education',      label:'Education Institution' },
  { value:'grocery',        label:'Grocery / Supermarket' },
  { value:'retail',         label:'Retail Store' },
  { value:'gym_fitness',    label:'Gym / Fitness Studio' },
  { value:'other',          label:'Other Business' },
]

export const SYDNEY_SUBURBS = [
  'Auburn','Parramatta','Bankstown','Liverpool','Penrith','Blacktown',
  'Fairfield','Cabramatta','Merrylands','Granville','Wentworthville',
  'Lakemba','Punchbowl','Greenacre','Condell Park','Campbelltown',
  'Narellan','Ingleburn','Newtown','Leichhardt','Marrickville',
  'Strathfield','Burwood','Bondi','Randwick','Coogee','Surry Hills',
  'Paddington','Chatswood','North Sydney','Hornsby','Gordon','St Leonards',
  'Castle Hill','Baulkham Hills','Kellyville','Rouse Hill',
  'Hurstville','Kogarah','Rockdale','Miranda','Sutherland',
  'Manly','Dee Why','Brookvale','Mona Vale',
  'Sydney CBD','Pyrmont','Ultimo','Chippendale','Haymarket',
].sort()

export function getScoreColor(score: number | null): string {
  if (score === null) return '#4b5563'
  if (score <= 40) return '#ef4444'
  if (score <= 70) return '#f59e0b'
  return '#22c55e'
}

export function getScoreGrade(score: number | null): string {
  if (score === null) return 'Not Audited'
  if (score <= 40) return 'Critical'
  if (score <= 70) return 'Needs Work'
  return 'Strong'
}

export function getBusinessTypeLabel(value: string): string {
  return BUSINESS_TYPES.find(b => b.value === value)?.label ?? value
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Business {
  id: string
  name: string
  business_type: string
  suburb: string
  onboarding_completed: boolean
  instagram_username?: string
  tiktok_username?: string
  gmb_connected: boolean
  youtube_channel_id?: string
}

interface BusinessState {
  activeBusiness: Business | null
  allBusinesses: Business[]
  setActiveBusiness: (b: Business) => void
  setAllBusinesses: (bs: Business[]) => void
  clear: () => void
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      activeBusiness: null,
      allBusinesses: [],
      setActiveBusiness: (b) => set({ activeBusiness: b }),
      setAllBusinesses: (bs) => set({ allBusinesses: bs }),
      clear: () => set({ activeBusiness: null, allBusinesses: [] }),
    }),
    { name: 'sg-business' }
  )
)

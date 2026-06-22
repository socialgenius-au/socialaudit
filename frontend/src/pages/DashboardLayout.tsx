import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useBusinessStore } from '@/store/businessStore'
import { DIMENSIONS } from '@/utils/constants'
import api from '@/utils/api'
import {
  TrendingUp, LayoutDashboard, Map, BookOpen, LogOut, Menu, X,
  MapPin, Star, DollarSign, Megaphone, Users, Search, Flame, Video, Handshake,
} from 'lucide-react'

const D_ICONS: Record<number, React.ReactNode> = {
  1: <MapPin className="w-3.5 h-3.5" />,
  2: <Star className="w-3.5 h-3.5" />,
  3: <DollarSign className="w-3.5 h-3.5" />,
  4: <Megaphone className="w-3.5 h-3.5" />,
  5: <Users className="w-3.5 h-3.5" />,
  6: <Search className="w-3.5 h-3.5" />,
  7: <Flame className="w-3.5 h-3.5" />,
  8: <Video className="w-3.5 h-3.5" />,
  9: <Handshake className="w-3.5 h-3.5" />,
}

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const { activeBusiness, setActiveBusiness, setAllBusinesses } = useBusinessStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    api.get('/api/dashboard/overview').then(({ data }) => {
      if (data.has_business) {
        setActiveBusiness(data.business)
        setAllBusinesses(data.all_businesses)
      }
    }).catch(() => {})
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand)' }}>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-none" style={{ fontFamily: 'Sora' }}>SocialGenius</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontSize: '10px' }}>From Invisible to Unstoppable</div>
          </div>
        </div>
        {activeBusiness && (
          <div className="mt-3 px-2 py-1.5 rounded-lg text-xs truncate" style={{ background: 'rgba(45,148,105,0.08)', color: 'var(--brand-light)' }}>
            📍 {activeBusiness.name}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        <NavLink to="/dashboard" end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive ? 'text-white font-medium' : 'hover:text-white hover:bg-white/5'
            }`
          }
          style={({ isActive }) => isActive ? { background: 'rgba(45,148,105,0.15)', color: 'var(--brand-light)' } : { color: 'var(--muted)' }}>
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span>Overview</span>
        </NavLink>

        <div className="pt-3 pb-1 px-3">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)', fontSize: '10px' }}>
            9 Dimensions
          </span>
        </div>

        {DIMENSIONS.map(d => (
          <NavLink key={d.key} to={d.route}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive ? 'text-white font-medium bg-white/8' : 'hover:text-white hover:bg-white/5'
              }`
            }
            style={{ color: 'var(--muted)' }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="flex items-center gap-1.5">
              {D_ICONS[d.number]}
              <span>D{d.number} {d.shortName}</span>
            </span>
          </NavLink>
        ))}

        <div className="pt-3 pb-1 px-3">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)', fontSize: '10px' }}>
            Strategy
          </span>
        </div>

        <NavLink to="/dashboard/roadmap"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive ? 'font-medium' : 'hover:text-white hover:bg-white/5'
            }`
          }
          style={({ isActive }) => isActive ? { background: 'rgba(232,180,35,0.1)', color: 'var(--gold)' } : { color: 'var(--muted)' }}>
          <Map className="w-4 h-4 flex-shrink-0" />
          <span>Growth Roadmap</span>
        </NavLink>

        <NavLink to="/dashboard/proof"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive ? 'text-white font-medium bg-white/8' : 'hover:text-white hover:bg-white/5'
            }`
          }
          style={{ color: 'var(--muted)' }}>
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span>Social Proof Library</span>
        </NavLink>
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
               style={{ background: 'rgba(45,148,105,0.2)', color: 'var(--brand-light)' }}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{user?.full_name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--muted)', fontSize: '10px' }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="transition-colors" style={{ color: 'var(--muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0" style={{ borderRight: '1px solid var(--border)' }}>
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 flex flex-col z-10" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
            <button className="absolute top-4 right-4" style={{ color: 'var(--muted)' }} onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden flex items-center gap-4 px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--muted)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-white" style={{ fontFamily: 'Sora' }}>SocialGenius</span>
        </div>
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

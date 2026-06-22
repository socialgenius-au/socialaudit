import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import OnboardingPage from '@/pages/OnboardingPage'
import DashboardLayout from '@/pages/DashboardLayout'
import OverviewPage from '@/pages/OverviewPage'
import D1Page from '@/pages/D1Page'
import DimensionStubPage from '@/pages/DimensionStubPage'
import RoadmapPage from '@/pages/RoadmapPage'
import SocialProofPage from '@/pages/SocialProofPage'

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
function Public({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login"    element={<Public><LoginPage /></Public>} />
      <Route path="/register" element={<Public><RegisterPage /></Public>} />
      <Route path="/onboarding" element={<Protected><OnboardingPage /></Protected>} />
      <Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>}>
        <Route index element={<OverviewPage />} />
        <Route path="d1" element={<D1Page />} />
        <Route path="d2" element={<DimensionStubPage num={2} sprint={3} />} />
        <Route path="d3" element={<DimensionStubPage num={3} sprint={4} />} />
        <Route path="d4" element={<DimensionStubPage num={4} sprint={5} />} />
        <Route path="d5" element={<DimensionStubPage num={5} sprint={6} />} />
        <Route path="d6" element={<DimensionStubPage num={6} sprint={7} />} />
        <Route path="d7" element={<DimensionStubPage num={7} sprint={8} />} />
        <Route path="d8" element={<DimensionStubPage num={8} sprint={9} />} />
        <Route path="d9" element={<DimensionStubPage num={9} sprint={10} />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="proof"   element={<SocialProofPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

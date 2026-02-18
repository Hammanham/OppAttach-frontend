import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar   from './components/Sidebar'
import Topbar    from './components/Topbar'
import Landing   from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Login     from './pages/Login'
import Browse    from './pages/Browse'
import Applications from './pages/Applications'
import Saved     from './pages/Saved'
import Profile   from './pages/Profile'
import Messages  from './pages/Messages'
import Notifications from './pages/Notifications'
import CVBuilder from './pages/CVBuilder'
import CareerGuidance from './pages/CareerGuidance'
import Settings  from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  browse:       'Browse Opportunities',
  applications: 'My Applications',
  saved:        'Saved Roles',
  profile:      'My Profile',
  messages:     'Messages',
  notifications:'Notifications',
  cv:           'CV Builder',
  guidance:     'Career Guidance',
  settings:     'Settings',
  admin:        'Admin Dashboard',
}

function AppShell() {
  const [activeNav, setActiveNav]     = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [verifiedMessage, setVerifiedMessage] = useState(null)
  const { user: authUser, logout, refreshUser } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const verified = params.get('verified')
    if (verified === '1') {
      refreshUser?.()
      window.history.replaceState({}, '', window.location.pathname)
      setVerifiedMessage('Email verified successfully.')
      const t = setTimeout(() => setVerifiedMessage(null), 5000)
      return () => clearTimeout(t)
    }
    if (verified === 'error') {
      window.history.replaceState({}, '', window.location.pathname)
      setVerifiedMessage('Verification link invalid or expired.')
      const t = setTimeout(() => setVerifiedMessage(null), 6000)
      return () => clearTimeout(t)
    }
  }, [refreshUser])

  const user = authUser ? {
    name: authUser.name || 'User',
    role: authUser.role === 'admin' ? 'Admin' : authUser.role === 'graduate' ? 'Graduate' : 'Student',
    initials: (authUser.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
  } : { name: 'Guest', role: 'Student', initials: 'GU' }
  const isAdmin = authUser?.role === 'admin'

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard':    return <Dashboard setActiveNav={setActiveNav} />
      case 'browse':       return <Browse />
      case 'applications': return <Applications />
      case 'saved':        return <Saved />
      case 'profile':      return <Profile />
      case 'messages':     return <Messages />
      case 'admin':        return isAdmin ? <AdminDashboard /> : <Dashboard setActiveNav={setActiveNav} />
      case 'notifications': return <Notifications />
      case 'cv':           return <CVBuilder />
      case 'guidance':     return <CareerGuidance />
      case 'settings':     return <Settings />
      default:             return <Dashboard />
    }
  }

  return (
    <div className="shell">
      {verifiedMessage && (
        <div style={{ background: verifiedMessage.includes('success') ? 'var(--green-bg)' : 'var(--amber-bg)', color: verifiedMessage.includes('success') ? 'var(--green)' : 'var(--amber)', padding: '10px 24px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>
          {verifiedMessage}
        </div>
      )}
      {authUser && !authUser.emailVerified && !verifiedMessage && (
        <div style={{ background: 'var(--blue-bg)', color: 'var(--blue)', padding: '10px 24px', textAlign: 'center', fontSize: '14px' }}>
          Please check your email to verify your account. Click the link we sent you.
        </div>
      )}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={logout}
        isAdmin={isAdmin}
      />
      <div className="main">
        <Topbar
          title={PAGE_TITLES[activeNav]}
          onMenuClick={() => setSidebarOpen(o => !o)}
          onNotificationsClick={() => setActiveNav('notifications')}
        />
        {renderPage()}
      </div>
    </div>
  )
}

function Root() {
  const { user, loading } = useAuth()
  const [authView, setAuthView] = useState(null) // null | 'login' | 'register'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text2)' }}>
        Loading…
      </div>
    )
  }

  if (user) return <AppShell />

  if (authView === 'login' || authView === 'register') {
    return (
      <Login
        mode={authView}
        onBack={() => setAuthView(null)}
      />
    )
  }

  return (
    <Landing
      onSignIn={() => setAuthView('login')}
      onGetStarted={() => setAuthView('register')}
    />
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ThemeProvider>
  )
}

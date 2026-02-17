import { useState } from 'react'
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
import AdminDashboard from './pages/AdminDashboard'

const ComingSoon = ({ name }) => (
  <div style={{ padding: '40px 32px', color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif' }}>
    <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)', marginBottom: 8 }}>{name}</h2>
    <p>This section is coming soon.</p>
  </div>
)

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
  const { user: authUser, logout } = useAuth()

  const user = authUser ? {
    name: authUser.name || 'User',
    role: authUser.role === 'admin' ? 'Admin' : 'Student',
    initials: (authUser.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
  } : { name: 'Guest', role: 'Student', initials: 'GU' }
  const isAdmin = authUser?.role === 'admin'

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard':    return <Dashboard />
      case 'browse':       return <Browse />
      case 'applications': return <Applications />
      case 'saved':        return <Saved />
      case 'profile':      return <Profile />
      case 'messages':     return <Messages />
      case 'admin':        return isAdmin ? <AdminDashboard /> : <Dashboard />
      case 'notifications': case 'cv': case 'guidance': case 'settings':
        return <ComingSoon name={PAGE_TITLES[activeNav]} />
      default:            return <Dashboard />
    }
  }

  return (
    <div className="shell">
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

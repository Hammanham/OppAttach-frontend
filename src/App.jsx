import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Sidebar   from './components/Sidebar'
import Topbar    from './components/Topbar'
import Landing   from './pages/Landing'
import Dashboard from './pages/Dashboard'

// Placeholder pages — swap these out with your real page components
const PlaceholderPage = ({ name }) => (
  <div style={{ padding: '40px 32px', color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif' }}>
    <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)', marginBottom: 8 }}>{name}</h2>
    <p>This page is ready to be built. Connect it to your backend via <code>src/services/api.js</code>.</p>
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
}

function AppShell() {
  const [activeNav, setActiveNav]     = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Minimal mock user — replace with useAuth() once backend is wired
  const user = { name: 'Amara Kamara', role: 'Student · Year 3', initials: 'AK' }

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard': return <Dashboard />
      default:          return <PlaceholderPage name={PAGE_TITLES[activeNav]} />
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
  // Controls whether user sees landing page or the app shell.
  // Replace this with real auth logic from AuthContext:
  //   const { user } = useAuth()
  //   if (user) return <AppShell />
  //   return <Landing onEnterApp={() => {}} />
  const [inApp, setInApp] = useState(false)

  if (inApp) return <AppShell />
  return <Landing onEnterApp={() => setInApp(true)} />
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

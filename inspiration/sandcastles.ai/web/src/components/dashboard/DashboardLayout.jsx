import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  
  const topNavItems = [
    { name: 'Home', path: '/dashboard', icon: '🏠' },
    { name: 'Channels', path: '/dashboard/channels', icon: '👥' },
    { name: 'Videos', path: '/dashboard/videos', icon: '🎥' },
    { name: 'Scripts', path: '/dashboard/writer', icon: '📝' },
    { name: 'Projects', path: '/dashboard/projects', icon: '📁' },
    { name: 'Vault', path: '/dashboard/vault', icon: '🧊' },
    { name: 'Exports', path: '/dashboard/exports', icon: '📤' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  const bottomNavItems = [
    { name: 'Changelog', path: '#', icon: '📓' },
    { name: 'Share feedback', path: '#', icon: '📣' },
    { name: 'Get support', path: '#', icon: '❓' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000000', color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        borderRight: '1px solid #1A1A1A', 
        position: 'fixed', 
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        background: '#0B0B0B'
      }}>
        {/* Logo Area */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div className="font-bold text-lg">Sandcastles</div>
          <button style={{ color: 'var(--text-secondary)', padding: '4px' }}>{'<'}</button>
        </div>
        
        {/* Top Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {topNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard');
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: isActive ? '#1F1F1F' : 'transparent',
                  color: isActive ? '#fff' : '#A1A1AA',
                  fontWeight: isActive ? '500' : '400',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '1px solid #1A1A1A', paddingTop: '1rem' }}>
          {bottomNavItems.map((item) => (
            <a 
              key={item.name} 
              href={item.path} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                color: '#A1A1AA',
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.name}
            </a>
          ))}
          <button style={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: '0.75rem',
             padding: '0.5rem 0.75rem',
             borderRadius: '8px',
             color: '#EF4444', 
             fontSize: '0.9rem',
             background: 'transparent',
             border: 'none',
             cursor: 'pointer',
             textAlign: 'left',
             width: '100%'
          }}>
            <span style={{ fontSize: '1.1rem' }}>🚪</span>
            Sign out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#A1A1AA' }}>
             <span style={{ fontSize: '1.2rem' }}>▦</span>
             <span style={{ fontSize: '0.9rem' }}>app.sandcastles.ai</span>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', border: '1px solid #555' }}></div>
        </header>

        {children}
      </main>
    </div>
  )
}

import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Watchlists', path: '/dashboard/watchlists', icon: '👀' },
    { name: 'Video Analysis', path: '/dashboard/analysis', icon: '📉' },
    { name: 'Script Writer', path: '/dashboard/writer', icon: '✍️' },
    { name: 'The Vault', path: '/dashboard/vault', icon: '🔒' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '240px', 
        borderRight: '1px solid var(--border-color)', 
        position: 'fixed', 
        height: '100vh', 
        padding: '1.5rem',
        background: 'var(--surface-color)'
      }}>
        <div className="mb-8 font-bold text-xl px-2">Sandcastles.ai</div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: isActive ? 'var(--surface-hover)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '500' : '400',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                }}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '0.875rem'
          }}>
            <div className="text-secondary mb-2">Credits</div>
            <div className="font-bold text-xl mb-1">85 <span className="text-sm font-normal text-secondary">/ 100</span></div>
            <div style={{ height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'var(--accent-color)' }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 className="text-2xl font-bold">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Feedback</button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333' }}></div>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}

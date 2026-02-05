import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Users, 
  Video, 
  PenTool, 
  Folder, 
  Archive, 
  Download, 
  Settings,
  History,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Rocket
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  
  const topNavItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutGrid },
    { name: 'Channels', path: '/dashboard/channels', icon: Users },
    { name: 'Videos', path: '/dashboard/videos', icon: Video },
    { name: 'Scripts', path: '/dashboard/writer', icon: PenTool },
    { name: 'Scripts Copy', path: '/dashboard/writer-copy', icon: PenTool },
    { name: 'Projects', path: '/dashboard/projects', icon: Folder },
    { name: 'Vault', path: '/dashboard/vault', icon: Archive },
    { name: 'Exports', path: '/dashboard/exports', icon: Download },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const bottomNavItems = [
    { name: 'Changelog', path: '#', icon: History },
    { name: 'Share feedback', path: '#', icon: MessageSquare },
    { name: 'Get support', path: '#', icon: HelpCircle },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        borderRight: '1px solid var(--border-color)', 
        position: 'fixed', 
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        background: 'var(--surface-color)', 
        zIndex: 50
      }}>
        {/* Logo Area */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <div style={{ padding: '0.35rem', background: 'var(--text-primary)', borderRadius: '6px', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bg-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
             </div>
             <div className="font-bold text-lg" style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Sandcastles</div>
          </div>
          <button style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <ChevronLeft size={18} />
          </button>
        </div>
        
        {/* Top Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1, overflowY: 'auto' }}>
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
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  background: isActive ? 'var(--surface-hover)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '500' : '400',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s, background 0.2s'
                }}
                onMouseEnter={(e) => {
                    if(!isActive) {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.background = 'var(--surface-hover)';
                    }
                }}
                onMouseLeave={(e) => {
                    if(!isActive) {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.background = 'transparent';
                    }
                }}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? 'var(--primary-color)' : 'currentColor' }} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem' }}>
            <ThemeToggle />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
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
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => {
                   e.currentTarget.style.color = 'var(--text-primary)';
                   e.currentTarget.style.background = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                   e.currentTarget.style.color = 'var(--text-secondary)';
                   e.currentTarget.style.background = 'transparent';
                }}
              >
                <item.icon size={16} />
                {item.name}
              </a>
            ))}
            <button style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '0.75rem',
               padding: '0.5rem 0.75rem',
               borderRadius: '8px',
               color: '#DC2626', 
               fontSize: '0.85rem',
               background: 'transparent',
               border: 'none',
               cursor: 'pointer',
               textAlign: 'left',
               width: '100%',
               marginTop: '0.25rem'
            }}>
              <LogOut size={16} />
              Sign out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '3rem 4rem', maxWidth: '1440px' }}>
        {children}
      </main>
    </div>
  )
}


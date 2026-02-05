import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Users, Video, PenTool, ArrowRight } from 'lucide-react';

export default function DashboardHome() {
  const actions = [
    { 
      title: "Track Channels", 
      icon: Users, 
      color: "#3B82F6", // Blue
      bg: "rgba(59, 130, 246, 0.1)",
      link: "/dashboard/channels"
    },
    { 
      title: "Discover Videos", 
      icon: Video, 
      color: "#10B981", // Green
      bg: "rgba(16, 185, 129, 0.1)",
      link: "/dashboard/videos"
    },
    { 
      title: "Write Scripts", 
      icon: PenTool, 
      color: "#A855F7", // Purple
      bg: "rgba(168, 85, 247, 0.1)",
      link: "/dashboard/writer"
    }
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', paddingTop: '8vh' }}>
        <div className="mb-2 text-secondary" style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>👋 Hello, Creator</div>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '4rem', letterSpacing: '-0.03em', lineHeight: '1.1', color: 'var(--text-primary)' }}>
          What do you want to do today?
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {actions.map((action, i) => (
            <Link 
              key={i} 
              to={action.link}
              style={{ 
                background: 'var(--surface-color)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '20px', 
                padding: '2rem', 
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '220px',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--surface-color)';
              }}
            >
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: action.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: action.color,
                marginBottom: '1rem'
              }}>
                <action.icon size={28} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', letterSpacing: '-0.02em', margin: 0 }}>{action.title}</h3>
                <div style={{ color: 'var(--text-secondary)' }}>
                   <ArrowRight size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

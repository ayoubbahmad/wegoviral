import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function DashboardHome() {
  const actions = [
    { 
      title: "Track your favorite channels", 
      subtitle: "To learn from their success.", 
      icon: "👥", 
      color: "#3B82F6", // Blue
      bg: "rgba(59, 130, 246, 0.1)",
      link: "/dashboard/channels"
    },
    { 
      title: "Discover viral videos", 
      subtitle: "And extract winning patterns.", 
      icon: "🎥", 
      color: "#10B981", // Green
      bg: "rgba(16, 185, 129, 0.1)",
      link: "/dashboard/videos"
    },
    { 
      title: "Write winning scripts", 
      subtitle: "Using proven hooks and styles.", 
      icon: "✍️", 
      color: "#8B5CF6", // Purple
      bg: "rgba(139, 92, 246, 0.1)",
      link: "/dashboard/writer"
    }
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
        <div className="mb-2 text-secondary" style={{ fontSize: '1.1rem', fontWeight: '500' }}>👋 Hello, Creator</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '4rem', letterSpacing: '-0.02em' }}>
          What do you want to do today?
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {actions.map((action, i) => (
            <Link 
              key={i} 
              to={action.link}
              style={{ 
                background: '#0B0B0B', 
                border: '1px solid #1A1A1A', 
                borderRadius: '16px', 
                padding: '2.5rem 2rem', 
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, border-color 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = '#1A1A1A';
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: action.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: action.color,
                marginBottom: '0.5rem'
              }}>
                {action.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{action.title}</h3>
                <p style={{ color: '#A1A1AA', fontSize: '0.95rem', lineHeight: '1.5' }}>{action.subtitle}</p>
              </div>
              <div style={{ 
                position: 'absolute', 
                bottom: '2.5rem', 
                right: '2rem', 
                fontSize: '1.25rem', 
                color: '#333' 
              }}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

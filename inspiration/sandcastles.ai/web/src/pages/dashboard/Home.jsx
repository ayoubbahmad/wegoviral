import DashboardLayout from '../components/dashboard/DashboardLayout'

export default function DashboardHome() {
  return (
    <DashboardLayout>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem' 
      }}>
        {[
          { label: 'Outliers Found', val: '12', change: '+2 today' },
          { label: 'Scripts Generated', val: '5', change: '' },
          { label: 'Watchlist Growth', val: '+24%', change: 'Last 7 days' },
        ].map((stat, i) => (
          <div key={i} style={{ 
            padding: '1.5rem', 
            background: 'var(--surface-color)', 
            border: '1px solid var(--border-color)',
            borderRadius: '16px' 
          }}>
            <div className="text-secondary text-sm mb-2">{stat.label}</div>
            <div className="text-3xl font-bold">{stat.val}</div>
            {stat.change && <div className="text-xs text-accent mt-1" style={{ color: 'var(--accent-color)' }}>{stat.change}</div>}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl mb-4">Recent Outliers</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {[1, 2, 3].map((_, i) => (
          <div key={i} style={{ 
            aspectRatio: '9/16', 
            background: 'var(--surface-color)', 
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{ 
               position: 'absolute', 
               top: '1rem', 
               right: '1rem', 
               background: 'rgba(5,5,5,0.8)', 
               padding: '0.25rem 0.75rem', 
               borderRadius: '99px', 
               fontSize: '0.75rem',
               border: '1px solid rgba(255,255,255,0.1)'
             }}>
               10x Outlier
             </div>
             <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
               <div className="text-sm font-bold mb-1">How to scale 0-10k...</div>
               <div className="text-xs text-secondary">Alex Hormozi • 2.4M Views</div>
             </div>
          </div>
        ))}
        
        <div style={{ 
           aspectRatio: '9/16', 
           border: '2px dashed var(--border-color)', 
           borderRadius: '12px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           color: 'var(--text-secondary)',
           flexDirection: 'column',
           gap: '0.5rem',
           cursor: 'pointer'
        }}>
          <span style={{ fontSize: '2rem' }}>+</span>
          <span>Find New Outliers</span>
        </div>
      </div>
    </DashboardLayout>
  )
}

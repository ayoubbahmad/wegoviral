import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function Analysis() {
  return (
    <DashboardLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: 'calc(100vh - 140px)' }}>
        
        {/* Left Column: Video & Stats */}
        <div style={{ overflowY: 'auto' }}>
          {/* Video Player Placeholder */}
          <div style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            background: '#000', 
            borderRadius: '16px', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '3rem', opacity: 0.5 }}>▶</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div className="text-secondary text-sm">Views</div>
              <div className="text-2xl font-bold">2.4M</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div className="text-secondary text-sm">Engagement</div>
              <div className="text-2xl font-bold">8.5%</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-color)' }}>
              <div className="text-secondary text-sm" style={{ color: 'var(--accent-color)' }}>Outlier Score</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>10.2x</div>
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 className="text-lg font-bold mb-4">Retention Graph</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  background: i < 10 ? 'var(--accent-color)' : '#333', 
                  height: `${Math.random() * 60 + 20}%`,
                  borderRadius: '2px 2px 0 0',
                  opacity: i < 10 ? 1 : 0.5
                }}></div>
              ))}
            </div>
            <p className="text-sm text-secondary mt-4">
              <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>The Hook:</span> 85% of viewers stayed past the first 3 seconds. The visual change at 0:02 was critical.
            </p>
          </div>
        </div>

        {/* Right Column: Transcript & AI */}
        <div style={{ background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
             <div style={{ display: 'flex', gap: '1rem' }}>
               <button style={{ fontWeight: '600', borderBottom: '2px solid var(--accent-color)', paddingBottom: '0.25rem' }}>Transcript</button>
               <button style={{ color: 'var(--text-secondary)' }}>Notes</button>
             </div>
          </div>
          
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <p className="mb-4"><span style={{ color: '#fff' }}>0:00</span> "If I had to start over today, I wouldn't build a product first."</p>
            <p className="mb-4"><span style={{ color: '#fff' }}>0:05</span> "Instead, I'd focus on building an audience. Here is exactly why..."</p>
            <p className="mb-4"><span style={{ color: '#fff' }}>0:12</span> "See, most people think you need a great idea. But ideas are cheap. Attention is the new oil."</p>
            <p className="mb-4"><span style={{ color: '#fff' }}>0:18</span> "So step one is to pick a platform. Just one. Don't try to be everywhere."</p>
          </div>

          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>✨ Remix this Script</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

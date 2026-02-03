import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function Writer() {
  return (
    <DashboardLayout>
       <div style={{ maxWidth: '800px', margin: '0 auto' }}>
         <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 className="text-2xl font-bold">New Script</h2>
           <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Save Draft</button>
             <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Export</button>
           </div>
         </div>

         <div style={{ background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', minHeight: '600px' }}>
           <input 
             type="text" 
             placeholder="Untitled Script" 
             style={{ 
               width: '100%', 
               background: 'transparent', 
               border: 'none', 
               fontSize: '2rem', 
               fontWeight: 'bold', 
               color: '#fff',
               marginBottom: '2rem',
               outline: 'none'
             }} 
            />

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem' }}>Context: Educational</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem' }}>Tone: Punchy</span>
            </div>

            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <p className="mb-6">
                <strong style={{ color: 'var(--accent-color)' }}>[HOOK - 0:00-0:03]</strong><br/>
                Stop scrolling if you want to grow your brand in 2024.
              </p>
              
              <p className="mb-6">
                <strong style={{ color: '#fff' }}>[BODY - 0:03-0:45]</strong><br/>
                The algorithm has changed. It doesn't care about your hashtags anymore. It cares about retention.<br/><br/>
                I analyzed 10,000 viral videos, and they all have one thing in common: A pattern interrupt every 5 seconds.<br/><br/>
                This means changing the angle, adding text, or moving your hands.
              </p>

              <p className="mb-6">
                <strong style={{ color: 'var(--accent-color)' }}>[CTA - 0:45-1:00]</strong><br/>
                Try this on your next video and tell me what happens. Follow for more growth tips.
              </p>
            </div>
         </div>

         <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
           <h4 className="font-bold mb-2 icon-sparkle">✨ AI Suggestion</h4>
           <p className="text-sm text-secondary">Consider making the Hook more actionable. Instead of "Stop scrolling", try "Here is the exact framework I used to get 1M views".</p>
         </div>
       </div>
    </DashboardLayout>
  )
}

export default function Hero() {
  return (
    <section className="section" style={{ textAlign: 'center', padding: '10rem 0 4rem' }}>
      <div className="container">
        <div style={{ 
          display: 'inline-block', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '99px', 
          background: 'rgba(139, 92, 246, 0.1)', 
          color: 'var(--accent-color)',
          fontSize: '0.875rem',
          fontWeight: '500',
          marginBottom: '1.5rem',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          ✨ New: AI Script Application
        </div>
        <h1 className="text-5xl mb-4" style={{ maxWidth: '900px', margin: '0 auto 1.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
          Create viral short-form videos <br />
          <span style={{ 
            background: 'linear-gradient(to right, #fff, #999)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>in seconds not hours</span>
        </h1>
        <p className="text-lg text-secondary mb-8" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
          Stop guessing. Use data to find out what works and AI to remix it. The unfair advantage for modern creators.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
          <a href="#" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>Start 7-Day Free Trial</a>
          <a href="#features" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>See Features</a>
        </div>
        
        {/* Placeholder for Dashboard UI Screenshot */}
        <div style={{ 
          maxWidth: '1100px', 
          aspectRatio: '16/9', 
          margin: '0 auto', 
          background: 'linear-gradient(180deg, #1A1A1E 0%, #050505 100%)', 
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 0 100px rgba(139, 92, 246, 0.1)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <p>Dashboard UI Preview</p>
        </div>
      </div>
    </section>
  )
}

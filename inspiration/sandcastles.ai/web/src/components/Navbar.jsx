export default function Navbar() {
  return (
    <nav className="navbar" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '1.25rem 0', 
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      backgroundColor: 'rgba(5,5,5,0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 50
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.03em' }}>
          Sandcastles.ai
        </div>
        <div className="links" style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <a href="#features" style={{ color: 'inherit' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'inherit' }}>How it works</a>
          <a href="#pricing" style={{ color: 'inherit' }}>Pricing</a>
        </div>
        <div className="actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Log in</a>
          <a href="#" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>Start Free Trial</a>
        </div>
      </div>
    </nav>
  )
}

import { Link } from 'react-router-dom';

export default function Trial() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '480px', 
        padding: '2.5rem', 
        background: 'var(--surface-color)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)' 
      }}>
        <div className="text-center mb-8">
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'block', marginBottom: '1.5rem' }}>
            Sandcastles.ai
          </Link>
          <div style={{ 
            display: 'inline-block', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '99px', 
            background: 'rgba(139, 92, 246, 0.1)', 
            color: 'var(--accent-color)',
            fontSize: '0.75rem',
            fontWeight: '600',
            marginBottom: '1rem',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            7-DAY FREE TRIAL
          </div>
          <h1 className="text-2xl text-center">Start your 7-day free trial</h1>
          <p className="text-secondary text-sm mt-2">No credit card required. Cancel anytime.</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="text-sm text-secondary mb-2" style={{ display: 'block' }}>Full Name</label>
            <input type="text" placeholder="John Doe" style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-color)', 
              color: 'white',
              boxSizing: 'border-box'
            }} />
          </div>
          <div>
            <label className="text-sm text-secondary mb-2" style={{ display: 'block' }}>Email</label>
            <input type="email" placeholder="you@example.com" style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-color)', 
              color: 'white',
              boxSizing: 'border-box'
            }} />
          </div>
          <div>
            <label className="text-sm text-secondary mb-2" style={{ display: 'block' }}>Password</label>
            <input type="password" placeholder="Create a password" style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-color)', 
              color: 'white',
              boxSizing: 'border-box'
            }} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create Account</button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}

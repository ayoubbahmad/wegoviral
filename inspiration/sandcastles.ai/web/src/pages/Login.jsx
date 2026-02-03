import { Link } from 'react-router-dom';

export default function Login() {
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
        maxWidth: '400px', 
        padding: '2rem', 
        background: 'var(--surface-color)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)' 
      }}>
        <div className="text-center mb-8">
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'block', marginBottom: '1.5rem' }}>
            Sandcastles.ai
          </Link>
          <h1 className="text-2xl">Welcome back</h1>
          <p className="text-secondary text-sm">Sign in to your account</p>
        </div>

        <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Login');
          
          // Navigate to dashboard
          window.location.href = '/dashboard';
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <input type="password" placeholder="••••••••" style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-color)', 
              color: 'white',
              boxSizing: 'border-box'
            }} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Sign In</button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Don't have an account? <Link to="/trial" style={{ color: 'var(--text-primary)' }}>Start Free Trial</Link>
        </p>
      </div>
    </div>
  )
}

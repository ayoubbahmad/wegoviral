export default function Footer() {
  return (
    <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="text-xl font-bold mb-4">Sandcastles.ai</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Twitter</a>
          <a href="#">Contact</a>
        </div>
        <p className="text-sm text-secondary">© 2026 Sandcastles Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function Pricing() {
  const plans = [
    { name: "Starter", price: "$29", features: ["1 Watchlist", "20 Credits/mo", "Basic Analysis"] },
    { name: "Pro", price: "$49", features: ["Unlimited Watchlists", "100 Credits/mo", "Deep Analysis", "AI Script Writer"], active: true },
    { name: "Agency", price: "$199", features: ["Unlimited Projects", "500 Credits/mo", "Priority Support", "API Access"] }
  ];

  return (
    <section id="pricing" className="section">
      <div className="container">
        <h2 className="text-4xl text-center mb-8">Simple Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ 
              padding: '2.5rem', 
              background: plan.active ? 'var(--surface-hover)' : 'var(--surface-color)', 
              borderRadius: '24px', 
              border: plan.active ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
              position: 'relative',
              transform: plan.active ? 'scale(1.05)' : 'none'
            }}>
              {plan.active && (
                <div style={{ 
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', 
                  background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '0.25rem 1rem', 
                  borderRadius: '99px', fontSize: '0.875rem', fontWeight: '600'
                }}>
                  Most Popular
                </div>
              )}
              <h3 className="text-xl mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg text-secondary font-normal">/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem' }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-color)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={plan.active ? "btn btn-primary" : "btn btn-outline"} style={{ width: '100%' }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

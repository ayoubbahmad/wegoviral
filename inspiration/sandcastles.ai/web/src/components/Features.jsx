export default function Features() {
  const features = [
    {
      title: "Outlier Discovery",
      desc: "Stop scrolling aimlessly. Find videos that are statistically proven to work in your niche.",
      icon: "🔍"
    },
    {
      title: "Transcript Analysis",
      desc: "Get instant transcripts and breakdown of hooks, body, and CTA for any viral video.",
      icon: "📝"
    },
    {
      title: "AI Script Remixing",
      desc: "Don't copy. Remix. Use our AI to rewriting winning concepts into your own unique style.",
      icon: "✨"
    },
    {
      title: "The Vault",
      desc: "Build your personal library of winning hooks and ideas. Never run out of content ideas.",
      icon: "🔒"
    }
  ];

  return (
    <section id="features" className="section" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-4xl mb-4">Everything you need to go viral</h2>
          <p className="text-secondary text-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
            A complete suite of tools designed to take the guesswork out of content creation.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          marginTop: '4rem'
        }}>
          {features.map((f, i) => (
            <div key={i} style={{ 
              padding: '2rem', 
              background: 'var(--surface-color)', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 className="text-xl mb-2">{f.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

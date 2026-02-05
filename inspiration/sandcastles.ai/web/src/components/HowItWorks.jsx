import { useState } from 'react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    {
      title: "1. Build Watchlists",
      heading: "Track your competitors",
      desc: "Create custom watchlists of the top creators in your niche. Monitor their performance and spot trends before they go mainstream."
    },
    {
      title: "2. Find Outliers",
      heading: "Spot the hidden gems",
      desc: "Our algorithm scans millions of videos to find 'outliers'—videos that generated 5x-10x more views than the channel average."
    },
    {
      title: "3. Analyze",
      heading: "Understand the 'Why'",
      desc: "Deconstruct the video. See the retention graph, read the transcript, and identify the exact hook that grabbed attention."
    },
    {
      title: "4. Remix",
      heading: "Write winning scripts",
      desc: "Use our AI to rewrite the proven concept. Keep the structure that worked, but make the content 100% yours."
    }
  ];

  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2 className="text-4xl text-center mb-8">How it works</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            background: 'var(--surface-color)',
            padding: '0.5rem',
            borderRadius: '99px',
            border: '1px solid var(--border-color)'
          }}>
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '99px',
                  background: activeTab === index ? 'var(--surface-hover)' : 'transparent',
                  color: activeTab === index ? 'var(--bg-color)' : 'var(--text-secondary)',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {step.title}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ 
            width: '100%', 
            maxWidth: '900px', 
            background: 'var(--surface-color)', 
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '4rem',
            textAlign: 'center',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h3 className="text-2xl mb-4">{steps[activeTab].heading}</h3>
            <p className="text-secondary text-lg" style={{ maxWidth: '600px' }}>{steps[activeTab].desc}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

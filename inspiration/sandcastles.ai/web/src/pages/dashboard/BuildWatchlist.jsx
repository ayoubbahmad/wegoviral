import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Sparkles, Users, Paperclip, Search, ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';

export default function BuildWatchlist() {
  const [activeTab, setActiveTab] = useState('niche');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const platforms = [
    { name: 'YouTube', icon: '▶', color: '#FF0000' },
    { name: 'TikTok', icon: '♪', color: '#fff' },
    { name: 'Instagram', icon: '📸', color: '#E4405F' },
  ];

  const niches = [
    "Arts & Photography", "Autos & Vehicles", "Beauty & Skincare", "Business & Entrepreneurship",
    "Career & Professional Development", "Comedy", "DIY & Crafts", "Education",
    "Entertainment & Pop Culture", "Fashion & Style", "Finance & Investing", "Food & Cooking",
    "Gaming", "Health & Fitness", "Home & Interior Design", "Lifestyle & Vlogging",
    "Music", "News & Politics", "Parenting & Family", "Pets & Animals",
    "Personal Development & Productivity", "Real Estate & Property", "Relationships & Dating",
    "Science & Technology", "Sports", "Sustainability & Environment"
  ];

  const sizes = [
    { label: "Nano", desc: "< 10k followers" },
    { label: "Micro", desc: "10k - 50k followers" },
    { label: "Small", desc: "50k - 250k followers" },
    { label: "Medium", desc: "250k - 1M followers" },
    { label: "Large", desc: "1M - 5M followers" },
    { label: "Mega", desc: "> 5M followers" },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Build your watchlist</h1>
          <p style={{ color: '#71717A', fontSize: '0.9rem' }}>Find the best channels to use as inspiration for your content</p>
        </div>

        {/* Main Tabs */}
        <div style={{ 
          display: 'flex', 
          background: '#0B0B0B', 
          border: '1px solid #1A1A1A', 
          borderRadius: '10px', 
          padding: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          {[
            { id: 'niche', name: 'Describe your Niche', icon: Sparkles },
            { id: 'similar', name: 'Similar to Channel', icon: Users },
            { id: 'manual', name: 'Manual', icon: Paperclip },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.6rem',
                padding: '0.6rem',
                borderRadius: '8px',
                background: activeTab === tab.id ? '#1A1A1A' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#71717A',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={16} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ 
          background: '#0B0B0B', 
          border: '1px solid #1A1A1A', 
          borderRadius: '16px', 
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <textarea 
            placeholder="Describe the content you want to make"
            style={{ 
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              color: '#fff', 
              fontSize: '1rem', 
              minHeight: '120px', 
              outline: 'none',
              resize: 'none',
              marginBottom: '1.5rem'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
              <span style={{ color: '#52525B', fontSize: '0.85rem', alignSelf: 'center' }}>Filter suggestions by:</span>
              
              {/* Niche Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNicheDropdown(!showNicheDropdown)}
                  style={{ 
                    background: '#1A1A1A', border: '1px solid #27272A', borderRadius: '8px', padding: '0.4rem 0.75rem', 
                    color: '#A1A1AA', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' 
                  }}
                >
                  Niche <ChevronDown size={14} />
                </button>
                {showNicheDropdown && (
                  <div style={{ 
                    position: 'absolute', top: '110%', left: 0, width: '240px', maxHeight: '300px', overflowY: 'auto',
                    background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '10px', zIndex: 100, padding: '0.5rem'
                  }}>
                    {niches.map(n => (
                      <div key={n} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#A1A1AA', cursor: 'pointer', borderRadius: '6px' }} 
                        onMouseEnter={(e) => e.currentTarget.style.background = '#121212'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                  style={{ 
                    background: '#1A1A1A', border: '1px solid #27272A', borderRadius: '8px', padding: '0.4rem 0.75rem', 
                    color: '#A1A1AA', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' 
                  }}
                >
                  Platform <ChevronDown size={14} />
                </button>
                {showPlatformDropdown && (
                  <div style={{ 
                    position: 'absolute', top: '110%', left: 0, width: '160px',
                    background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '10px', zIndex: 100, padding: '0.5rem'
                  }}>
                    {platforms.map(p => (
                      <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: '#fff', cursor: 'pointer', borderRadius: '6px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#121212'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{p.icon}</div>
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Size Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                  style={{ 
                    background: '#1A1A1A', border: '1px solid #27272A', borderRadius: '8px', padding: '0.4rem 0.75rem', 
                    color: '#A1A1AA', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' 
                  }}
                >
                  Account size <ChevronDown size={14} />
                </button>
                {showSizeDropdown && (
                  <div style={{ 
                    position: 'absolute', top: '110%', left: 0, width: '220px',
                    background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '10px', zIndex: 100, padding: '0.5rem'
                  }}>
                    {sizes.map(s => (
                      <div key={s.label} style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', borderRadius: '6px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#121212'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontSize: '0.85rem', color: '#fff' }}>{s.label} <span style={{ color: '#52525B', fontSize: '0.8rem', marginLeft: '4px' }}>{s.desc}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button style={{ 
              background: '#2563EB', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '8px', 
              fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' 
            }}>
              Search <span style={{ opacity: 0.6 }}>↵</span>
            </button>
          </div>
        </div>

        {/* Suggested vs Included */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Suggested */}
          <div style={{ background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Suggested</span>
              <span style={{ fontSize: '0.75rem', color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>0 channels</span>
            </div>
            <div style={{ flex: 1, minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525B', fontSize: '0.85rem' }}>
              Use the textbox above to get suggestions
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>Load more</button>
              <button style={{ background: 'transparent', border: 'none', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>Add all to watchlist</button>
            </div>
          </div>

          {/* Included */}
          <div style={{ background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Included</span>
              <span style={{ fontSize: '0.75rem', color: '#22C55E', background: 'rgba(34, 197, 94, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>0 channels</span>
            </div>
            <div style={{ flex: 1, minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525B', fontSize: '0.85rem' }}>
              No channels added yet
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>Remove all</button>
              <button style={{ background: '#2563EB', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: '500', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Save watchlist</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Sparkles, Users, Paperclip, Search, ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';

const actionButtonStyle = {
  background: '#2563EB', color: 'var(--text-primary)', padding: '0.5rem 1.25rem', borderRadius: '8px', 
  fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem',
  border: 'none', cursor: 'pointer'
};

const Dropdown = ({ label, options, isOpen, setIsOpen, isPlatform, isSize }) => (
  <div style={{ position: 'relative' }}>
    <button 
      onClick={() => setIsOpen(!isOpen)}
      style={{ 
        background: 'var(--border-color)', border: '1px solid var(--surface-hover)', borderRadius: '8px', padding: '0.4rem 0.75rem', 
        color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
      }}
    >
      {label} <ChevronDown size={14} />
    </button>
    {isOpen && (
      <div style={{ 
        position: 'absolute', top: '110%', left: 0, width: isSize ? '220px' : isPlatform ? '160px' : '240px', 
        maxHeight: '300px', overflowY: 'auto',
        background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '10px', zIndex: 100, padding: '0.5rem'
      }}>
        {options.map((opt, i) => (
          <div key={i} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: isPlatform || isSize ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', borderRadius: '6px' }} 
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {isPlatform ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{opt.icon}</div>
                 {opt.name}
               </div>
            ) : isSize ? (
               <div>{opt.label} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '4px' }}>{opt.desc}</span></div>
            ) : opt}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function BuildWatchlist() {
  const [activeTab, setActiveTab] = useState('niche');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const platforms = [
    { name: 'YouTube', icon: '▶', color: '#FF0000' },
    { name: 'TikTok', icon: '♪', color: 'var(--text-primary)' },
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Find the best channels to use as inspiration for your content</p>
        </div>

        {/* Main Tabs */}
        <div style={{ 
          display: 'flex', 
          background: 'var(--surface-color)', 
          border: '1px solid var(--border-color)', 
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
                background: activeTab === tab.id ? 'var(--border-color)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
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
          background: 'var(--surface-color)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          padding: '1.5rem',
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          {activeTab === 'niche' && (
            <>
              <textarea 
                placeholder="Describe the content you want to make"
                style={{ 
                  width: '100%', 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-primary)', 
                  fontSize: '1rem', 
                  minHeight: '120px', 
                  outline: 'none',
                  resize: 'none',
                  marginBottom: '1.5rem'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', alignSelf: 'center' }}>Filter suggestions by:</span>
                  <Dropdown label="Niche" options={niches} isOpen={showNicheDropdown} setIsOpen={setShowNicheDropdown} />
                  <Dropdown label="Platform" options={platforms} isOpen={showPlatformDropdown} setIsOpen={setShowPlatformDropdown} isPlatform />
                  <Dropdown label="Account size" options={sizes} isOpen={showSizeDropdown} setIsOpen={setShowSizeDropdown} isSize />
                </div>
                <button style={actionButtonStyle}>
                  Search <span style={{ opacity: 0.6 }}>↵</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'similar' && (
            <>
              <div style={{ 
                background: 'var(--surface-color)', 
                border: '1px solid var(--surface-hover)', 
                borderRadius: '10px', 
                padding: '0.75rem 1rem', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <input 
                  type="text" 
                  placeholder="Search for a channel by handle" 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', width: '100%' }}
                />
                <ChevronDown size={18} color="var(--text-secondary)" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', alignSelf: 'center' }}>Filter suggestions by:</span>
                  <Dropdown label="Niche" options={niches} isOpen={showNicheDropdown} setIsOpen={setShowNicheDropdown} />
                  <Dropdown label="Platform" options={platforms} isOpen={showPlatformDropdown} setIsOpen={setShowPlatformDropdown} isPlatform />
                  <Dropdown label="Account size" options={sizes} isOpen={showSizeDropdown} setIsOpen={setShowSizeDropdown} isSize />
                </div>
                <button style={actionButtonStyle}>
                  Discover <span style={{ opacity: 0.6 }}>↵</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'manual' && (
            <div style={{ position: 'relative' }}>
              <textarea 
                placeholder="Enter a comma-separated list of channel URLs"
                style={{ 
                  width: '100%', 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-primary)', 
                  fontSize: '1rem', 
                  minHeight: '120px', 
                  outline: 'none',
                  resize: 'none',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={actionButtonStyle}>
                  Parse <span style={{ opacity: 0.6 }}>↵</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested vs Included */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Suggested */}
          <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Suggested</span>
              <span style={{ fontSize: '0.75rem', color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>0 channels</span>
            </div>
            <div style={{ flex: 1, minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Use the textbox above to get suggestions
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}>Load more</button>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}>Add all to watchlist</button>
            </div>
          </div>

          {/* Included */}
          <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Included</span>
              <span style={{ fontSize: '0.75rem', color: '#22C55E', background: 'rgba(34, 197, 94, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>0 channels</span>
            </div>
            <div style={{ flex: 1, minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No channels added yet
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}>Remove all</button>
              <button style={{ background: '#2563EB', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '500', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Save watchlist</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

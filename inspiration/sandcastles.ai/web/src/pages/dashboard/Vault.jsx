import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Bookmark, Video, Anchor, Palette, Search, 
  MoreHorizontal, Play, ExternalLink, Calendar
} from 'lucide-react';
import { useState } from 'react';

export default function Vault() {
  const [activeTab, setActiveTab] = useState('videos');

  const tabs = [
    { id: 'videos', name: 'Videos', icon: Video },
    { id: 'hooks', name: 'Hooks', icon: Anchor },
    { id: 'styles', name: 'Styles', icon: Palette },
  ];

  const savedVideos = [
    {
      title: "Fast for 30 Days during Ramadan ? Fasting isn't just about...",
      creator: "@zack.chug",
      platform: "instagram",
      date: "Feb 2, 2024",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c65b5a33?w=400&q=80"
    },
    {
      title: "Why you should never use a credit card for...",
      creator: "@money.talks",
      platform: "youtube",
      date: "Jan 15, 2024",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
    }
  ];

  const cardStyle = {
    background: '#0B0B0B',
    border: '1px solid #1A1A1A',
    borderRadius: '16px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Vault</h1>
            <p style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>Your personal library of saved inspiration and templates.</p>
          </div>
          <div style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52525B' }} />
             <input 
               type="text" 
               placeholder="Search your vault..." 
               style={{ 
                 background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '10px', 
                 padding: '0.75rem 1rem 0.75rem 2.75rem', color: '#fff', fontSize: '0.9rem', width: '300px', outline: 'none' 
               }} 
             />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1A1A1A', marginBottom: '2.5rem' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1rem 0',
                background: 'transparent', border: 'none', color: activeTab === tab.id ? '#fff' : '#52525B',
                fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === tab.id ? '#2563EB' : 'transparent'}`,
                transition: 'all 0.2s', marginBottom: '-1px'
              }}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {activeTab === 'videos' && savedVideos.map((video, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={video.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                   <Play size={32} fill="#fff" />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.4' }}>{video.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ color: '#A1A1AA', fontSize: '0.8rem' }}>{video.creator}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={12} color="#52525B" />
                    <span style={{ color: '#52525B', fontSize: '0.75rem' }}>{video.date}</span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                 <button style={{ flex: 1, background: 'transparent', border: '1px solid #1A1A1A', borderRadius: '8px', padding: '0.5rem', color: '#A1A1AA', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <ExternalLink size={14} /> Open
                 </button>
                 <button style={{ background: 'transparent', border: '1px solid #1A1A1A', borderRadius: '8px', padding: '0.5rem', color: '#A1A1AA', cursor: 'pointer' }}>
                    <MoreHorizontal size={14} />
                 </button>
              </div>
            </div>
          ))}

          {/* Placeholder for other tabs */}
          {activeTab !== 'videos' && (
            <div style={{ gridColumn: 'span 4', padding: '4rem', textAlign: 'center', color: '#52525B' }}>
               No saved {activeTab} yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

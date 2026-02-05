import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Sparkles, Search, Plus, MoreHorizontal, X, ExternalLink, PlayCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Channels() {
  const [selectedChannel, setSelectedChannel] = useState(null);

  const channelData = [
    { name: 'prof_prep', followers: '123K followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prof' },
    { name: 'rythmhealth_', followers: '55K followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rythm' },
    { name: 'instagram', followers: '669M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=insta' },
    { name: 'mrbeast', followers: '465M subscribers', platform: 'youtube', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beast' },
    { name: 'kyliejenner', followers: '392M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kylie' },
    { name: 'kimkardashian', followers: '354M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kim' },
    { name: 'nike', followers: '298M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nike' },
    { name: 'lilbieber', followers: '292M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lil' },
    { name: 'raywilliamjohnson', followers: '19M subscribers', platform: 'youtube', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ray' },
    { name: 'kendalljenner', followers: '285M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kendall' },
    { name: 'taylorswift', followers: '281M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor' },
    { name: 'natgeo', followers: '276M followers', platform: 'instagram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nat' },
  ];

  const PlatformIcon = ({ platform }) => {
    if (platform === 'youtube') return <div style={{ width: '14px', height: '14px', background: '#FF0000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>▶</div>;
    if (platform === 'instagram') return <div style={{ width: '14px', height: '14px', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>📸</div>;
    return null;
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', position: 'relative' }}>
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Channels</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Discover and track top channels to improve your content strategy</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <Link 
              to="/dashboard/build-watchlist"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: '#2563EB', 
                color: 'var(--text-primary)', 
                padding: '0.5rem 1rem', 
                borderRadius: '99px',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              <Sparkles size={16} />
              Build your watchlist
            </Link>
            <button style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'var(--surface-color)', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)', 
              padding: '0.5rem 1rem', 
              borderRadius: '99px',
              fontSize: '0.875rem'
            }}>
              <Search size={16} />
              Search and filter
            </button>
            <Link 
              to="/dashboard/submit-channels"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'var(--surface-color)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)', 
                padding: '0.5rem 1rem', 
                borderRadius: '99px',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              <Plus size={16} />
              Add new channels
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {channelData.map((channel, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedChannel(channel)}
                style={{ 
                  background: 'var(--surface-color)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px', 
                  padding: '0.75rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface-color)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={channel.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', border: '2px solid var(--surface-color)', borderRadius: '4px' }}>
                    <PlatformIcon platform={channel.platform} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{channel.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{channel.followers}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlists Sidebar */}
        <div>
          <div style={{ 
            background: 'var(--surface-color)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '16px', 
            padding: '1.5rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>Your watchlists</div>
              <button style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Plus size={18} /></button>
            </div>

            <div style={{ 
              background: 'var(--surface-hover)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px', 
              padding: '1rem' 
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>Health and English Prep</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2 channels</span>
                <div style={{ display: 'flex', paddingLeft: '4px' }}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=prof" style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--surface-hover)' }} />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=rythm" style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--surface-hover)', marginLeft: '-6px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Details Modal */}
        {selectedChannel && (
          <div style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.2)', 
            backdropFilter: 'blur(4px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
          }} onClick={() => setSelectedChannel(null)}>
            <div style={{ 
              background: 'var(--surface-color)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '16px', 
              width: '440px', 
              padding: '1.5rem',
              position: 'relative'
            }} onClick={e => e.stopPropagation()}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <img src={selectedChannel.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', border: '2px solid var(--surface-color)', borderRadius: '4px' }}>
                        <PlatformIcon platform={selectedChannel.platform} />
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedChannel.name}</div>
                        <ExternalLink size={14} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                    </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedChannel.followers}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Add this channel to a watchlist:</div>
                <div style={{ 
                  background: 'var(--border-color)', 
                  border: '1px solid var(--surface-hover)', 
                  borderRadius: '10px', 
                  padding: '0.75rem 1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}>
                  Select a watchlist
                  <ChevronDown size={16} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link 
                  to="/dashboard/channel-videos"
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    padding: '0.6rem 1rem', 
                    color: 'var(--text-primary)', 
                    fontSize: '0.85rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem',
                    cursor: 'pointer',
                    textDecoration: 'none'
                }}>
                  <PlayCircle size={18} />
                  Explore videos
                </Link>
                <button style={{ 
                    background: '#2563EB', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '0.6rem 1.5rem', 
                    color: 'var(--text-primary)', 
                    fontSize: '0.85rem', 
                    fontWeight: '600',
                    cursor: 'pointer'
                }}>
                  Add
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

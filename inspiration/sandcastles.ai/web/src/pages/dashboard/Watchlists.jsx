import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Plus, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Watchlists() {
  const watchlists = [
    {
      id: 1,
      name: 'Marketing',
      channelCount: 25,
      avatars: [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5'
      ]
    },
    {
      id: 2,
      name: 'Tech',
      channelCount: 17,
      avatars: [
        'https://i.pravatar.cc/150?img=6',
        'https://i.pravatar.cc/150?img=7',
        'https://i.pravatar.cc/150?img=8',
        'https://i.pravatar.cc/150?img=9',
        'https://i.pravatar.cc/150?img=10'
      ]
    }
  ];

  const newChannels = [
    { name: 'personalbrandlaunch', followers: '784K' },
    { name: 'rourkeheath', followers: '713K' },
    { name: 'iamsarahsnow', followers: '515K' },
    { name: 'mattykay', followers: '471K' },
    { name: 'benkaluza', followers: '351K' }
  ];

  return (
    <DashboardLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
        {/* Left Sidebar - New Channels */}
        <div>
          <div style={{ fontSize: '0.75rem', color: '#71717A', marginBottom: '1rem', fontStyle: 'italic' }}>
            52 new channels added today
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {newChannels.map((channel, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: '#EF4444', 
                  borderRadius: '50%' 
                }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                    {channel.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#71717A' }}>
                    {channel.followers} followers
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Watchlists */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <button style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#71717A', 
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  Go ↺
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: 'linear-gradient(45deg, #f09433 0%, #bc1888 100%)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>📸</div>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: '#000', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>🎵</div>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: 'linear-gradient(45deg, #f09433 0%, #bc1888 100%)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>📸</div>
                </div>
                <button style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#71717A', 
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
            <button style={{ 
              padding: '0.6rem 1rem', 
              background: '#2563EB', 
              border: 'none', 
              borderRadius: '10px', 
              color: '#fff', 
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Plus size={16} /> Add new channel
            </button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>Your watchlists</h2>
              <button style={{ 
                width: '32px', 
                height: '32px', 
                background: '#141414', 
                border: '1px solid #27272A', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A1A1AA',
                cursor: 'pointer'
              }}>
                <Plus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {watchlists.map((watchlist) => (
                <Link
                  key={watchlist.id}
                  to={`/dashboard/watchlists/${watchlist.id}`}
                  style={{
                    textDecoration: 'none',
                    padding: '1.5rem',
                    background: '#0B0B0B',
                    border: '1px solid #1A1A1A',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.background = '#121212';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1A1A1A';
                    e.currentTarget.style.background = '#0B0B0B';
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                      {watchlist.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#71717A' }}>
                        {watchlist.channelCount} channels
                      </span>
                      <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                        {watchlist.avatars.map((avatar, i) => (
                          <img
                            key={i}
                            src={avatar}
                            alt=""
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: '2px solid #0B0B0B',
                              marginLeft: i > 0 ? '-8px' : '0'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} color="#52525B" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

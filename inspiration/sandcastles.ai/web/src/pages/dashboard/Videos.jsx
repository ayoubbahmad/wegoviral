import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Search, ChevronDown, ArrowUpDown, LayoutGrid, 
  Clock, RotateCcw, Table2, Play, Zap, Eye, 
  TrendingUp, Calendar, MoreHorizontal, Filter, X,
  Bookmark, Share2, Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Videos() {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);

  const videoData = [
    { 
      id: 1,
      title: 'Fast for 30 Days during Ramadan ? Fasting isn\'t just about...', 
      handle: '@sapiscience',
      time: '3d ago',
      outlier: '1.5x', 
      views: '168K', 
      engagement: '7%', 
      thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c65b5a33?w=400&q=80',
      platform: 'tiktok'
    },
    { 
      id: 2,
      title: 'billionaires 💰 petty drama (they\'re just like us 😅 ft ~the files~, the $7...', 
      handle: '@stephthefounder',
      time: '3d ago',
      outlier: '1x', 
      views: '40K', 
      engagement: '2%', 
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
      platform: 'instagram'
    },
    { 
      id: 3,
      title: 'While everyone else ran, one company stayed. Now the payoff begins. Venezu...', 
      handle: '@stocksharks',
      time: '4d ago',
      outlier: '1.1x', 
      views: '29K', 
      engagement: '1%', 
      thumbnail: 'https://images.unsplash.com/photo-1611974764055-9c8346101c73?w=400&q=80',
      platform: 'instagram'
    },
    { 
      id: 4,
      title: 'It\'s all about ✨perspective✨. Sprinkle a little BTS with some POV magic 🔮...', 
      handle: '@instagramforbusiness',
      time: '4d ago',
      outlier: '1.6x', 
      views: '1.5M', 
      engagement: '1%', 
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80',
      platform: 'instagram'
    },
    { 
      id: 5,
      title: 'Schiffy warns America is heading toward a major economic reckoning. His arg...', 
      handle: '@stocksharks',
      time: '5d ago',
      outlier: '4.8x', 
      views: '131K', 
      engagement: '2%', 
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&q=80',
      platform: 'instagram'
    }
  ];

  const PlatformIcon = ({ platform }) => {
    if (platform === 'tiktok') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
        </svg>
      );
    }
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  };

  const menuButtonStyle = {
    width: '40px', 
    height: '40px', 
    background: '#0B0B0B', 
    border: '1px solid #1A1A1A', 
    borderRadius: '10px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#52525B',
    cursor: 'pointer',
    position: 'relative'
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Videos</h1>
        <p style={{ color: '#71717A', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Discover what's gone viral in your niche, and why it worked</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            background: '#0B0B0B', 
            border: '1px solid #1A1A1A', 
            borderRadius: '10px', 
            padding: '0 0.5rem 0 1rem',
            height: '40px',
            maxWidth: '600px'
          }}>
            <input 
              type="text" 
              placeholder="Search for videos by topic" 
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '100%' }}
            />
            <button style={{ 
              background: '#27272A', 
              color: '#A1A1AA', 
              fontSize: '0.75rem', 
              padding: '0.35rem 0.6rem', 
              borderRadius: '6px',
              marginLeft: '0.5rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: 'none',
              cursor: 'pointer'
            }}>
              Go <span style={{ fontSize: '12px' }}>↵</span>
            </button>
          </div>
          
          {/* Action Tools */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button style={menuButtonStyle}><ArrowUpDown size={18} /></button>
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                style={{ ...menuButtonStyle, background: viewMode === 'table' ? '#1E3A8A' : '#0B0B0B', color: viewMode === 'table' ? '#3B82F6' : '#52525B', borderColor: viewMode === 'table' ? '#1E3A8A' : '#1A1A1A' }}
              >
                {viewMode === 'cards' ? <LayoutGrid size={18} /> : <Table2 size={18} />}
              </button>
              
              {isViewDropdownOpen && (
                <div style={{ 
                  position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: '#0B0B0B', 
                  border: '1px solid #1A1A1A', borderRadius: '12px', padding: '0.5rem', zIndex: 100, width: '140px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#52525B', padding: '0.5rem', fontWeight: '700', textTransform: 'uppercase' }}>View as</div>
                  <button 
                    onClick={() => { setViewMode('table'); setIsViewDropdownOpen(false); }}
                    style={{ 
                      width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: viewMode === 'table' ? '#2563EB' : 'transparent',
                      color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem'
                    }}
                  >
                    <Table2 size={16} /> Table
                  </button>
                  <button 
                    onClick={() => { setViewMode('cards'); setIsViewDropdownOpen(false); }}
                    style={{ 
                      width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: viewMode === 'cards' ? '#2563EB' : 'transparent',
                      color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.2rem'
                    }}
                  >
                    <LayoutGrid size={16} /> Cards
                  </button>
                </div>
              )}
            </div>

            <button style={menuButtonStyle}><Clock size={18} /></button>
            <button style={menuButtonStyle}><RotateCcw size={18} /></button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{ ...menuButtonStyle, background: showFilters ? '#1E3A8A' : '#0B0B0B', color: showFilters ? '#3B82F6' : '#52525B', borderColor: showFilters ? '#1E3A8A' : '#1A1A1A' }}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717A', fontWeight: '600' }}>Saved filters:</span>
              <button 
                onClick={() => setSelectedWatchlist('Tech')}
                style={{ 
                  padding: '0.4rem 0.75rem', 
                  background: selectedWatchlist === 'Tech' ? '#2563EB' : '#141414', 
                  border: '1px solid #27272A', 
                  borderRadius: '8px', 
                  color: '#fff', 
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                Tech {selectedWatchlist === 'Tech' && <X size={12} onClick={(e) => { e.stopPropagation(); setSelectedWatchlist(null); }} />}
              </button>
              <button style={{ padding: '0.4rem 0.75rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>
                Channel <ChevronDown size={12} />
              </button>
              <button style={{ padding: '0.4rem 0.75rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>
                Posted date <ChevronDown size={12} />
              </button>
              <button style={{ padding: '0.4rem 0.75rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>
                Platform <ChevronDown size={12} />
              </button>
              <button style={{ padding: '0.4rem 0.75rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>
                Outlier score <ChevronDown size={12} />
              </button>
              <button style={{ padding: '0.4rem 0.75rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>
                Views <ChevronDown size={12} />
              </button>
              <button style={{ padding: '0.4rem 0.75rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer' }}>
                Engagement rate <ChevronDown size={12} />
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button style={{ padding: '0.4rem 0.75rem', background: 'transparent', border: 'none', color: '#71717A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>
                  Clear
                </button>
                <button style={{ padding: '0.4rem 0.75rem', background: '#2563EB', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'cards' ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '1.25rem' 
        }}>
          {videoData.map((video) => (
            <div key={video.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                to={`/dashboard/analysis`}
                style={{ 
                  position: 'relative', 
                  aspectRatio: '9/16', 
                  background: '#000', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                  display: 'block'
                }}
              >
                <img 
                  src={video.thumbnail} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '0.75rem', 
                  right: '0.75rem', 
                  width: '24px', 
                  height: '24px', 
                  background: video.platform === 'tiktok' ? '#000' : 'linear-gradient(45deg, #f09433 0%,#bc1888 100%)', 
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <PlatformIcon platform={video.platform} />
                </div>
                
                <div style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  left: '0', 
                  right: '0', 
                  padding: '1.25rem 0.75rem 0.75rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>{video.handle}</div>
                </div>
              </Link>
              
              <div style={{ padding: '0 0.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#fff', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {video.title}
                </div>
                
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1, padding: '0.35rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                     <Zap size={10} color="#22C55E" fill="#22C55E" />
                     <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#22C55E' }}>{video.outlier}</span>
                  </div>
                  <div style={{ flex: 1, padding: '0.35rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                     <Eye size={10} color="#3B82F6" />
                     <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#3B82F6' }}>{video.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div style={{ background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1A1A1A', background: '#080808' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Video</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Outlier</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Platform</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Views</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={14} /> Engagement
                  </div>
                </th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {videoData.map((video, i) => (
                <tr 
                  key={video.id} 
                  style={{ borderBottom: i === videoData.length - 1 ? 'none' : '1px solid #1A1A1A', cursor: 'pointer', position: 'relative' }}
                  onMouseEnter={() => setHoveredRow(video.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link to="/dashboard/analysis" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={video.thumbnail} alt="" style={{ width: '40px', height: '56px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ maxWidth: '400px' }}>
                         <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', marginBottom: '0.2rem' }}>{video.handle}</div>
                         <div style={{ fontSize: '0.8rem', color: '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.title}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>
                      {video.outlier}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: '#A1A1AA' }}>
                      <PlatformIcon platform={video.platform} />
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>{video.views}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>{video.engagement}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: '#71717A', position: 'relative' }}>
                    {video.time}
                    {hoveredRow === video.id && (
                      <div style={{ 
                        position: 'absolute', 
                        right: '1.5rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        display: 'flex', 
                        gap: '0.5rem',
                        background: '#0B0B0B',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid #1A1A1A'
                      }}>
                        <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Bookmark">
                          <Bookmark size={16} />
                        </button>
                        <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Copy">
                          <Copy size={16} />
                        </button>
                        <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Share">
                          <Share2 size={16} />
                        </button>
                        <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="More">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

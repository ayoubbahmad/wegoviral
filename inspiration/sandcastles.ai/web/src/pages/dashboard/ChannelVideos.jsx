import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Search, ChevronRight, TrendingUp, Eye, Zap, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ChannelVideos() {
  const navigate = useNavigate();
  
  const videoData = [
    { 
      id: 1,
      title: 'Bad news', 
      handle: '@raywilliamjohnson',
      time: '6d ago',
      outlier: '1.4x', 
      views: '232K', 
      engagement: '7%', 
      thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c65b5a33?w=400&q=400',
      platform: 'youtube'
    },
    { 
      id: 2,
      title: 'You Don\'t Wanna Miss This', 
      handle: '@raywilliamjohnson',
      time: '1w ago',
      outlier: '1x', 
      views: '108K', 
      engagement: '6%', 
      thumbnail: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=400&q=400',
      platform: 'youtube'
    },
    { 
      id: 3,
      title: 'Goodbye', 
      handle: '@raywilliamjohnson',
      time: '3mo ago',
      outlier: '1.2x', 
      views: '1.4M', 
      engagement: '5%', 
      thumbnail: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=400',
      platform: 'youtube'
    },
    { 
      id: 4,
      title: 'Goodbye', 
      handle: '@raywilliamjohnson',
      time: '4mo ago',
      outlier: '2.4x', 
      views: '2.3M', 
      engagement: '6%', 
      thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=400',
      platform: 'youtube'
    },
    { 
      id: 5,
      title: 'I have bad news', 
      handle: '@raywilliamjohnson',
      time: '8mo ago',
      outlier: '1.2x', 
      views: '1.8M', 
      engagement: '6%', 
      thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=400',
      platform: 'youtube'
    }
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <button 
                onClick={() => navigate('/dashboard/channels')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Videos</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Discover what's gone viral in your niche, and why it worked</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--surface-color)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '10px', 
            padding: '0 1rem',
            height: '40px',
            maxWidth: '500px'
          }}>
            <input 
              type="text" 
              placeholder="Search for videos by topic" 
              defaultValue="Search for videos by topic"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', width: '100%' }}
            />
            <button style={{ 
              background: 'var(--surface-hover)', 
              color: 'var(--text-secondary)', 
              fontSize: '0.75rem', 
              padding: '0.2rem 0.5rem', 
              borderRadius: '6px',
              marginLeft: '0.5rem',
              fontWeight: '500'
            }}>Go ↵</button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[1, 2, 3, 4].map(i => (
              <button key={i} style={{ 
                width: '40px', 
                height: '40px', 
                background: i === 1 ? '#1D4ED833' : 'var(--surface-color)', 
                border: i === 1 ? '1px solid #1D4ED8' : '1px solid var(--border-color)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: i === 1 ? '#3B82F6' : 'var(--text-secondary)'
              }}>
                <div style={{ width: '16px', height: '16px', border: '1.5px solid currentColor', borderRadius: '4px' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

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
                background: 'var(--bg-color)', 
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '0.75rem'
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
                width: '18px', 
                height: '18px', 
                background: '#FF0000', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px'
              }}>▶</div>
              
              <div style={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                right: '0', 
                padding: '0.75rem',
                background: 'linear-gradient(to top, var(--surface-color), transparent)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>Ray William Johnson</div>
              </div>
            </Link>
            
            <div style={{ padding: '0 0.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {video.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {video.handle} • {video.time}
              </div>
              
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <div style={{ flex: 1, padding: '0.3rem', background: '#06170E', border: '1px solid #14532D', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                   <Zap size={10} color="#22C55E" />
                   <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#22C55E' }}>{video.outlier}</span>
                </div>
                <div style={{ flex: 1, padding: '0.3rem', background: '#081325', border: '1px solid #1E3A8A', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                   <Eye size={10} color="#3B82F6" />
                   <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#3B82F6' }}>{video.views}</span>
                </div>
                <div style={{ flex: 1, padding: '0.3rem', background: '#1c150c', border: '1px solid #78350f', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                   <TrendingUp size={10} color="#F59E0B" />
                   <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#F59E0B' }}>{video.engagement}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Search, ChevronRight, TrendingUp, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Videos() {
  const videoData = [
    { 
      id: 1,
      title: 'Still reading every single word...', 
      handle: '@prof_prep',
      time: '1w ago',
      outlier: '1x', 
      views: '2.1K', 
      engagement: '0%', 
      thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=400',
      platform: 'instagram'
    },
    { 
      id: 2,
      title: 'Using templates on the CELPI...', 
      handle: '@prof_prep',
      time: '1w ago',
      outlier: '1x', 
      views: '2.1K', 
      engagement: '1%', 
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=400',
      platform: 'instagram'
    },
    { 
      id: 3,
      title: 'It\'s 2026. There\'s no flying...', 
      handle: '@rythmhealth_',
      time: '2w ago',
      outlier: '14.1x', 
      views: '123K', 
      engagement: '10%', 
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac00dc?w=400&q=400',
      platform: 'instagram'
    },
    { 
      id: 4,
      title: 'Are we still trying to impress...', 
      handle: '@prof_prep',
      time: '2w ago',
      outlier: '1x', 
      views: '2.1K', 
      engagement: '1%', 
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=400',
      platform: 'instagram'
    },
    { 
      id: 5,
      title: 'Ready to get the CELPIP scor...', 
      handle: '@prof_prep',
      time: '4w ago',
      outlier: '1x', 
      views: '2.2K', 
      engagement: '0%', 
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=400',
      platform: 'instagram'
    }
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Videos</h1>
        <p style={{ color: '#71717A', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Discover what's gone viral in your niche, and why it worked</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            background: '#0B0B0B', 
            border: '1px solid #1A1A1A', 
            borderRadius: '10px', 
            padding: '0 1rem',
            height: '40px',
            maxWidth: '500px'
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
                background: '#0B0B0B', 
                border: '1px solid #1A1A1A', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <div style={{ width: '16px', height: '16px', border: '1.5px solid #52525B', borderRadius: '4px' }} />
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
                background: '#000', 
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
                background: 'linear-gradient(45deg, #f09433 0%,#bc1888 100%)', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px'
              }}>📸</div>
              
              <div style={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                right: '0', 
                padding: '0.75rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fff' }}>Prof Prep</div>
              </div>
            </Link>
            
            <div style={{ padding: '0 0.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {video.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717A', marginBottom: '0.75rem' }}>
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

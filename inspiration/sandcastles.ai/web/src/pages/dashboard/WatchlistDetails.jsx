import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  ChevronLeft, Play, MoreHorizontal, ChevronDown,
  TrendingUp, Eye, Zap, MessageSquare, Users
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function WatchlistDetails() {
  const { id } = useParams();
  const [selectedAction, setSelectedAction] = useState(null);

  const watchlist = {
    name: 'IT, Stories, News & Advice',
    description: '8 channels • 5 watchlists',
    channels: [
      {
        id: 1,
        name: 'instagramforbusiness',
        handle: '@instagramforbusiness',
        followers: '18M followers • 1000+ videos',
        description: 'Social media marketing and content creation tips for young professionals, helping them create engaging content to improve their online presence and work life balance.',
        topics: ['#instagramtips', '#Canva', '#socialmedia', '#contentcreation', 'My Wishlist', 'Low Mangoes', 'Holi', 'Ramadan', 'Eid Mubarak'],
        avatar: 'https://i.pravatar.cc/150?img=11'
      },
      {
        id: 2,
        name: 'raydalio@vision',
        handle: '@raydalio@vision',
        followers: '1M followers • 197 videos',
        description: 'Entertaining stories and commentary on trending events and pop culture for a time-constrained audience seeking connection through relatable experiences.',
        topics: ['#TikTok', '#Spotify', '#Emo', '#Rap', '#Pop music', '#Top Songs', '#Summertime', '#Chill', '#Alternative'],
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      {
        id: 3,
        name: 'wissdomverse',
        handle: '@wissdomverse',
        followers: '4.6M followers • 1.5M views',
        description: 'Entertaining stories and commentary on trending events and pop culture for a time-constrained audience seeking connection through relatable experiences.',
        topics: ['#Startup', '#Fitness', '#Courage', '#Startup', '#Courage', '#Startup', '#Courage', '#Startup', '#Courage', '#Startup'],
        avatar: 'https://i.pravatar.cc/150?img=13'
      },
      {
        id: 4,
        name: 'buildspace',
        handle: '@buildspace',
        followers: '4.6M followers • 1.5M views',
        description: 'News commentary, business principles and personal development insights for Millennials and Gen Z seeking informed perspectives and actionable advice.',
        topics: ['#TwoWeeks', '#Thought', '#Emo', '#CSR', '#Summertime', '#Chill', '#Alternative'],
        avatar: 'https://i.pravatar.cc/150?img=14'
      },
      {
        id: 5,
        name: 'adanadys',
        handle: '@adanadys',
        followers: '1.3M followers • 1.3M views',
        description: 'News commentary and analysis for millennials seeking to understand current events and make informed decisions.',
        topics: ['#Emo', '#Rap', '#Pop music', '#Top Songs', '#Summertime', '#Chill', '#Alternative'],
        avatar: 'https://i.pravatar.cc/150?img=15'
      }
    ]
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            to="/dashboard/watchlists"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#71717A',
              fontSize: '0.85rem',
              textDecoration: 'none',
              marginBottom: '1rem'
            }}
          >
            <ChevronLeft size={16} /> Back to watchlists
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
            {watchlist.name}
          </h1>
          <p style={{ color: '#71717A', fontSize: '0.9rem' }}>{watchlist.description}</p>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          padding: '1rem',
          background: '#0B0B0B',
          border: '1px solid #1A1A1A',
          borderRadius: '12px'
        }}>
          <button style={{ 
            flex: 1,
            padding: '0.75rem',
            background: '#2563EB',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Play size={16} /> Collect videos
          </button>
          <button style={{ 
            padding: '0.75rem 1.25rem',
            background: '#141414',
            border: '1px solid #27272A',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Actions <ChevronDown size={16} />
          </button>
        </div>

        {/* Channels List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {watchlist.channels.map((channel) => (
            <div 
              key={channel.id}
              style={{
                padding: '1.5rem',
                background: '#0B0B0B',
                border: '1px solid #1A1A1A',
                borderRadius: '16px'
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem' }}>
                <img 
                  src={channel.avatar}
                  alt=""
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>
                        {channel.name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#71717A' }}>
                        {channel.followers}
                      </p>
                    </div>
                    <button style={{
                      padding: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#71717A',
                      cursor: 'pointer'
                    }}>
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#A1A1AA', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {channel.description}
                  </p>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717A', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Popular topics:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {channel.topics.map((topic, i) => (
                        <span 
                          key={i}
                          style={{
                            padding: '0.35rem 0.75rem',
                            background: '#141414',
                            border: '1px solid #27272A',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            color: '#A1A1AA'
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem' }}>
            Start your free trial
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
            Get unlimited access to all features
          </p>
          <button style={{
            padding: '0.75rem 2rem',
            background: '#fff',
            border: 'none',
            borderRadius: '10px',
            color: '#2563EB',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}>
            Start free trial
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

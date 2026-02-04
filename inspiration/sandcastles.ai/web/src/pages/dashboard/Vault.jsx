import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Anchor, Palette, Video, Search, ChevronDown, 
  LayoutGrid, Table2, SlidersHorizontal, Settings2, 
  ExternalLink, Calendar, Eye, Play, X, Plus, 
  Hash, MoreVertical, Copy, Trash2, Edit2,
  Download
} from 'lucide-react';

export default function Vault() {
  const [viewStyle, setViewStyle] = useState('table'); // 'table' or 'grid'
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'hooks', 'styles', 'videos'
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);

  const vaultItems = [
    {
      id: 1,
      type: 'hook',
      name: 'Education | Here\'s What Happens When',
      views: '1.7M',
      date: 'Oct 8, 2025',
      tags: ['Sandcastles Favorites'],
      madlib: "Here's what happens when you [X] for [Y timeframe] during [Z].",
      original: "Here's what happens when you fast for 30 Days during Ramadan",
      source: {
        title: "Fast for 30 Days during Ramadan ? Fasting isn't just skipping...",
        handle: "@zack.chug",
        thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c65b5a33?w=400&q=80"
      }
    },
    {
      id: 2,
      type: 'style',
      name: 'Day In The Life',
      views: '991K',
      date: 'Oct 8, 2025',
      tags: ['Sandcastles Favorites'],
      description: "Shows product/tool/method naturally integrating into authentic daily routine across contexts.",
      attributes: {
        'Sentence Structure': 'Normal',
        'Word Choice': 'Standard',
        'Pacing': 'Moderate',
        'Tone': 'Calm',
        'Voice': 'Reflective',
        'Rhetorical Style': 'Expository'
      },
      source: {
        title: "surviving as an adult 👍 #dayinthelife #softwareengineer...",
        handle: "@gazi.ai",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80"
      }
    },
    {
      id: 3,
      type: 'video',
      name: 'The Future of AI Wearables',
      views: '4.2M',
      date: 'Oct 10, 2025',
      tags: ['Tech', 'Viral'],
      description: "A deep dive into how AI is moving from our pockets to our faces.",
      creator: {
        handle: "@techvision",
        avatar: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&q=80"
      },
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80"
    },
    {
      id: 4,
      type: 'hook',
      name: 'Question | Is It Just Me?',
      views: '82M',
      date: 'Oct 8, 2025',
      tags: ['Sandcastles Favorites'],
      madlib: "Is it just me or is [X] getting [Y]?",
      original: "Is it just me or is social media getting more toxic?",
      source: {
        title: "The truth about social media in 2025...",
        handle: "@truthbomb",
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80"
      }
    }
  ];

  const filteredItems = vaultItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'hooks' && item.type === 'hook') return true;
    if (activeTab === 'styles' && item.type === 'style') return true;
    if (activeTab === 'videos' && item.type === 'video') return true;
    return false;
  });

  const columnHeaderStyle = {
    padding: '0.75rem 1rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#52525B',
    textTransform: 'uppercase',
    textAlign: 'left',
    borderBottom: '1px solid #1A1A1A'
  };

  const cellStyle = {
    padding: '1rem',
    fontSize: '0.85rem',
    color: '#fff',
    borderBottom: '1px solid #1A1A1A'
  };

  const filterButtonStyle = {
    background: '#0B0B0B',
    border: '1px solid #1A1A1A',
    borderRadius: '8px',
    padding: '0.4rem 0.75rem',
    color: '#A1A1AA',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  };

  return (
    <DashboardLayout>
      <div style={{ paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Vault</h1>
        <p style={{ color: '#71717A', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Build a personalized collection of winning elements to use in your future scripts</p>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            background: '#0B0B0B', 
            border: '1px solid #1A1A1A', 
            borderRadius: '10px', 
            padding: '0 0.5rem 0 1rem',
            height: '40px',
            maxWidth: '500px'
          }}>
            <Search size={16} color="#52525B" style={{ marginRight: '0.75rem' }} />
            <input 
              type="text" 
              placeholder="Search vault" 
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '100%' }}
            />
            <button style={{ 
              background: '#27272A', 
              color: '#A1A1AA', 
              fontSize: '0.75rem', 
              padding: '0.3rem 0.6rem', 
              borderRadius: '6px',
              marginLeft: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}>Go ↵</button>
          </div>
          <button 
            onClick={() => setViewStyle(viewStyle === 'table' ? 'grid' : 'table')}
            style={{ ...filterButtonStyle, width: '40px', justifyContent: 'center', background: '#2563EB', color: '#fff', border: 'none' }}
          >
            {viewStyle === 'table' ? <LayoutGrid size={16} /> : <Table2 size={16} />}
          </button>
          <button style={{ ...filterButtonStyle, width: '40px', justifyContent: 'center' }}><Download size={16} /></button>
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('all')}
                style={{ ...filterButtonStyle, background: activeTab === 'all' ? '#1E3A8A' : '#0B0B0B', color: activeTab === 'all' ? '#3B82F6' : '#A1A1AA' }}
              >
                <Hash size={16} /> All
              </button>
              <button 
                onClick={() => setActiveTab('hooks')}
                style={{ ...filterButtonStyle, background: activeTab === 'hooks' ? '#1E3A8A' : '#0B0B0B', color: activeTab === 'hooks' ? '#3B82F6' : '#A1A1AA' }}
              >
                <Anchor size={16} /> Hooks
              </button>
              <button 
                onClick={() => setActiveTab('styles')}
                style={{ ...filterButtonStyle, background: activeTab === 'styles' ? '#1E3A8A' : '#0B0B0B', color: activeTab === 'styles' ? '#3B82F6' : '#A1A1AA' }}
              >
                <Palette size={16} /> Styles
              </button>
              <button 
                onClick={() => setActiveTab('videos')}
                style={{ ...filterButtonStyle, background: activeTab === 'videos' ? '#1E3A8A' : '#0B0B0B', color: activeTab === 'videos' ? '#3B82F6' : '#A1A1AA' }}
              >
                <Video size={16} /> Videos
              </button>

              <div style={{ width: '1px', background: '#1A1A1A', margin: '0 0.5rem' }} />

              <button style={filterButtonStyle}>Views <ChevronDown size={14} /></button>
              <button style={filterButtonStyle}>Saved date <ChevronDown size={14} /></button>
              <button style={{ ...filterButtonStyle, minWidth: '150px' }}>Filter by tag <ChevronDown size={14} /></button>
           </div>

           <button 
             onClick={() => setIsManageTagsOpen(true)}
             style={{ ...filterButtonStyle, border: 'none', background: 'transparent' }}
           >
             Manage tags <Settings2 size={16} />
           </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 380px' : '1fr', gap: '1.5rem', transition: 'all 0.3s ease' }}>
          {/* Main List/Grid Column */}
          <div style={{ transition: 'all 0.3s ease' }}>
            {viewStyle === 'table' ? (
              <div style={{ background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#080808' }}>
                      <th style={columnHeaderStyle}>Name</th>
                      <th style={columnHeaderStyle}>Views</th>
                      <th style={{ ...columnHeaderStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        Saved Date <ChevronDown size={14} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        style={{ 
                          cursor: 'pointer', 
                          background: selectedItem?.id === item.id ? '#121212' : 'transparent',
                          borderLeft: selectedItem?.id === item.id ? '2px solid #2563EB' : '2px solid transparent'
                        }}
                      >
                        <td style={cellStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ 
                              width: '32px', height: '32px', borderRadius: '8px', background: '#1A1A1A', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525B'
                            }}>
                              {item.type === 'hook' && <Anchor size={16} />}
                              {item.type === 'style' && <Palette size={16} />}
                              {item.type === 'video' && <Video size={16} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', marginBottom: '0.2rem' }}>{item.name}</div>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                 {item.tags.map(tag => (
                                   <span key={tag} style={{ fontSize: '0.7rem', color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{tag}</span>
                                 ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={cellStyle}>{item.views}</td>
                        <td style={cellStyle}>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {filteredItems.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      background: '#0B0B0B', border: selectedItem?.id === item.id ? '1px solid #2563EB' : '1px solid #1A1A1A',
                      borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '10px', background: '#1A1A1A', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525B'
                      }}>
                        {item.type === 'hook' && <Anchor size={20} />}
                        {item.type === 'style' && <Palette size={20} />}
                        {item.type === 'video' && <Video size={20} />}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#52525B', fontWeight: '700' }}>{item.views} views</div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{item.name}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
                       {item.tags.map(tag => (
                         <span key={tag} style={{ fontSize: '0.65rem', color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{tag}</span>
                       ))}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#52525B' }}>{item.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel Column */}
          {selectedItem && (
            <div style={{ 
              background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '16px', 
              padding: '1.75rem', position: 'sticky', top: '2rem', height: 'fit-content',
              maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', flex: 1, paddingRight: '1rem', lineHeight: '1.3' }}>{selectedItem.name}</h2>
                <button 
                  onClick={() => setSelectedItem(null)}
                  style={{ background: 'transparent', border: 'none', color: '#52525B', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                 <div style={{ 
                   display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1A1A1A', 
                   padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#A1A1AA' 
                 }}>
                   {selectedItem.type === 'hook' && <><Anchor size={12} /> Hook</>}
                   {selectedItem.type === 'style' && <><Palette size={12} /> Style</>}
                   {selectedItem.type === 'video' && <><Video size={12} /> Video</>}
                 </div>
                 <div style={{ 
                   display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(37, 99, 235, 0.1)', 
                   padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#3B82F6' 
                 }}>
                   <Eye size={12} /> {selectedItem.views} views
                 </div>
              </div>

              {selectedItem.type === 'hook' && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.75rem', color: '#52525B', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>Madlib</h3>
                    <div style={{ background: '#080808', border: '1px solid #1A1A1A', padding: '1.25rem', borderRadius: '12px', fontSize: '0.9rem', lineHeight: '1.6', color: '#A1A1AA' }}>
                      {selectedItem.madlib}
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.75rem', color: '#52525B', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>Original Hook</h3>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#fff', fontStyle: 'italic', background: '#080808', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1A1A1A' }}>
                      "{selectedItem.original}"
                    </div>
                  </div>
                </>
              )}

              {selectedItem.type === 'style' && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.75rem', color: '#52525B', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>Description</h3>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#A1A1AA' }}>
                      {selectedItem.description}
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.75rem', color: '#52525B', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: '800', letterSpacing: '0.05em' }}>Attributes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {Object.entries(selectedItem.attributes).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ color: '#52525B' }}>{key}</span>
                          <span style={{ color: '#fff', fontWeight: '600' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedItem.type === 'video' && (
                 <>
                   <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                      <img src={selectedItem.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Play size={40} fill="#fff" />
                      </div>
                   </div>
                   <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={selectedItem.creator.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      <div>
                         <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{selectedItem.creator.handle}</div>
                         <div style={{ fontSize: '0.75rem', color: '#52525B' }}>Creator</div>
                      </div>
                   </div>
                 </>
              )}

              {selectedItem.source && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.75rem', color: '#52525B', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: '800' }}>Sources</h3>
                  <div style={{ background: '#080808', border: '1px solid #1A1A1A', padding: '0.75rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={selectedItem.source.thumbnail} style={{ width: '40px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{ fontSize: '0.8rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedItem.source.title}</div>
                       <div style={{ fontSize: '0.75rem', color: '#52525B' }}>{selectedItem.source.handle}</div>
                    </div>
                    <ExternalLink size={14} color="#52525B" />
                  </div>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '0.75rem', color: '#52525B', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: '800' }}>Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedItem.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.75rem', color: '#fff', background: '#1A1A1A', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>{tag}</span>
                  ))}
                  <button style={{ background: 'transparent', border: '1px dashed #1A1A1A', borderRadius: '6px', padding: '0.4rem 0.75rem', color: '#52525B', cursor: 'pointer' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manage Tags Modal */}
      {isManageTagsOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' 
        }} onClick={() => setIsManageTagsOpen(false)}>
          <div style={{ 
            background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '20px', 
            padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' 
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Manage tags</h2>
              <button onClick={() => setIsManageTagsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#52525B', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <p style={{ color: '#71717A', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Use tags to organize the items in your vault. Add, edit, or remove tags here.</p>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
               <input 
                 type="text" 
                 placeholder="Search tags" 
                 style={{ flex: 1, background: '#050505', border: '1px solid #1A1A1A', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fff', outline: 'none' }} 
               />
               <button style={buttonStyle}>Create new tag</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               {['Sandcastles Favorites', 'Camera angles', 'Great editing', 'Hook inspiration'].map(tag => (
                 <div key={tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#080808', borderRadius: '10px', border: '1px solid transparent' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#1A1A1A'} onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#52525B' }} />
                       <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{tag}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', color: '#52525B' }}>
                       <Edit2 size={16} style={{ cursor: 'pointer' }} />
                       <Trash2 size={16} style={{ cursor: 'pointer' }} />
                    </div>
                 </div>
               ))}
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
               <button onClick={() => setIsManageTagsOpen(false)} style={{ ...buttonStyle, background: '#1A1A1A', border: '1px solid #27272A' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const buttonStyle = {
  background: '#fff',
  color: '#000',
  border: 'none',
  borderRadius: '10px',
  padding: '0.75rem 1.25rem',
  fontSize: '0.85rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

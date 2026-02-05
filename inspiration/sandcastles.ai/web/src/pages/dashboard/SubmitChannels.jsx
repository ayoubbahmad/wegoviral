import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { ArrowLeft, FileText, PlusCircle, ChevronDown, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmitChannels() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    { id: 1, platform: '', channel: '', showDropdown: false }
  ]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const platforms = [
    { name: 'YouTube', icon: '▶', color: '#FF0000' },
    { name: 'TikTok', icon: '♪', color: 'var(--text-primary)' },
    { name: 'Instagram', icon: '📸', color: '#E4405F' },
  ];

  const addRow = () => {
    setRows([...rows, { id: Date.now(), platform: '', channel: '', showDropdown: false }]);
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const toggleDropdown = (id) => {
    setRows(rows.map(row => row.id === id ? { ...row, showDropdown: !row.showDropdown } : { ...row, showDropdown: false }));
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Submit New Channels</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Found new channels you like? Submit them here to start tracking their videos.</p>
          </div>
          <button style={{ 
            background: '#2563EB', color: 'var(--text-primary)', padding: '0.6rem 1.5rem', borderRadius: '8px', 
            fontSize: '0.85rem', fontWeight: '600', border: 'none', cursor: 'pointer'
          }}>
            Submit
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => navigate('/dashboard/channels')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button 
            onClick={() => setShowBulkModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            <FileText size={16} />
            Bulk Add
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {rows.map((row) => (
            <div key={row.id} style={{ 
              background: 'var(--surface-color)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px', 
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              position: 'relative'
            }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Platform</label>
                <div style={{ position: 'relative' }}>
                    <div 
                    onClick={() => toggleDropdown(row.id)}
                    style={{ 
                    background: 'var(--surface-color)', border: '1px solid var(--surface-hover)', borderRadius: '8px', padding: '0.75rem 1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    color: row.platform ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer'
                    }}>
                    {row.platform || 'Select a platform'}
                    <ChevronDown size={16} />
                    </div>
                    {row.showDropdown && (
                        <div style={{ 
                            position: 'absolute', top: '110%', left: 0, right: 0, 
                            background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '10px', zIndex: 100, padding: '0.5rem'
                        }}>
                            {platforms.map(p => (
                                <div key={p.name} 
                                    onClick={() => {
                                        updateRow(row.id, 'platform', p.name);
                                        toggleDropdown(row.id);
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '6px' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{p.icon}</div>
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Channel</label>
                <input 
                  type="text" 
                  placeholder="Enter a channel name"
                  value={row.channel}
                  onChange={(e) => updateRow(row.id, 'channel', e.target.value)}
                  style={{ 
                    width: '100%', background: 'var(--surface-color)', border: '1px solid var(--surface-hover)', borderRadius: '8px', 
                    padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addRow}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer'
          }}
        >
          <PlusCircle size={16} />
          Add Another
        </button>

        {/* Bulk Add Modal */}
        {showBulkModal && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
          }} onClick={() => setShowBulkModal(false)}>
            <div style={{ 
              background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', 
              width: '500px', padding: '1.5rem', position: 'relative'
            }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Bulk submit channels</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Paste in a list of channels to submit to the platform, separated by newline or comma. Make sure to include the full URL of each channel so we can validate them.
              </p>
              
              <textarea 
                placeholder="Full URLs separated by newline or comma"
                style={{ 
                  width: '100%', background: 'var(--surface-color)', border: '1px solid var(--surface-hover)', borderRadius: '10px', 
                  padding: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem', minHeight: '180px', outline: 'none',
                  resize: 'none', marginBottom: '1.25rem'
                }}
              />

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>You'll be able to review the channels before they're added.</p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
                <button 
                    onClick={() => setShowBulkModal(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button style={{ 
                    background: '#2563EB', border: 'none', borderRadius: '8px', 
                    padding: '0.6rem 1.25rem', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                }}>
                  Parse channels
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

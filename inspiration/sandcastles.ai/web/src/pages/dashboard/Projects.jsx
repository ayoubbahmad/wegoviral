import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Folder, MoreHorizontal, Plus, Clock, FileText } from 'lucide-react';

export default function Projects() {
  const projects = [
    { name: "Personal Brand 2024", items: 12, lastModified: "2h ago" },
    { name: "Client Work: Fitness", items: 5, lastModified: "1d ago" },
    { name: "YouTube Main Channel", items: 48, lastModified: "3d ago" },
    { name: "TikTok Shorts Batch", items: 8, lastModified: "1w ago" },
  ];

  const cardStyle = {
    background: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '180px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Projects</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Organize your content into dedicated project folders.</p>
          </div>
          <button style={{ 
            background: '#2563EB', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', 
            padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: '600', 
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' 
          }}>
            <Plus size={18} /> New Project
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {/* Create New Project Card */}
          <div 
            style={{ ...cardStyle, borderStyle: 'dashed', border: '2px dashed var(--border-color)', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--surface-hover)'; e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--surface-color)'; }}
          >
             <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Plus size={24} />
             </div>
             <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>Create New Project</span>
          </div>

          {projects.map((project, i) => (
            <div 
                key={i} 
                style={cardStyle}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--surface-hover)'; e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--surface-color)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Folder size={20} fill="currentColor" />
                </div>
                <MoreHorizontal size={18} color="var(--text-secondary)" />
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{project.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FileText size={12} /> {project.items} items
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {project.lastModified}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

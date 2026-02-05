import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Sparkles, Save, Download, Share2, 
  ChevronDown, Type, Zap, BookOpen, Clock, 
  MessageSquare, MoreVertical, Plus
} from 'lucide-react';
import { useState } from 'react';

export default function WriterCopy() {
  const [activeTool, setActiveTool] = useState('templates');

  const tools = [
    { id: 'templates', name: 'Templates', icon: BookOpen },
    { id: 'vault', name: 'From Vault', icon: Zap },
    { id: 'ai', name: 'AI Refine', icon: Sparkles },
  ];

  return (
    <DashboardLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Editor Area */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>New Script</h1>
               <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>DRAFT</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
               <button style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <Save size={16} /> Save
               </button>
               <button style={{ background: '#2563EB', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <Download size={16} /> Export
               </button>
            </div>
          </div>

          <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '3rem', minHeight: '70vh' }}>
             <input 
               type="text" 
               placeholder="Enter script title..." 
               style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', outline: 'none', marginBottom: '3rem' }} 
             />

             <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <EditorSection title="The Hook" color="#3B82F6" placeholder="Start with a visual pattern interrupt or a shocking statement..." />
                <EditorSection title="The Value" color="#10B981" placeholder="Explain the 'what' and 'why'. Provide value immediately..." />
                <EditorSection title="The CTA" color="#A855F7" placeholder="Tell them exactly what to do next..." />
             </div>
          </div>
        </div>

        {/* Tools Sidebar */}
        <div>
           <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: '10px' }}>
              {tools.map(tool => (
                <button 
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem',
                    background: activeTool === tool.id ? 'var(--border-color)' : 'transparent', border: 'none', borderRadius: '8px',
                    color: activeTool === tool.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  <tool.icon size={14} />
                  {tool.name}
                </button>
              ))}
           </div>

           <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
              {activeTool === 'templates' && (
                <>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>Viral Frameworks</h3>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                     {["Problem-Agitate-Solve", "The Curiosity Gap", "Listicle Style", "Behind the Scenes"].map((t, i) => (
                       <div key={i} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '10px', cursor: 'pointer' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>{t}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Click to apply to script</div>
                       </div>
                     ))}
                  </div>
                </>
              )}
              {activeTool === 'ai' && (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                   <div style={{ width: '40px', height: '40px', background: 'rgba(168, 85, 247, 0.1)', color: '#A855F7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Sparkles size={20} />
                   </div>
                   <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>AI Refinement</h3>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Highlight text to see AI improvement suggestions</p>
                   <button style={{ width: '100%', background: '#A855F7', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                      Refine Entire Script
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EditorSection({ title, color, placeholder }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
         <div style={{ width: '4px', height: '16px', background: color, borderRadius: '2px' }} />
         <span style={{ fontSize: '0.75rem', fontWeight: '700', color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      </div>
      <textarea 
        placeholder={placeholder}
        style={{ 
          width: '100%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', 
          fontSize: '1rem', lineHeight: '1.8', outline: 'none', resize: 'none', minHeight: '100px'
        }}
      />
    </div>
  );
}


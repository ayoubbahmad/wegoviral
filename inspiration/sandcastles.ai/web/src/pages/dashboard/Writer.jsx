
import { useState, useRef } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Lightbulb, BookOpen, Key, Palette, FileText, 
  ChevronDown, ExternalLink, RefreshCw, X, Copy, Zap, Plus, Sparkles
} from 'lucide-react';

export default function Writer() {
  const [activeStep, setActiveStep] = useState('topic');
  const [topic, setTopic] = useState('');

  const sections = [
    { id: 'topic', name: 'Topic', icon: Lightbulb },
    { id: 'research', name: 'Research', icon: BookOpen },
    { id: 'hook', name: 'Hook', icon: Key },
    { id: 'style', name: 'Style', icon: Palette },
    { id: 'script', name: 'Script', icon: FileText },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveStep(id);
    }
  };

  const cardStyle = {
    background: '#0B0B0B',
    border: '1px solid #1A1A1A',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    position: 'relative',
    transition: 'all 0.2s ease'
  };

  const sectionHeaderStyle = {
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem', 
    fontSize: '0.95rem', 
    fontWeight: '700', 
    color: '#fff', 
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    color: '#52525B',
    marginBottom: '0.5rem',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #1A1A1A',
    padding: '0.75rem 0',
    fontSize: '1rem',
    color: '#fff',
    outline: 'none',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    background: '#2563EB',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '10rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2.5rem' }}>New script</h1>

        {/* Jump Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '3rem', 
          position: 'sticky', 
          top: '2rem', 
          zIndex: 10,
          background: 'rgba(0,0,0,0.8)',
          padding: '0.75rem',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          border: '1px solid #1A1A1A'
        }}>
          <span style={{ color: '#52525B', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>Jump to:</span>
          {sections.map(s => (
            <button 
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', 
                background: activeStep === s.id ? '#1A1A1A' : 'transparent', 
                color: activeStep === s.id ? '#fff' : '#52525B', 
                padding: '0.4rem 0.75rem', borderRadius: '8px',
                fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <s.icon size={14} />
              {s.name}
            </button>
          ))}
        </div>

        {/* Step 1: Topic */}
        <div id="topic" style={cardStyle}>
          <div style={sectionHeaderStyle}><Lightbulb size={18} color="#3B82F6" /> Describe your topic <span style={{ color: '#52525B', cursor: 'help' }}>ⓘ</span></div>
          <div style={{ display: 'flex', gap: '1rem', position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
             <X size={16} color="#52525B" />
             <RefreshCw size={16} color="#52525B" />
             <Plus size={16} color="#52525B" />
          </div>
          <textarea 
            placeholder="Enter your topic here..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ ...inputStyle, minHeight: '80px', border: 'none', background: '#050505', padding: '1rem', borderRadius: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <a href="#" style={{ color: '#52525B', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              How to write the best prompt <ExternalLink size={12} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '0.8rem', color: '#52525B' }}>Next step: Research</span>
               <button onClick={() => scrollToSection('research')} style={buttonStyle}>Save & Continue</button>
            </div>
          </div>
        </div>

        {/* Step 2: Research */}
        <div id="research" style={cardStyle}>
          <div style={sectionHeaderStyle}><BookOpen size={18} color="#3B82F6" /> Review the research <span style={{ color: '#52525B', cursor: 'help' }}>ⓘ</span></div>
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#52525B' }}>
             <p style={{ fontSize: '0.9rem' }}>Describe your topic first, then the system will create a research report for you.</p>
             <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <span style={{ fontSize: '0.8rem', color: '#52525B' }}>Next step: Hook</span>
                   <button onClick={() => scrollToSection('hook')} style={{ ...buttonStyle, background: '#1A1A1A', color: '#52525B' }}>Continue</button>
                </div>
             </div>
          </div>
        </div>

        {/* Step 3: Hook */}
        <div id="hook" style={cardStyle}>
          <div style={sectionHeaderStyle}><Key size={18} color="#3B82F6" /> Pick your favorite hook <span style={{ color: '#52525B', cursor: 'help' }}>ⓘ</span></div>
          
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <select style={{ width: '100%', background: '#050505', border: '1px solid #1A1A1A', padding: '0.6rem 1rem', borderRadius: '8px', color: '#52525B', fontSize: '0.85rem', appearance: 'none' }}>
                   <option>Filter by tag</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52525B' }} />
             </div>
             <input 
               type="text" 
               placeholder="Search your vault for a hook template" 
               style={{ flex: 2, background: '#050505', border: '1px solid #1A1A1A', padding: '0.6rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} 
             />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', opacity: 0.5 }}>
             {[1,2,3,4,5].map(i => (
               <div key={i} style={{ aspectRatio: '9/16', background: '#121212', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1A1A1A' }}>
                  <img src={`https://images.unsplash.com/photo-${1541534741688 + i}-6078c65b5a33?w=200&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
               </div>
             ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#EF4444', fontSize: '0.8rem' }}>
             You don't have enough credits to generate more hooks. Please upgrade your plan or purchase credits.
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#52525B', fontSize: '0.85rem' }}>
             Pick a hook template from your Vault and the system will generate options for you.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '0.8rem', color: '#52525B' }}>Next step: Style</span>
               <button onClick={() => scrollToSection('style')} style={buttonStyle}>Save & Continue</button>
            </div>
          </div>
        </div>

        {/* Step 4: Style */}
        <div id="style" style={cardStyle}>
          <div style={sectionHeaderStyle}><Palette size={18} color="#3B82F6" /> Choose a style <span style={{ color: '#52525B', cursor: 'help' }}>ⓘ</span></div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <select style={{ width: '100%', background: '#050505', border: '1px solid #1A1A1A', padding: '0.6rem 1rem', borderRadius: '8px', color: '#52525B', fontSize: '0.85rem', appearance: 'none' }}>
                   <option>Filter by tag</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52525B' }} />
             </div>
             <input 
               type="text" 
               placeholder="Search your vault for a style" 
               style={{ flex: 2, background: '#050505', border: '1px solid #1A1A1A', padding: '0.6rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} 
             />
          </div>
          <div style={{ textAlign: 'center', padding: '2rem', color: '#52525B', fontSize: '0.9rem' }}>
             No styles found. Try changing your search.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '0.8rem', color: '#52525B' }}>Next step: Script</span>
               <button onClick={() => scrollToSection('script')} style={buttonStyle}>Save & Continue</button>
            </div>
          </div>
        </div>

        {/* Step 5: Script */}
        <div id="script" style={cardStyle}>
          <div style={sectionHeaderStyle}><FileText size={18} color="#3B82F6" /> Write the script <span style={{ color: '#52525B', cursor: 'help' }}>ⓘ</span></div>
          <div style={{ display: 'flex', gap: '1rem', position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
             <RefreshCw size={16} color="#52525B" />
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                <Copy size={16} color="#52525B" />
                <ExternalLink size={16} color="#52525B" />
             </div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
             <p style={{ color: '#52525B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Ready to get the first draft of your script?</p>
             <button style={{ ...buttonStyle, margin: '0 auto' }}>Get first draft</button>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
             <div style={{ fontSize: '0.8rem', color: '#52525B', marginBottom: '0.75rem' }}>What changes would you like to make?</div>
             <input type="text" placeholder="e.g. Make it more punchy" style={{ ...inputStyle, border: '1px solid #1A1A1A', borderRadius: '10px', padding: '1rem' }} />
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   {['Facts', 'Hooks', 'Length', 'Translate', 'Restart'].map(action => (
                     <button key={action} style={{ background: 'transparent', border: 'none', color: '#52525B', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <Sparkles size={14} /> {action}
                     </button>
                   ))}
                </div>
                <button style={{ ...buttonStyle, background: '#1E3A8A', color: '#3B82F6', fontSize: '0.8rem' }}>Apply edits</button>
             </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#F59E0B', fontSize: '0.8rem', background: 'rgba(245, 158, 11, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
             <Lightbulb size={16} /> Tip: Made changes to the research, hook, or style? Have the system do a clean rewrite to incorporate your changes.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

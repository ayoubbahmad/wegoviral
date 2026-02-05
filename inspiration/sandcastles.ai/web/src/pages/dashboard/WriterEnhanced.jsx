import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Lightbulb, BookOpen, Key, Palette, FileText, 
  ChevronDown, ExternalLink, RefreshCw, X, Copy, Zap, Plus, Sparkles,
  Check, Clock, Download, Share2
} from 'lucide-react';

export default function WriterEnhanced() {
  const [activeStep, setActiveStep] = useState('topic');
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [selectedHooks, setSelectedHooks] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [scriptGenerated, setScriptGenerated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const sections = [
    { id: 'topic', name: 'Topic', icon: Lightbulb },
    { id: 'research', name: 'Research', icon: BookOpen },
    { id: 'hook', name: 'Hook', icon: Key },
    { id: 'style', name: 'Style', icon: Palette },
    { id: 'script', name: 'Script', icon: FileText },
  ];

  const hookTemplates = [
    { id: 1, title: 'Google Alpha Earth', views: '23M', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80' },
    { id: 2, title: 'What would happen if', views: '9.4M', thumbnail: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=300&q=80' },
    { id: 3, title: 'Education | Here\'s What Hap...', views: '1.7M', thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80' },
    { id: 4, title: 'Question | Is it Just Me?', views: '820M', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80' },
    { id: 5, title: 'Question | 5 Minute...', views: '1M', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&q=80' },
  ];

  const styleTemplates = [
    { id: 1, title: 'Google Alpha Earth', views: '2M', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=80' },
    { id: 2, title: 'What would happen if', views: '9.4M', thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&q=80' },
    { id: 3, title: 'Listicle (5 Steps)', views: '1M', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80' },
    { id: 4, title: 'Long Tutorial', views: '1.7M', thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
    { id: 5, title: 'Rapid Tutorial', views: '580K', thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&q=80' },
    { id: 6, title: 'Simple Tip', views: '78K', thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&q=80' },
    { id: 7, title: 'Problem & Solution', views: '630K', thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&q=80' },
    { id: 8, title: 'Case Study', views: '1.4M', thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&q=80' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveStep(id);
    }
  };

  const toggleHookSelection = (hookId) => {
    setSelectedHooks(prev => 
      prev.includes(hookId) 
        ? prev.filter(id => id !== hookId)
        : [...prev, hookId]
    );
  };

  const handleProcessResearch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResearchComplete(true);
    }, 2000);
  };

  const handleGenerateScript = () => {
    setScriptGenerated(true);
    scrollToSection('script');
  };

  const cardStyle = {
    background: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
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
    color: 'var(--text-primary)', 
    marginBottom: '1.5rem'
  };

  const buttonStyle = {
    background: '#2563EB',
    color: 'var(--text-primary)',
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
          background: 'var(--surface-color)',
          padding: '0.75rem',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>Jump to:</span>
          {sections.map(s => (
            <button 
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', 
                background: activeStep === s.id ? 'var(--border-color)' : 'transparent', 
                color: activeStep === s.id ? 'var(--text-primary)' : 'var(--text-secondary)', 
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
          <div style={sectionHeaderStyle}><Lightbulb size={18} color="#3B82F6" /> Describe your topic <span style={{ color: 'var(--text-secondary)', cursor: 'help' }}>ⓘ</span></div>
          <div style={{ display: 'flex', gap: '1rem', position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
             <X size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
             <RefreshCw size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
             <Plus size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
          </div>
          <textarea 
            placeholder="What do you want to make a video about?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ width: '100%', minHeight: '100px', border: 'none', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              How to write the best prompt <ExternalLink size={12} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Next step: Research</span>
               <button onClick={() => { handleProcessResearch(); scrollToSection('research'); }} style={buttonStyle}>Save & Continue</button>
            </div>
          </div>
        </div>

        {/* Step 2: Research */}
        <div id="research" style={cardStyle}>
          <div style={sectionHeaderStyle}><BookOpen size={18} color="#3B82F6" /> Review the research <span style={{ color: 'var(--text-secondary)', cursor: 'help' }}>ⓘ</span></div>
          
          {isProcessing ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#3B82F6', fontSize: '0.95rem' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Processing your topic...
              </div>
            </div>
          ) : researchComplete ? (
            <div>
              <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Research Summary</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Based on your topic, here are the key insights and trending angles that could make your video successful...
                </p>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                  <li>Key insight #1 about your topic</li>
                  <li>Trending angle that's performing well</li>
                  <li>Audience pain points to address</li>
                </ul>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Next step: Hook</span>
                   <button onClick={() => scrollToSection('hook')} style={buttonStyle}>Continue</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
               <p style={{ fontSize: '0.9rem' }}>Describe your topic first, then the system will create a research report for you.</p>
               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Next step: Hook</span>
                     <button onClick={() => scrollToSection('hook')} style={{ ...buttonStyle, background: 'var(--border-color)', color: 'var(--text-secondary)' }}>Continue</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Step 3: Hook */}
        <div id="hook" style={cardStyle}>
          <div style={sectionHeaderStyle}><Key size={18} color="#3B82F6" /> Pick your favorite hook <span style={{ color: 'var(--text-secondary)', cursor: 'help' }}>ⓘ</span></div>
          
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <select style={{ width: '100%', background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', appearance: 'none' }}>
                   <option>Filter by tag</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
             </div>
             <input 
               type="text" 
               placeholder="Search your vault for a hook template" 
               style={{ flex: 2, background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} 
             />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
             {hookTemplates.map(hook => (
               <div 
                 key={hook.id} 
                 onClick={() => toggleHookSelection(hook.id)}
                 style={{ 
                   position: 'relative',
                   aspectRatio: '9/16', 
                   background: 'var(--surface-hover)', 
                   borderRadius: '12px', 
                   overflow: 'hidden', 
                   border: selectedHooks.includes(hook.id) ? '2px solid #2563EB' : '1px solid var(--border-color)',
                   cursor: 'pointer',
                   transition: 'all 0.2s'
                 }}
               >
                  <img src={hook.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={hook.title} />
                  {selectedHooks.includes(hook.id) && (
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '24px', height: '24px', background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color='var(--text-primary)' />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem 0.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{hook.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{hook.views} views</div>
                  </div>
               </div>
             ))}
          </div>

          {selectedHooks.length > 0 && (
            <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600' }}>
                Selected hooks ({selectedHooks.length})
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Pick a hook template from your Vault and the system will generate options for you.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Next step: Style</span>
               <button onClick={() => scrollToSection('style')} style={buttonStyle}>Save & Continue</button>
            </div>
          </div>
        </div>

        {/* Step 4: Style */}
        <div id="style" style={cardStyle}>
          <div style={sectionHeaderStyle}><Palette size={18} color="#3B82F6" /> Choose a style <span style={{ color: 'var(--text-secondary)', cursor: 'help' }}>ⓘ</span></div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <select style={{ width: '100%', background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', appearance: 'none' }}>
                   <option>Filter by tag</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
             </div>
             <input 
               type="text" 
               placeholder="Search your vault for a style" 
               style={{ flex: 2, background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} 
             />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
             {styleTemplates.map(style => (
               <div 
                 key={style.id} 
                 onClick={() => setSelectedStyle(style.id)}
                 style={{ 
                   position: 'relative',
                   aspectRatio: '9/16', 
                   background: 'var(--surface-hover)', 
                   borderRadius: '12px', 
                   overflow: 'hidden', 
                   border: selectedStyle === style.id ? '2px solid #2563EB' : '1px solid var(--border-color)',
                   cursor: 'pointer',
                   transition: 'all 0.2s'
                 }}
               >
                  <img src={style.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={style.title} />
                  {selectedStyle === style.id && (
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '24px', height: '24px', background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color='var(--text-primary)' />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem 0.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{style.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{style.views} views</div>
                  </div>
               </div>
             ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
              Load more
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Next step: Script</span>
               <button onClick={handleGenerateScript} style={buttonStyle}>Save & Continue</button>
            </div>
          </div>
        </div>

        {/* Step 5: Script */}
        <div id="script" style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <FileText size={18} color="#3B82F6" /> Write the script <span style={{ color: 'var(--text-secondary)', cursor: 'help' }}>ⓘ</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
             <button onClick={() => setShowHistory(!showHistory)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '600' }}>
               <Clock size={16} /> View history
             </button>
             <RefreshCw size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
             <Copy size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
             <Download size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
             <Share2 size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
          </div>
          
          {scriptGenerated ? (
            <div>
              <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', minHeight: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>241 words</div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Copy size={14} /></button>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Download size={14} /></button>
                  </div>
                </div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                  {`This is a revolutionary AI project from Google.

It's called Nano Banana Impact.

And this thing is like Photoshop with superpowers.

Google created this to completely transform how we edit and generate images.

What makes Nano Banana special is its incredible speed and efficiency.

It cuts loading time by a massive 90% compared to cloud solutions.

This means designers can now edit images in real-time with zero lag.

Imagine changing complex design elements instantly instead of waiting for processing.

No more coffee breaks while your computer struggles with a simple filter adjustment.

Nano Banana also uses half the power of previous models.`}
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>What changes would you like to make?</div>
                 <input type="text" placeholder="e.g. Make it more punchy" style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem', background: 'var(--surface-color)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
                 
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       {['Facts', 'Hooks', 'Length', 'Translate', 'Restart'].map(action => (
                         <button key={action} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
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
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Ready to get the first draft of your script?</p>
               <button onClick={handleGenerateScript} style={{ ...buttonStyle, margin: '0 auto' }}>Get first draft</button>
            </div>
          )}
        </div>

        {/* History Modal */}
        {showHistory && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowHistory(false)}>
            <div style={{ background: 'var(--surface-color)', border: '1px solid var(--surface-hover)', borderRadius: '16px', width: '600px', maxHeight: '80vh', overflow: 'auto', padding: '1.5rem' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Script History</h2>
                <button onClick={() => setShowHistory(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--surface-color)', border: '1px solid var(--surface-hover)', borderRadius: '12px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Version {4 - i}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{i} hour{i > 1 ? 's' : ''} ago</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      This is a revolutionary AI project from Google...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
}

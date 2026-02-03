import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Play, Share2, Plus, Bookmark, Sparkles, Send, 
  BarChart3, FileText, Languages, Anchor, Layout, Palette, 
  ChevronDown, Check, ExternalLink, Zap, Eye, TrendingUp,
  MoreVertical, Copy, ArrowUpRight, X, Info
} from 'lucide-react';

export default function Analysis() {
  const [activeActionModal, setActiveActionModal] = useState(null); // 'remix', 'project', 'vault', 'prompt'
  const [promptGenerated, setPromptGenerated] = useState(false);

  const sections = [
    { id: 'actions', name: 'Actions', icon: Zap },
    { id: 'metrics', name: 'Metrics', icon: BarChart3 },
    { id: 'description', name: 'Description', icon: FileText },
    { id: 'transcript', name: 'Transcript', icon: Languages },
    { id: 'hook', name: 'Hook', icon: Anchor },
    { id: 'structure', name: 'Structure', icon: Layout },
    { id: 'style', name: 'Style', icon: Palette }
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const cardStyle = {
    background: '#0B0B0B',
    border: '1px solid #1A1A1A',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#3B82F6',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '1.25rem'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    background: '#0B0B0B',
    border: '1px solid #27272A',
    borderRadius: '16px',
    width: '480px',
    padding: '1.5rem',
    position: 'relative'
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
        {/* Header Area */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>
            Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and...
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#A1A1AA', fontSize: '0.85rem' }}>@zack.chug</span>
            <div style={{ width: '16px', height: '16px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>📸</div>
            <span style={{ color: '#52525B', fontSize: '0.85rem' }}>11mo ago</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left Column - Video Sticky */}
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ 
              width: '100%', 
              aspectRatio: '9/16', 
              background: '#000', 
              borderRadius: '20px', 
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c65b5a33?w=400&q=400" 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
              />
              <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, textAlign: 'center', padding: '0 1rem' }}>
                 <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>what happens when you</div>
                 <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>FAST FOR 30 DAYS?!</div>
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.85rem' }}>
                <Play size={14} fill="currentColor" />
                Play in new tab
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div>
            {/* Jump Navigation */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              marginBottom: '2rem',
              color: '#52525B',
              fontSize: '0.85rem'
            }}>
              <span>Jump to:</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {sections.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #1A1A1A', 
                      background: '#0B0B0B', color: '#A1A1AA', padding: '0.4rem 0.75rem', borderRadius: '8px',
                      fontSize: '0.75rem', cursor: 'pointer'
                    }}
                  >
                    <s.icon size={12} />
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Section */}
            <div id="actions" style={cardStyle}>
              <div style={sectionHeaderStyle}><Zap size={16} /> Actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { id: 'remix', label: 'Remix idea', icon: Sparkles },
                  { id: 'project', label: 'Add to project', icon: Plus },
                  { id: 'vault', label: 'Save to vault', icon: Bookmark },
                  { id: 'prompt', label: 'Create prompt', icon: Send }
                ].map((action, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                        setActiveActionModal(action.id);
                        setPromptGenerated(false);
                    }}
                    style={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                        background: '#141414', border: '1px solid #27272A', padding: '1.25rem', borderRadius: '12px',
                        color: '#A1A1AA', fontSize: '0.85rem', cursor: 'pointer'
                    }}
                  >
                    <action.icon size={18} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Section */}
            <div id="metrics" style={cardStyle}>
              <div style={sectionHeaderStyle}><BarChart3 size={16} /> Metrics</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '1rem', background: '#06170E', border: '1px solid #14532D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22C55E', fontSize: '0.9rem', fontWeight: '600' }}>
                    <TrendingUp size={16} /> 1.4x outlier score
                  </div>
                  <div style={{ width: '14px', height: '14px', border: '1px solid #14532D', borderRadius: '50%', color: '#14532D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>i</div>
                </div>
                <div style={{ padding: '1rem', background: '#081325', border: '1px solid #1E3A8A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3B82F6', fontSize: '0.9rem', fontWeight: '600' }}>
                  <Eye size={16} /> 1.7M views
                </div>
                <div style={{ padding: '1rem', background: '#1c150c', border: '1px solid #78350f', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontSize: '0.9rem', fontWeight: '600' }}>
                    <Zap size={16} /> 2% engagement rate
                  </div>
                  <div style={{ width: '14px', height: '14px', border: '1px solid #78350f', borderRadius: '50%', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>i</div>
                </div>
                <div style={{ padding: '1rem', background: '#250b3a', border: '1px solid #5b21b6', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.9rem', fontWeight: '600' }}>
                  <TrendingUp size={16} /> 34K likes
                </div>
                <div style={{ padding: '1rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontSize: '0.9rem', fontWeight: '600' }}>
                  <Eye size={16} /> 453 comments
                </div>
                <div style={{ padding: '1rem', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#52525B', fontSize: '0.9rem', fontWeight: '600' }}>
                  <TrendingUp size={16} /> 1.9M channel followers
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div id="description" style={cardStyle}>
              <div style={sectionHeaderStyle}><FileText size={16} /> Description</div>
              <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and optimizes your body for peak health. Here's what happens when you fast daily for 12 hours over 30 days: ⏳ First Few Days (Days 1-3): 💨 Blood sugar stabilizes — No more energy crashes. 🧼 Glycogen stores deplete — Your body starts burning stored energy. 🛡️ Insulin drops — Fat becomes more accessible as a fuel source. 🍕 Hunger hormones adjust ...
              </p>
              <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                Show more <ChevronDown size={14} />
              </button>
            </div>

            {/* Transcript Section */}
            <div id="transcript" style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                 <div style={sectionHeaderStyle}><Languages size={16} /> Transcript</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#52525B', fontSize: '0.75rem' }}>127 words</span>
                    <Copy size={14} color="#52525B" />
                    <Share2 size={14} color="#52525B" />
                    <ChevronDown size={14} color="#52525B" />
                 </div>
              </div>
              <div style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: '1.8' }}>
                It happens when you fast for 30 days during Ramadan.<br/><br/>
                The changes are shocking but beneficial.<br/><br/>
                In the first few days your blood sugar drops because there's no more glucose spike and this lowers your insulin and makes fat more accessible to be burned.
              </div>
            </div>

            {/* Hook Analysis */}
            <div id="hook" style={cardStyle}>
              <div style={sectionHeaderStyle}><Anchor size={16} /> Hook Analysis</div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Type</div>
                <div style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>Secret Reveal</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Description</div>
                <div style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Suggests unknown insight or future implication that the viewer doesn't know but would inform what is happening. Teases a feeling that the speaker knows something the viewer doesn't.
                </div>
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Frameworks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>• "X is going to change Y"</div>
                    <div style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>• "Nobody is aware that X is happening, but I think it might change Y"</div>
                </div>
              </div>
            </div>

            {/* Structure Analysis */}
            <div id="structure" style={cardStyle}>
              <div style={sectionHeaderStyle}><Layout size={16} /> Structure Analysis</div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Type</div>
                <div style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>Breakdown</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Description</div>
                <div style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Explains the foundational principles and building blocks of a topic. Useful for identifying and investigating the core elements of a larger topic.
                </div>
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Best For</div>
                <div style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>Product launches, general developments, new technologies, analysis-based stories</div>
              </div>
            </div>

            {/* Style Analysis */}
            <div id="style" style={cardStyle}>
              <div style={sectionHeaderStyle}><Palette size={16} /> Style Analysis</div>
              {[
                { label: 'Tone', value: 'High energy and enthusiasm' },
                { label: 'Voice', value: 'Confident, commanding, and instructive' },
                { label: 'Word Choice', value: 'Common, everyday vocabulary' },
                { label: 'Pacing', value: 'Rapid-fire delivery with minimal pauses' }
              ].map((style, i) => (
                <div key={i} style={{ marginBottom: i === 3 ? 0 : '1.5rem' }}>
                  <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>{style.label}</div>
                  <div style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>{style.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {activeActionModal && (
        <div style={modalOverlayStyle} onClick={() => setActiveActionModal(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            {activeActionModal === 'remix' && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#fff' }}>Remix this video into your own script</h2>
                <p style={{ color: '#71717A', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  The system will write a script using this video as inspiration. You can customize it after a draft is generated.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={{ background: '#2563EB', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', color: '#fff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                    Write script
                  </button>
                </div>
              </>
            )}

            {activeActionModal === 'project' && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#fff' }}>Save video to project</h2>
                <p style={{ color: '#71717A', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  You can choose an existing project, or create a new one.
                </p>
                <div style={{ 
                  background: '#141414', border: '1px solid #27272A', borderRadius: '8px', padding: '0.75rem 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#52525B', fontSize: '0.9rem', cursor: 'pointer',
                  marginBottom: '1.5rem'
                }}>
                  Select a project
                  <ChevronDown size={16} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={{ background: '#2563EB', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', color: '#fff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                    Add
                  </button>
                </div>
              </>
            )}

            {activeActionModal === 'vault' && (
              <div style={{ width: '520px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#fff' }}>Add to vault</h2>
                <p style={{ color: '#71717A', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  Extract the hook, style, or both from this video and save it to your vault. Then use your vault to write winning scripts.
                </p>
                
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Name</label>
                  <p style={{ color: '#71717A', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Enter a name so you can easily find it in your vault</p>
                  <input type="text" defaultValue="Fast for 30 Days during Ramadan ?Fasting isn't j..." style={{ width: '100%', background: '#141414', border: '1px solid #27272A', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Tags</label>
                  <p style={{ color: '#71717A', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Organize your vault by adding tags to this item</p>
                  <div style={{ background: '#141414', border: '1px solid #27272A', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#52525B', fontSize: '0.9rem', cursor: 'pointer' }}>
                    Pick tags
                    <ChevronDown size={16} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <input type="checkbox" style={{ accentColor: '#2563EB' }} />
                      <div>
                        <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>Save hook</div>
                        <div style={{ color: '#71717A', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                           Use the first <input type="number" defaultValue="3" style={{ width: '30px', background: '#141414', border: '1px solid #27272A', borderRadius: '4px', textAlign: 'center', color: '#fff', fontSize: '0.75rem' }} /> sentences as a hook template for future scripts
                        </div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input type="checkbox" style={{ accentColor: '#2563EB' }} />
                      <div>
                        <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          Save style <Info size={12} color="#52525B" />
                        </div>
                        <div style={{ color: '#71717A', fontSize: '0.75rem' }}>Use this style as a guide for future scripts</div>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => setActiveActionModal(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                    Close
                  </button>
                  <button style={{ background: '#2563EB', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', color: '#fff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                    Save to vault
                  </button>
                </div>
              </div>
            )}

            {activeActionModal === 'prompt' && (
              <div style={{ width: promptGenerated ? '600px' : '480px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#fff' }}>Get a writing prompt inspired by this video</h2>
                <p style={{ color: '#71717A', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  You can paste this prompt into your writer of choice (ChatGPT, Claude, Gemini, etc) to generate a script.
                </p>

                {!promptGenerated ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>Include system instructions</div>
                        <div style={{ color: '#71717A', fontSize: '0.75rem' }}>Helpful if you're new to writing and don't have your custom GPTs dialed in</div>
                      </div>
                      <div style={{ width: '40px', height: '22px', background: '#2563EB', borderRadius: '11px', position: 'relative', cursor: 'pointer' }}>
                         <div style={{ position: 'absolute', right: '2px', top: '2px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => setPromptGenerated(true)} style={{ background: '#2563EB', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', color: '#fff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                        Get prompt
                      </button>
                    </div>
                  </>
                ) : (
                    <>
                    <div style={{ 
                        background: '#141414', border: '1px solid #27272A', borderRadius: '12px', padding: '1rem',
                        maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', background: 'transparent', border: 'none', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                                <Copy size={16} /> Copy to clipboard
                            </button>
                        </div>
                        <pre style={{ color: '#A1A1AA', fontSize: '0.8rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontFamily: 'monospace' }}>
                          {`<system_instructions>

<job>
You are a world-class script writer for short-form social media videos.
</job>

<goal>
To create the highest quality content that goes viral every single time.
</goal>

<style_guide>
- Write in a conversational, informal, and friendly tone.
- Use short, punchy sentences to create a fast-paced cadence.
- Use simple language that anyone can understand.
- Avoid jargon and technical terms.
- Sound like human-written content. You must not sound like AI-generated content.
- Use a first-person tone, as if you are speaking to a friend.
- No fluff or wasted words. Be concise and to the point. Get the most value out of every sentence.
- Imbue a high degree of excitement and energy into the script.
- Don't sound corny or cheesy. Avoid cliches and overused phrases. Sound genuine and authentic.
- Output one sentence per line. There should be a blank line between each sentence.
</style_guide>

<target_audience>
- Your target audience is intelligent and curious, but has no background of your topic.
- They won't know any jargon, so you must use simple language that anyone will understand.
- The target audience is your friend, so you must speak to them naturally, not formally.
</target_audience>

</system_instructions>

<script_instructions>
<task>
Write a compelling, attention-grabbing script for a social media short-form video that'll go viral. The final output script should be between 90 and 120 words.
</task>

<topic>
This story revolves around the subject of Ramadan fasting and its impact on the human body. The angle focuses on the physiological benefits experienced over a 30-day period, highlighting the metabolic and physical changes. The payoff is a healthier lifestyle, including fat loss, improved digestion, reduced inflammation, and enhanced mental clarity, ultimately positioning Ramadan fasting as a pathway to metabolic flexibility and overall well-being.
</topic>

<hook>
Open the script with an attention-grabbing hook that draws in the viewer. Execute on the hook using the following instructions:
- Format: Secret Reveal
- Explanation: Suggest an unknown insight or future implication that the viewer doesn't know but would inform what is happening. Tease a feeling that the speaker knows something the viewer doesn't.
</hook>

<structure>
Write the script following a predefined structure that works best for this topic:
- Format: Breakdown
- Explanation: Explain the foundational principles and building blocks of a topic. Useful for identifying and investigating the clients elements of a larger topic.
Ensure that each section flows smoothly into the next, using appropriate transitions without adding unnecessary filler.
</structure>

<style>
Embody the following writing style attributes when creating your script:
- Tone: High energy and enthusiasm
- Voice: Confident, commanding, and instructive
- Word Choice: Common, everyday vocabulary
- Pacing: Rapid-fire delivery with minimal pauses
</style>

<content>
Incorporate the following details in the body of the script. Use the facts to bolster the story in a way that's natural and informative:
1. After one week, autophagy kicks in where damaged cells are repaired and removed.

2. After two weeks your growth hormone increases which helps retain muscle, inflammation decreases which improves your skin health and all your sugar cravings disappear.

3. After one month you have metabolic flexibility so you no longer rely on snacks, reducing the risk of diabetes whilst burning more fat.
</content>

</script_instructions>
`}
                        </pre>
                    </div>
                    </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

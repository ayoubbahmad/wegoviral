import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScriptingIngredients() {
  const variables = [
    {
      name: 'TOPIC',
      color: '#8B5CF6',
      description: 'A one liner describing the video.'
    },
    {
      name: 'ANGLE',
      color: '#8B5CF6',
      description: 'A short summary framing the meat or facts or takes really like what makes up the video.'
    },
    {
      name: 'HOOK FORMAT',
      color: '#8B5CF6',
      description: 'Made up of the spoken hook, what is actually said, as well as any notes on the visual hook that is shown.'
    },
    {
      name: 'STORY FORMAT OR STYLE',
      color: '#8B5CF6',
      description: 'The way the story flows and how it\'s written.'
    },
    {
      name: 'VISUAL FORMAT',
      color: '#8B5CF6',
      description: 'The layout of the visuals.'
    },
    {
      name: 'VISUALS',
      color: '#8B5CF6',
      description: 'Are there specific visuals that really catch your eye?'
    },
    {
      name: 'AUDIO',
      color: '#8B5CF6',
      description: 'The music, the sound effects really like the whole audio vibe of the piece.'
    }
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '5rem' }}>
        <Link 
          to="/dashboard/writer-enhanced"
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Writer
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '900', 
            color: 'var(--text-primary)', 
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            7 CORE VARIABLES
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {variables.map((variable, index) => (
            <div key={index}>
              <div style={{ 
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                background: variable.color,
                borderRadius: '20px',
                marginBottom: '0.75rem'
              }}>
                <h2 style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '800', 
                  color: 'var(--text-primary)',
                  letterSpacing: '0.05em'
                }}>
                  {variable.name}
                </h2>
              </div>
              <p style={{ 
                fontSize: '1.1rem', 
                color: 'var(--text-secondary)', 
                lineHeight: '1.8',
                paddingLeft: '1rem'
              }}>
                {variable.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '4rem', 
          padding: '2rem', 
          background: 'rgba(139, 92, 246, 0.05)', 
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <Lightbulb size={32} color="#8B5CF6" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Pro Tip
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Understanding these 7 core variables will help you create more effective and engaging video scripts. 
            Each variable plays a crucial role in the overall success of your content.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

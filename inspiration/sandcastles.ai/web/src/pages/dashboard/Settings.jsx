import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { User, CreditCard, Share2, Shield, Bell, ChevronRight, Zap } from 'lucide-react';

export default function Settings() {
  const sections = [
    {
      title: "Profile",
      icon: User,
      items: ["Personal Information", "Email Preferences", "Security"]
    },
    {
      title: "Subscription",
      icon: CreditCard,
      items: ["Plan & Billing", "Usage limits", "Payment methods"]
    },
    {
      title: "Integrations",
      icon: Share2,
      items: ["Connected Accounts", "API Access", "Webhooks"]
    }
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2.5rem' }}>Settings</h1>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Credits Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1E1B4B 0%, #000 100%)', 
            border: '1px solid #312E81', 
            borderRadius: '20px', 
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A5B4FC', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                <Zap size={16} fill="currentColor" /> YOUR SUBSCRIPTION
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Pro Plan</h2>
              <p style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>You have <span style={{ color: '#fff', fontWeight: '600' }}>850 / 1000</span> credits remaining this month.</p>
            </div>
            <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>
              Manage Plan
            </button>
          </div>

          {/* Settings Grid */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {sections.map((section, i) => (
              <div key={i} style={{ background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <section.icon size={18} color="#52525B" />
                   <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{section.title}</h3>
                </div>
                <div>
                   {section.items.map((item, j) => (
                     <div 
                        key={j} 
                        style={{ 
                            padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            borderBottom: j === section.items.length - 1 ? 'none' : '1px solid #1A1A1A',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <span style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>{item}</span>
                        <ChevronRight size={16} color="#27272A" />
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
             <button style={{ color: '#EF4444', background: 'transparent', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                Sign out of all devices
             </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

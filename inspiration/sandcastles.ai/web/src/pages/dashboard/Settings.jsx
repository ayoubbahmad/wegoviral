import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function Settings() {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Settings</h1>
        <p style={{ color: '#A1A1AA', fontSize: '1.1rem' }}>Manage your account and platform preferences.</p>
        <div style={{ marginTop: '3rem', padding: '4rem', border: '1px dashed #1A1A1A', borderRadius: '16px', textAlign: 'center', color: '#52525B' }}>
          Settings configuration coming soon...
        </div>
      </div>
    </DashboardLayout>
  );
}

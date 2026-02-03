import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Download, FileText, FileJson, Table, Filter, Search, MoreVertical } from 'lucide-react';

export default function Exports() {
  const exports = [
    { name: "Productivity_Script_V1", type: "docx", date: "Feb 3, 2024", size: "24 KB", status: "Ready" },
    { name: "Fitness_Batch_Outliers", type: "csv", date: "Feb 1, 2024", size: "128 KB", status: "Ready" },
    { name: "Personal_Brand_Remix", type: "pdf", date: "Jan 28, 2024", size: "1.2 MB", status: "Ready" },
    { name: "Topic_Research_Raw", type: "json", date: "Jan 25, 2024", size: "45 KB", status: "Ready" },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'csv': return <Table size={18} color="#10B981" />;
      case 'json': return <FileJson size={18} color="#F59E0B" />;
      default: return <FileText size={18} color="#3B82F6" />;
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Exports</h1>
            <p style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>Download and manage your generated content and data.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button style={{ background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '10px', padding: '0.6rem 1rem', color: '#A1A1AA', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Filter size={16} /> Filter
             </button>
          </div>
        </div>

        <div style={{ background: '#0B0B0B', border: '1px solid #1A1A1A', borderRadius: '16px', overflow: 'hidden' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ borderBottom: '1px solid #1A1A1A', background: '#121212' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>File Name</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Size</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525B', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}></th>
                 </tr>
              </thead>
              <tbody>
                 {exports.map((exp, i) => (
                   <tr key={i} style={{ borderBottom: i === exports.length - 1 ? 'none' : '1px solid #1A1A1A' }}>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {getIcon(exp.type)}
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{exp.name}</span>
                         </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#A1A1AA' }}>{exp.type.toUpperCase()}</td>
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#A1A1AA' }}>{exp.date}</td>
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#A1A1AA' }}>{exp.size}</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                         <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{exp.status}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button style={{ background: 'transparent', border: 'none', color: '#52525B', cursor: 'pointer' }}>
                               <Download size={18} />
                            </button>
                            <button style={{ background: 'transparent', border: 'none', color: '#52525B', cursor: 'pointer' }}>
                               <MoreVertical size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

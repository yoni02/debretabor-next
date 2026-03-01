import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', color: '#b8860b', marginBottom: '0.5rem' }}>Welcome, {session.user?.name}</h1>
      <p style={{ color: '#6b5d4d', marginBottom: '2rem' }}>Manage your church website content below.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <Link href="/admin/events" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'rgba(255,252,248,0.95)', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20, padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(61,53,41,0.06)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
            <h2 style={{ fontSize: '1.2rem', color: '#b8860b', marginBottom: '0.5rem' }}>Events</h2>
            <p style={{ color: '#6b5d4d', fontSize: '0.9rem' }}>Add, edit, and delete church events and feast days</p>
          </div>
        </Link>

        <Link href="/admin/gallery" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'rgba(255,252,248,0.95)', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20, padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(61,53,41,0.06)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖼️</div>
            <h2 style={{ fontSize: '1.2rem', color: '#b8860b', marginBottom: '0.5rem' }}>Gallery</h2>
            <p style={{ color: '#6b5d4d', fontSize: '0.9rem' }}>Upload and manage photos shown on the website</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

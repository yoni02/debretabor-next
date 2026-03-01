'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router   = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError('Invalid email or password.');
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #f8f4ec 0%, #ebe5db 50%, #e5ddd0 100%)' }}>
      <div style={{ background: 'rgba(255,252,248,0.95)', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 24, padding: '3rem 2.5rem', width: '100%', maxWidth: 420, boxShadow: '0 10px 40px rgba(61,53,41,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 1rem', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 2px #C8941A, 0 0 0 5px #130804, 0 0 0 7px #C8941A' }}>
            <Image src="/church-profile.png" alt="Church" width={64} height={64} style={{ objectFit: 'contain', borderRadius: '50%' }} />
          </div>
          <h1 style={{ fontSize: '1.4rem', color: '#b8860b', marginBottom: '0.3rem' }}>Admin Login</h1>
          <p style={{ color: '#6b5d4d', fontSize: '0.85rem' }}>Debre Tabor Holy God Father EOTC</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#6b5d4d', fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(184,168,138,0.5)', background: '#faf8f5', fontSize: '0.95rem', color: '#3d3529', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#6b5d4d', fontWeight: 600 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(184,168,138,0.5)', background: '#faf8f5', fontSize: '0.95rem', color: '#3d3529', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {error && <p style={{ color: '#7A1818', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ padding: '0.85rem', borderRadius: 999, background: 'linear-gradient(135deg, #c9a227, #b8860b)', color: '#faf8f5', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

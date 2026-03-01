'use client';

import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function AdminSignOut() {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button onClick={signOut}
      style={{ color: '#F5EDD8', fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: 8, background: 'transparent', border: '1px solid rgba(245,237,216,0.3)', cursor: 'pointer' }}>
      Sign Out
    </button>
  );
}

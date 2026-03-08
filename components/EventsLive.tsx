'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import EventsPageClient from '@/components/EventsPageClient';
import { SEED_EVENTS, type ChurchEvent } from '@/lib/eventData';

export default function EventsLive() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    // Fetch through the API route (service-role key) so RLS never blocks reads
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events', { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const data: ChurchEvent[] = await res.json();
        setEvents(data.length > 0 ? data : SEED_EVENTS);
      } catch {
        setEvents(SEED_EVENTS);
      }
      setLoading(false);
    }

    fetchEvents();

    // Real-time: re-fetch via API whenever the DB changes
    const channel = supabase
      .channel('events-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchEvents())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#6b5d4d', fontSize: '1rem' }}>
        Loading events…
      </div>
    );
  }

  return <EventsPageClient events={events} />;
}

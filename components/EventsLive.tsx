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

    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error || !data || data.length === 0) {
        setEvents(SEED_EVENTS);
      } else {
        setEvents(data.map(e => ({ ...e, _id: e.id } as ChurchEvent)));
      }
      setLoading(false);
    }

    fetchEvents();

    // Subscribe — any INSERT / UPDATE / DELETE on events instantly refreshes
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

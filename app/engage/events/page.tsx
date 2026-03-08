import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import EventsPageClient from '@/components/EventsPageClient';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { SEED_EVENTS } from '@/lib/eventData';

export const metadata: Metadata = { title: 'Upcoming Events' };

// Always fetch fresh from Supabase so admin changes appear immediately
export const dynamic = 'force-dynamic';

async function getEvents() {
  try {
    const { data, error } = await createSupabaseAdmin()
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error || !data || data.length === 0) return SEED_EVENTS;
    return data.map(e => ({ ...e, _id: e.id }));
  } catch {
    return SEED_EVENTS;
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Liturgies, feast days, and gatherings</p>
      </div>
      <EventsPageClient events={events} />
    </>
  );
}

import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import CalendarClient from '@/components/CalendarClient';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { SEED_EVENTS } from '@/lib/eventData';

export const metadata: Metadata = { title: 'Calendar' };

// Revalidate every 60 seconds so admin-added events appear quickly
export const revalidate = 60;

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

export default async function CalendarPage() {
  const events = await getEvents();
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Calendar</h1>
        <p>Click a date to see events</p>
      </div>
      <CalendarClient events={events} />
    </>
  );
}

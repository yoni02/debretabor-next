import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import EventsPageClient from '@/components/EventsPageClient';
import { SEED_EVENTS } from '@/lib/eventData';

export const metadata: Metadata = { title: 'Upcoming Events' };

async function getEvents() {
  try {
    // In production, fetch from your API:
    // const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, { cache: 'no-store' });
    // return res.json();
    return SEED_EVENTS;
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

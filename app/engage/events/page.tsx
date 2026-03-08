import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import EventsLive from '@/components/EventsLive';

export const metadata: Metadata = { title: 'Upcoming Events' };

export default function EventsPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Liturgies, feast days, and gatherings</p>
      </div>
      <EventsLive />
    </>
  );
}

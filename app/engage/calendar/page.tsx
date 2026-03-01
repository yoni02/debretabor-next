import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import CalendarClient from '@/components/CalendarClient';
import { SEED_EVENTS } from '@/lib/eventData';

export const metadata: Metadata = { title: 'Calendar' };

export default function CalendarPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Calendar</h1>
        <p>Click a date to see events</p>
      </div>
      <CalendarClient events={SEED_EVENTS} />
    </>
  );
}

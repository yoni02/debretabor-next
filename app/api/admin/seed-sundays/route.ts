import { NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

/** Returns every Sunday between start and end (inclusive) as YYYY-MM-DD strings */
function getSundays(start: Date, end: Date): string[] {
  const sundays: string[] = [];
  const d = new Date(start);
  // Advance to the first Sunday on or after start
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  while (d <= end) {
    sundays.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 7);
  }
  return sundays;
}

export async function POST() {
  // Auth check
  const auth = createSupabaseServer();
  const { data: { session } } = await auth.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createSupabaseAdmin();

  // Seed from today through the end of 2 years from now
  const today = new Date();
  const end = new Date(today.getFullYear() + 2, 11, 31); // Dec 31, year+2
  const allSundays = getSundays(today, end);

  // Find already-existing Divine Liturgy dates so we don't double-insert
  const { data: existing } = await db
    .from('events')
    .select('date')
    .eq('title', 'Divine Liturgy')
    .eq('type', 'liturgy');

  const existingDates = new Set((existing ?? []).map((e: { date: string }) => e.date));

  const toInsert = allSundays
    .filter(date => !existingDates.has(date))
    .map(date => ({
      title: 'Divine Liturgy',
      date,
      time: '7:00 AM',
      type: 'liturgy',
      description: 'Morning Chants at 6:30 AM, Divine Liturgy at 7:00 AM, followed by refreshments and fellowship.',
    }));

  if (toInsert.length === 0) {
    return NextResponse.json({ inserted: 0, message: 'All Sundays are already scheduled.' });
  }

  const { error } = await db.from('events').insert(toInsert);
  if (error) {
    console.error('[seed-sundays] db error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    inserted: toInsert.length,
    message: `Added ${toInsert.length} Sunday liturgy events.`,
  });
}

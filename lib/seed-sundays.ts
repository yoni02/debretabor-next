import { createSupabaseAdmin } from './supabase-server';

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

export async function seedSundayLiturgies() {
  try {
    const db = createSupabaseAdmin();
    const today = new Date();
    // Keep a 2-year rolling window of scheduled Sundays
    const end = new Date(today.getFullYear() + 2, 11, 31);
    const allSundays = getSundays(today, end);

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

    if (toInsert.length > 0) {
      await db.from('events').insert(toInsert);
      console.log(`[seed-sundays] Scheduled ${toInsert.length} upcoming Sunday liturgies.`);
    }
  } catch (err) {
    console.error('[seed-sundays] error:', err);
  }
}

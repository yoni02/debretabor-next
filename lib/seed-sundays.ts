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
    const end = new Date(today.getFullYear() + 2, 11, 31);

    // Clean slate: remove all existing liturgy events so there are no stale duplicates
    await db.from('events').delete().eq('type', 'liturgy');

    // Re-insert a clean 2-year window at the correct time
    const toInsert = getSundays(today, end).map(date => ({
      title: 'Divine Liturgy',
      date,
      time: '7:00 AM',
      type: 'liturgy',
      description: 'Morning Chants at 6:30 AM, Divine Liturgy at 7:00 AM, followed by refreshments and fellowship.',
    }));

    const { error } = await db.from('events').insert(toInsert);
    if (error) throw error;
    console.log(`[seed-sundays] Refreshed ${toInsert.length} Sunday liturgy events.`);
  } catch (err) {
    console.error('[seed-sundays] error:', err);
  }
}

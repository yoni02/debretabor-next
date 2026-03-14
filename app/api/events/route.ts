import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const db = createSupabaseAdmin();
  const { data, error } = await db.from('events').select('*').order('date', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Map Supabase `id` → `_id` so the ChurchEvent interface is satisfied
  return NextResponse.json((data ?? []).map(e => ({ ...e, _id: e.id })));
}

function generateRepeatDates(
  startDate: string,
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  until: string
): string[] {
  const dates: string[] = [];
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(until + 'T23:59:59');
  if (start > end) return [startDate];

  const current = new Date(start);
  const pad = (n: number) => String(n).padStart(2, '0');

  while (current <= end) {
    dates.push(`${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`);
    if (frequency === 'daily') {
      current.setDate(current.getDate() + 1);
    } else if (frequency === 'weekly') {
      current.setDate(current.getDate() + 7);
    } else if (frequency === 'biweekly') {
      current.setDate(current.getDate() + 14);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }
  return dates;
}

export async function POST(req: NextRequest) {
  try {
    const auth = createSupabaseServer();
    const { data: { session }, error: sessionError } = await auth.auth.getSession();
    if (sessionError) console.error('[events POST] session error:', sessionError.message);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { repeat, end_time, ...eventFields } = body;

    const toInsert: Record<string, unknown> = {
      title: eventFields.title,
      date: eventFields.date,
      time: eventFields.time,
      type: eventFields.type,
      description: eventFields.description ?? '',
    };
    if (end_time) toInsert.end_time = end_time;

    let dates: string[] = [eventFields.date];
    if (repeat?.frequency && repeat?.until) {
      dates = generateRepeatDates(eventFields.date, repeat.frequency, repeat.until);
    }

    const db = createSupabaseAdmin();
    const inserted: unknown[] = [];

    for (const date of dates) {
      const row = { ...toInsert, date };
      const { data, error } = await db.from('events').insert(row).select().single();
      if (error) {
        console.error('[events POST] db error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      inserted.push({ ...data, _id: data.id });
    }

    if (inserted.length === 1) {
      return NextResponse.json(inserted[0], { status: 201 });
    }
    return NextResponse.json({ created_count: inserted.length, events: inserted }, { status: 201 });
  } catch (err) {
    console.error('[events POST] unexpected:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

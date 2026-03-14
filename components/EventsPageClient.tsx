'use client';

import { useState } from 'react';
import type { ChurchEvent, EventType } from '@/lib/eventData';

const TYPE_ICONS: Record<EventType, string> = {
  liturgy:    'fa-church',
  feast:      'fa-star',
  study:      'fa-book-open',
  fellowship: 'fa-people-group',
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDate(ds: string) {
  const [y, m, d] = ds.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

interface Props {
  events: Omit<ChurchEvent, '_id'>[];
}

const FILTER_TYPES = ['all', 'feast', 'study', 'fellowship'] as const;
type Filter = typeof FILTER_TYPES[number];

export default function EventsPageClient({ events }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const today = new Date();
  const todayStr  = today.toISOString().split('T')[0];
  const in30Days  = new Date(today); in30Days.setDate(today.getDate() + 30);
  const in30Str   = in30Days.toISOString().split('T')[0];

  // Liturgy: only the very next upcoming Sunday service
  const nextLiturgy = events
    .filter(e => e.type === 'liturgy' && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;

  // Non-liturgy: anything within the next 30 days
  const specialEvents = events
    .filter(e => e.type !== 'liturgy' && e.date >= todayStr && e.date <= in30Str)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Combine: next liturgy first, then upcoming specials filtered by tab
  const liturgyRow  = nextLiturgy ? [nextLiturgy] : [];
  const visible =
    filter === 'all'
      ? [...liturgyRow, ...specialEvents]
      : specialEvents.filter(e => e.type === filter);

  return (
    <>
      <div className="events-filter-bar">
        {FILTER_TYPES.map(f => (
          <button
            key={f}
            className={`events-filter-btn${filter === f ? ' is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f !== 'all' && (
              <span
                className="filter-dot"
                style={{
                  background:
                    f === 'feast'      ? 'var(--eth-gold-rim)'  :
                    f === 'study'      ? 'var(--eth-lapis)'     :
                    /* fellowship */     'var(--eth-malachite)',
                }}
              />
            )}
            {f === 'all' ? 'All' : f === 'feast' ? 'Feasts' : f === 'study' ? 'Bible Study' : 'Fellowship'}
          </button>
        ))}
      </div>

      <div className="events-page-grid">
        {visible.length === 0 && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No upcoming events.</p>}
        {visible.map((ev, i) => (
          <div key={i} className={`event-page-card event-${ev.type}`}>
            <div className="epc-accent" />
            <div className="epc-icon">
              <i className={`fas ${TYPE_ICONS[ev.type]}`} />
            </div>
            <div className="epc-body">
              <div className="epc-tag">{ev.type}</div>
              <div className="epc-title">{ev.title}</div>
              <div className="epc-date"><i className="fas fa-calendar" /> {formatDate(ev.date)}</div>
              <div className="epc-time"><i className="fas fa-clock" /> {ev.end_time ? `${ev.time} – ${ev.end_time}` : ev.time}</div>
              {ev.description && <div className="epc-desc">{ev.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

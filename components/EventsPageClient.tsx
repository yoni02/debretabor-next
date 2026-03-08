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

export default function EventsPageClient({ events }: Props) {
  const [filter, setFilter] = useState<EventType | 'all'>('all');

  const today = new Date().toISOString().split('T')[0];

  // For liturgy, only surface the single next upcoming service — not the whole year's worth
  const nextLiturgyDate = events
    .filter(e => e.type === 'liturgy' && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? null;

  const visible = events
    .filter(e => {
      if (e.type === 'liturgy') return e.date === nextLiturgyDate;
      return e.date >= today;
    })
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <div className="events-filter-bar">
        {(['all', 'liturgy', 'feast', 'study', 'fellowship'] as const).map(f => (
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
                    f === 'liturgy'    ? 'var(--eth-crimson)'   :
                    f === 'feast'      ? 'var(--eth-gold-rim)'  :
                    f === 'study'      ? 'var(--eth-lapis)'     :
                    /* fellowship */     'var(--eth-malachite)',
                }}
              />
            )}
            {f === 'all' ? 'All' : f === 'liturgy' ? 'Liturgy' : f === 'feast' ? 'Feasts' : f === 'study' ? 'Bible Study' : 'Fellowship'}
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
              <div className="epc-time"><i className="fas fa-clock" /> {ev.time}</div>
              {ev.description && <div className="epc-desc">{ev.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

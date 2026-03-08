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
  const visible = events
    .filter(e => e.date >= today)
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <div className="events-filter-bar">
        {(['all', 'liturgy', 'feast', 'study'] as const).map(f => (
          <button
            key={f}
            className={`events-filter-btn${filter === f ? ' is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f !== 'all' && (
              <span
                className="filter-dot"
                style={{ background: f === 'liturgy' ? 'var(--eth-crimson)' : f === 'feast' ? 'var(--eth-gold-rim)' : 'var(--eth-lapis)' }}
              />
            )}
            {f === 'all' ? 'All' : f === 'liturgy' ? 'Liturgy' : f === 'feast' ? 'Feasts' : 'Bible Study'}
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

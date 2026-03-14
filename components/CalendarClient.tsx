'use client';

import { useState } from 'react';
import type { ChurchEvent, EventType } from '@/lib/eventData';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const TYPE_COLORS: Record<EventType, string> = {
  liturgy:    'event-liturgy',
  feast:      'event-feast',
  study:      'event-study',
  fellowship: 'event-fellowship',
};
const TYPE_ICONS: Record<EventType, string> = {
  liturgy:    'fa-church',
  feast:      'fa-star',
  study:      'fa-book-open',
  fellowship: 'fa-people-group',
};

function pad(n: number) { return String(n).padStart(2, '0'); }
function dateStr(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

function formatDate(ds: string) {
  const [y, m, d] = ds.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

interface Props {
  events: Omit<ChurchEvent, '_id'>[];
}

export default function CalendarClient({ events }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [activeDate, setActiveDate] = useState<string | null>(null);

  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); setActiveDate(null); }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); setActiveDate(null); }

  function parseTime(t: string): number {
    const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return 0;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const isPM = m[3].toUpperCase() === 'PM';
    if (isPM && h !== 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return h * 60 + min;
  }

  function eventsOn(ds: string) {
    return events
      .filter(e => e.date === ds)
      .sort((a, b) => parseTime(a.time) - parseTime(b.time));
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const in30Days = new Date(today); in30Days.setDate(today.getDate() + 30);
  const in30Str  = dateStr(in30Days.getFullYear(), in30Days.getMonth(), in30Days.getDate());

  const nextLiturgyDate = events
    .filter(e => e.type === 'liturgy' && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? null;

  const upcomingPool = [
    // Only the single next Sunday liturgy
    ...events.filter(e => e.type === 'liturgy' && e.date === nextLiturgyDate),
    // All non-liturgy events within 30 days
    ...events.filter(e => e.type !== 'liturgy' && e.date >= todayStr && e.date <= in30Str),
  ].sort((a, b) => a.date.localeCompare(b.date));

  // When a date is clicked show all events for that day; otherwise show curated upcoming
  const pool = activeDate ? eventsOn(activeDate) : upcomingPool;

  return (
    <div className="engage-grid">
      {/* Calendar widget */}
      <div className="calendar-widget">
        <div className="calendar-header">
          <button className="cal-nav" onClick={prevMonth} aria-label="Previous month"><i className="fas fa-chevron-left" /></button>
          <span className="cal-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <button className="cal-nav" onClick={nextMonth} aria-label="Next month"><i className="fas fa-chevron-right" /></button>
        </div>
        <div className="calendar-days-header">
          {DAY_NAMES.map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="calendar-grid">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="cal-day cal-day--empty" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const ds = dateStr(viewYear, viewMonth, d);
            const dayDate = new Date(viewYear, viewMonth, d);
            const evs = eventsOn(ds);
            const isToday = dayDate.getTime() === today.getTime();
            const hasEvents = evs.length > 0;
            const isActive = ds === activeDate;
            return (
              <div
                key={ds}
                className={`cal-day cal-day--clickable${isToday ? ' cal-day--today' : ''}${hasEvents ? ' cal-day--has-events' : ''}${isActive ? ' cal-day--active' : ''}`}
                onClick={() => setActiveDate(isActive ? null : ds)}
              >
                <span className="cal-day-num">{d}</span>
                {hasEvents && (
                  <div className="cal-dots">
                    {evs.slice(0, 3).map((ev, ei) => (
                      <span key={ei} className={`cal-dot ${TYPE_COLORS[ev.type]}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="cal-legend">
          <span><span className="cal-dot event-liturgy" /> Liturgy</span>
          <span><span className="cal-dot event-feast" /> Feast</span>
          <span><span className="cal-dot event-study" /> Study</span>
        </div>
      </div>

      {/* Events panel */}
      <div className="events-panel">
        <div className="events-panel-header">
          <span className="events-title">{activeDate ? formatDate(activeDate) : 'Upcoming Events'}</span>
          {activeDate && (
            <button className="events-clear" onClick={() => setActiveDate(null)}>✕ Clear</button>
          )}
        </div>
        <ul className="events-list">
          {pool.length === 0 && activeDate && (
            <li className="event-empty event-empty--no-events">
              <p>There are no upcoming events on this date.</p>
              <p>Click on a day with a dot to see events.</p>
            </li>
          )}
          {pool.length === 0 && !activeDate && <li className="event-empty">No upcoming events.</li>}
          {pool.map((ev, i) => (
            <li key={i} className={`event-item ${TYPE_COLORS[ev.type]}`}>
              <div className={`event-icon`}>
                <i className={`fas ${TYPE_ICONS[ev.type]}`} />
              </div>
              <div className="event-body">
                <div className="event-date-label">{formatDate(ev.date)}</div>
                <div className="event-name">{ev.title}</div>
                <div className="event-time"><i className="fas fa-clock" /> {ev.end_time ? `${ev.time} – ${ev.end_time}` : ev.time}</div>
                {ev.description && <div className="event-desc">{ev.description}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

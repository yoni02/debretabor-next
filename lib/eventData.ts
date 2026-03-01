export type EventType = 'liturgy' | 'study' | 'feast';

export interface ChurchEvent {
  _id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: EventType;
  desc: string;
}

export const SEED_EVENTS: Omit<ChurchEvent, '_id'>[] = [
  { date: '2026-03-01', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM, followed by refreshments and fellowship.' },
  { date: '2026-03-08', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-03-15', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-03-22', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-03-29', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-04-19', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-04-26', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-05-03', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-05-10', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-05-17', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-05-24', title: 'Divine Liturgy', time: '6:00 AM', type: 'liturgy', desc: 'Morning Chants at 5:30 AM, Divine Liturgy at 6:00 AM.' },
  { date: '2026-03-06', title: 'Bible Study', time: '7:00 PM', type: 'study', desc: 'Bi-weekly Friday scripture study and reflection. All are welcome.' },
  { date: '2026-03-20', title: 'Bible Study', time: '7:00 PM', type: 'study', desc: 'Bi-weekly Friday scripture study and reflection.' },
  { date: '2026-04-03', title: 'Bible Study', time: '7:00 PM', type: 'study', desc: 'Bi-weekly Friday scripture study and reflection.' },
  { date: '2026-04-17', title: 'Bible Study', time: '7:00 PM', type: 'study', desc: 'Bi-weekly Friday scripture study and reflection.' },
  { date: '2026-05-01', title: 'Bible Study', time: '7:00 PM', type: 'study', desc: 'Bi-weekly Friday scripture study and reflection.' },
  { date: '2026-05-15', title: 'Bible Study', time: '7:00 PM', type: 'study', desc: 'Bi-weekly Friday scripture study and reflection.' },
  { date: '2026-05-29', title: 'Bible Study', time: '7:00 PM', type: 'study', desc: 'Bi-weekly Friday scripture study and reflection.' },
  { date: '2026-03-09', title: 'Feast of the 12 Apostles', time: '6:00 AM', type: 'feast', desc: 'Liturgy commemorating the Holy Twelve Apostles of Christ.' },
  { date: '2026-03-19', title: 'Feast of St. Joseph', time: '6:00 AM', type: 'feast', desc: 'Commemoration of the righteous Joseph, guardian of our Lord.' },
  { date: '2026-04-05', title: 'Palm Sunday', time: '6:00 AM', type: 'feast', desc: 'The triumphant entry of Christ into Jerusalem — palms are blessed and distributed.' },
  { date: '2026-04-09', title: 'Holy Thursday', time: '6:00 AM', type: 'feast', desc: 'Commemoration of the Last Supper and institution of the Holy Eucharist.' },
  { date: '2026-04-10', title: 'Good Friday', time: '6:00 AM', type: 'feast', desc: 'Solemn commemoration of the Crucifixion and death of our Lord Jesus Christ.' },
  { date: '2026-04-12', title: 'Easter — Fasika', time: '5:00 AM', type: 'feast', desc: 'The Resurrection of our Lord! Special night vigil, Liturgy, and community feast.' },
  { date: '2026-05-21', title: 'Feast of the Ascension', time: '6:00 AM', type: 'feast', desc: 'Commemoration of the Ascension of Christ into heaven, 40 days after Easter.' },
  { date: '2026-05-31', title: 'Pentecost — Erast', time: '6:00 AM', type: 'feast', desc: 'Descent of the Holy Spirit upon the Apostles. Special liturgy and community celebration.' },
];
